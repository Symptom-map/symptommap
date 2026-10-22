// ─────────────────────────────────────────────────────────────
// ai.js — ask the AI something from v2
//
// Calls /api/claude with the session token: the function only answers people
// who are logged in. Send ONLY the minimum health context and never a name,
// email or ids (AGENTS.md). The answer only reaches the map through an action
// the person takes (docs/FUENTES-Y-DECISIONES.md §3c).
// ─────────────────────────────────────────────────────────────

import { supabase } from './cliente.js'
import { MODO_PRUEBA_DISPONIBLE, enModoPrueba, respuestaDeEjemplo } from '../prueba.js'

export class ErrorAI extends Error {
  constructor(codigo) {
    super(codigo)
    this.codigo = codigo
  }
}

/** Devuelve el texto de la respuesta de Claude. */
export async function pedirAI(texto, maxTokens = 1000) {
  // Test mode never calls the AI (prueba.js).
  if (MODO_PRUEBA_DISPONIBLE && enModoPrueba()) return respuestaDeEjemplo()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new ErrorAI('sin_sesion')

  let r
  try {
    r = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ max_tokens: maxTokens, messages: [{ role: 'user', content: texto }] }),
    })
  } catch {
    throw new ErrorAI('sin_conexion')
  }
  if (r.status === 401) throw new ErrorAI('sin_sesion')
  if (r.status === 429) throw new ErrorAI('demasiados_intentos')
  if (!r.ok) throw new ErrorAI('no_disponible')
  const datos = await r.json()
  return (datos.content || []).map(b => b.text || '').join('').trim()
}
