// ─────────────────────────────────────────────────────────────
// sesion.js — la AI solo responde a personas con sesión iniciada
//
// La app envía el token de su sesión de Supabase (Authorization: Bearer …).
// Se le pregunta a Supabase Auth (Sydney) si es válido. No se guarda nada
// y no se registra quién es la persona.
// ─────────────────────────────────────────────────────────────

// Públicos por diseño (los mismos que usa v2/src/nube/cliente.js).
const URL_SUPABASE = process.env.SUPABASE_URL || 'https://uuuhzhryaftirrtvgedh.supabase.co'
const CLAVE_PUBLICA = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_c9VAQR8_pXsu6FmDLHuryg_7M3WaSPs'

export function tokenDe(req) {
  const valor = req.headers.authorization || ''
  const [tipo, token] = valor.split(' ')
  return tipo === 'Bearer' && token && token.length < 4096 ? token : null
}

/** true si el token corresponde a una sesión válida de Supabase. */
export async function sesionValida(token) {
  if (!token) return false
  try {
    const r = await fetch(`${URL_SUPABASE}/auth/v1/user`, {
      headers: { apikey: CLAVE_PUBLICA, authorization: `Bearer ${token}` },
    })
    return r.ok
  } catch {
    return false
  }
}
