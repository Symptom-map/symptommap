// ─────────────────────────────────────────────────────────────
// prueba.js — test mode without an account (Ana, 22 Oct 2026)
//
// Only on Vercel previews and local development, never in production:
// scripts/construir-sitio.mjs sets VITE_MODO_PRUEBA=si only when the build is
// not production, and Vite replaces the check below at build time, so the
// production bundle has no way in.
//
// In test mode the map lives in memory only: no account, nothing is sent to
// Supabase, nothing is saved, and the AI is never called (pedirAI answers
// with an example). Closing or reloading the page clears it.
// ─────────────────────────────────────────────────────────────

export const MODO_PRUEBA_DISPONIBLE = import.meta.env.DEV || import.meta.env.VITE_MODO_PRUEBA === 'si'

let activo = false

export function activarModoPrueba() {
  if (MODO_PRUEBA_DISPONIBLE) activo = true
}

export function salirModoPrueba() {
  activo = false
}

export function enModoPrueba() {
  return MODO_PRUEBA_DISPONIBLE && activo
}

/**
 * Example AI answer: connects to the first two diagnoses on the map (the
 * reader drops a number that is not on the map) and says it is an example.
 */
export async function respuestaDeEjemplo() {
  await new Promise(r => setTimeout(r, 700))
  return JSON.stringify({
    connections: [
      { n: 1, reason: 'Example reason (test mode): no AI was used.' },
      { n: 2, reason: 'Example reason (test mode): no AI was used.' },
    ],
  })
}
