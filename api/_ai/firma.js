// ─────────────────────────────────────────────────────────────
// firma.js — firma AWS Signature Version 4 (sin dependencias)
//
// Bedrock exige que cada petición vaya firmada con las claves de AWS.
// Se implementa aquí con node:crypto para no agregar paquetes a la función.
// Probado con el ejemplo oficial de AWS (ver firma.test.js).
// ─────────────────────────────────────────────────────────────

import { createHash, createHmac } from 'node:crypto'

const sha256 = datos => createHash('sha256').update(datos, 'utf8').digest('hex')
const hmac = (clave, datos) => createHmac('sha256', clave).update(datos, 'utf8').digest()

// Codificación RFC 3986 que pide AWS (encodeURIComponent deja sin codificar !'()*).
export function codificar(texto) {
  return encodeURIComponent(texto).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

/**
 * Devuelve los encabezados firmados para una petición.
 * - ruta: la ruta tal como se envía (con segmentos ya codificados una vez).
 * - Fuera de S3, AWS firma la ruta codificando cada segmento OTRA vez
 *   (por eso "au.anthropic...:0" se envía con %3A y se firma con %253A).
 */
export function firmar({ metodo, host, ruta, cuerpo = '', region, servicio, claveId, claveSecreta, fecha = new Date(), encabezados = {} }) {
  const amzFecha = fecha.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dia = amzFecha.slice(0, 8)

  const todos = { ...Object.fromEntries(Object.entries(encabezados).map(([k, v]) => [k.toLowerCase(), String(v).trim()])), host, 'x-amz-date': amzFecha }
  const nombres = Object.keys(todos).sort()
  const canonicos = nombres.map(n => `${n}:${todos[n]}\n`).join('')
  const firmados = nombres.join(';')
  const rutaCanonica = ruta.split('/').map(s => codificar(s)).join('/') || '/'

  const peticionCanonica = [metodo, rutaCanonica, '', canonicos, firmados, sha256(cuerpo)].join('\n')
  const alcance = `${dia}/${region}/${servicio}/aws4_request`
  const aFirmar = ['AWS4-HMAC-SHA256', amzFecha, alcance, sha256(peticionCanonica)].join('\n')

  let clave = hmac('AWS4' + claveSecreta, dia)
  clave = hmac(clave, region)
  clave = hmac(clave, servicio)
  clave = hmac(clave, 'aws4_request')
  const firma = createHmac('sha256', clave).update(aFirmar, 'utf8').digest('hex')

  return {
    ...encabezados,
    'x-amz-date': amzFecha,
    authorization: `AWS4-HMAC-SHA256 Credential=${claveId}/${alcance}, SignedHeaders=${firmados}, Signature=${firma}`,
  }
}
