// ─────────────────────────────────────────────────────────────
// ai.js — pedir algo a la AI desde la v2
//
// Va a /api/claude con el token de la sesión: la función solo responde a
// personas con sesión iniciada. Enviar SOLO el contexto de salud mínimo y
// nunca nombre, correo ni ids (AGENTS.md). La respuesta es una sugerencia:
// nada entra al mapa sin que la persona lo acepte (aceptarSugerencia).
// ─────────────────────────────────────────────────────────────

import { supabase } from './cliente.js'

export class ErrorAI extends Error {
  constructor(codigo) {
    super(codigo)
    this.codigo = codigo
  }
}

/** Devuelve el texto de la respuesta de Claude. */
export async function pedirAI(texto, maxTokens = 1000) {
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
