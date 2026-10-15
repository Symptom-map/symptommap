// ─────────────────────────────────────────────────────────────
// bedrock.js — Claude a través de Amazon Bedrock (Australia)
//
// Decisión del 13 oct 2026 (docs/FUENTES-Y-DECISIONES.md §3b): la AI se
// procesa solo en Australia. Se usa un perfil de inferencia "au." desde
// Sydney: Bedrock reparte las peticiones entre Sydney y Melbourne y nunca
// fuera de Australia.
//
// Variables de entorno (solo en Vercel, nunca en el código ni el navegador):
//   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY  — usuario IAM con permiso mínimo
//   AWS_REGION      — por defecto ap-southeast-2 (Sydney)
//   BEDROCK_MODELO  — perfil de inferencia; por defecto Claude Sonnet 4.6 AU,
//                     el mismo modelo que usaba la app con la API directa
// ─────────────────────────────────────────────────────────────

import { firmar } from './firma.js'

export const MODELO_POR_DEFECTO = 'au.anthropic.claude-sonnet-4-6'

export function bedrockConfigurado(env = process.env) {
  return Boolean(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY)
}

/** Arma la petición firmada (separado para poder probarlo sin red). */
export function peticionBedrock({ texto, maxTokens, env = process.env, fecha }) {
  const region = env.AWS_REGION || 'ap-southeast-2'
  const modelo = env.BEDROCK_MODELO || MODELO_POR_DEFECTO
  const host = `bedrock-runtime.${region}.amazonaws.com`
  const ruta = `/model/${encodeURIComponent(modelo)}/invoke`
  const cuerpo = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: texto }],
  })
  const encabezados = firmar({
    metodo: 'POST', host, ruta, cuerpo, region, servicio: 'bedrock',
    claveId: env.AWS_ACCESS_KEY_ID, claveSecreta: env.AWS_SECRET_ACCESS_KEY, fecha,
    encabezados: { 'content-type': 'application/json', accept: 'application/json' },
  })
  return { url: `https://${host}${ruta}`, encabezados, cuerpo }
}

/** Devuelve { ok, status, content }. Nunca registra el contenido. */
export async function pedirABedrock({ texto, maxTokens }) {
  const { url, encabezados, cuerpo } = peticionBedrock({ texto, maxTokens })
  const respuesta = await fetch(url, { method: 'POST', headers: encabezados, body: cuerpo })
  const datos = await respuesta.json().catch(() => null)
  return { ok: respuesta.ok && Boolean(datos), status: respuesta.status, content: datos?.content || [] }
}
