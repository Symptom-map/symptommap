// Prueba de la función completa con fetch simulado (sin red).
import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import handler from '../claude.js'

let llamadas
function simularFetch({ sesionOk = true, bedrockStatus = 200, cuota = true, cuotaStatus = 200 } = {}) {
  llamadas = []
  globalThis.fetch = async (url, opciones = {}) => {
    llamadas.push({ url: String(url), opciones })
    if (String(url).includes('/auth/v1/user')) return new Response('{}', { status: sesionOk ? 200 : 401 })
    if (String(url).includes('/rest/v1/rpc/consumir_cuota_ai')) return new Response(JSON.stringify(cuota), { status: cuotaStatus })
    if (String(url).includes('bedrock-runtime')) return new Response(JSON.stringify({ content: [{ type: 'text', text: 'ok' }] }), { status: bedrockStatus })
    return new Response('{}', { status: 500 })
  }
}
function peticion({ token = 'tkn', cuerpo = { messages: [{ role: 'user', content: 'hola' }] } } = {}) {
  return {
    method: 'POST', body: cuerpo,
    headers: { origin: 'https://www.symptommap.com.au', host: 'www.symptommap.com.au', ...(token ? { authorization: `Bearer ${token}` } : {}) },
  }
}
function respuesta() {
  const r = { codigo: 0, json: null, cabeceras: {} }
  r.setHeader = (k, v) => { r.cabeceras[k] = v }
  r.status = c => { r.codigo = c; return r }
  r.json = j => { r.cuerpo = j; return r }
  return r
}

beforeEach(() => {
  delete process.env.VERCEL_ENV
  process.env.AWS_ACCESS_KEY_ID = 'AKIDEXAMPLE'
  process.env.AWS_SECRET_ACCESS_KEY = 'secreto'
  delete process.env.ANTHROPIC_API_KEY
})

test('sin sesión responde 401 y no llama a la AI', async () => {
  simularFetch()
  const r = respuesta(); await handler(peticion({ token: null }), r)
  assert.equal(r.codigo, 401)
  assert.equal(llamadas.length, 0)
})

test('con sesión inválida responde 401', async () => {
  simularFetch({ sesionOk: false })
  const r = respuesta(); await handler(peticion(), r)
  assert.equal(r.codigo, 401)
  assert.ok(!llamadas.some(l => l.url.includes('bedrock')))
})

test('con sesión válida usa Bedrock Australia, firmado', async () => {
  simularFetch()
  const r = respuesta(); await handler(peticion(), r)
  assert.equal(r.codigo, 200)
  assert.deepEqual(r.cuerpo, { content: [{ type: 'text', text: 'ok' }] })
  const b = llamadas.find(l => l.url.includes('bedrock-runtime'))
  assert.match(b.url, /^https:\/\/bedrock-runtime\.ap-southeast-2\.amazonaws\.com\/model\/au\./)
  assert.match(b.opciones.headers.authorization, /^AWS4-HMAC-SHA256 /)
})

test('si Bedrock falla, error genérico sin contenido', async () => {
  simularFetch({ bedrockStatus: 403 })
  const r = respuesta(); await handler(peticion(), r)
  assert.equal(r.codigo, 502)
})

test('en producción con el sitio cerrado responde 503', async () => {
  simularFetch(); process.env.VERCEL_ENV = 'production'
  const r = respuesta(); await handler(peticion(), r)
  assert.equal(r.codigo, 503)
  assert.equal(llamadas.length, 0)
})

test('sin claves de AWS responde 503 y nunca usa la API de Anthropic', async () => {
  simularFetch(); delete process.env.AWS_ACCESS_KEY_ID; process.env.ANTHROPIC_API_KEY = 'no-se-usa'
  const r = respuesta(); await handler(peticion(), r)
  assert.equal(r.codigo, 503)
  assert.ok(!llamadas.some(l => l.url.includes('anthropic.com')))
})

test('cuenta el pedido con el token de la persona antes de llamar a Bedrock', async () => {
  simularFetch()
  const r = respuesta(); await handler(peticion(), r)
  assert.equal(r.codigo, 200)
  const i = llamadas.findIndex(l => l.url.includes('consumir_cuota_ai'))
  const b = llamadas.findIndex(l => l.url.includes('bedrock-runtime'))
  assert.ok(i >= 0 && i < b)
  assert.equal(llamadas[i].opciones.headers.authorization, 'Bearer tkn')
})

test('si se llegó al límite responde 429 y no llama a Bedrock', async () => {
  simularFetch({ cuota: false })
  const r = respuesta(); await handler(peticion(), r)
  assert.equal(r.codigo, 429)
  assert.ok(!llamadas.some(l => l.url.includes('bedrock')))
})

test('si no se puede comprobar el límite, no gasta (429 y sin Bedrock)', async () => {
  simularFetch({ cuotaStatus: 404 })
  const r = respuesta(); await handler(peticion(), r)
  assert.equal(r.codigo, 429)
  assert.ok(!llamadas.some(l => l.url.includes('bedrock')))
})

test('una petición inválida no gasta cuota', async () => {
  simularFetch()
  const r = respuesta(); await handler(peticion({ cuerpo: { messages: [] } }), r)
  assert.equal(r.codigo, 400)
  assert.ok(!llamadas.some(l => l.url.includes('consumir_cuota_ai')))
})
