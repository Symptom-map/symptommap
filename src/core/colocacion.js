// ─────────────────────────────────────────────────────────────
// colocacion.js — dónde aparece cada nodo en el mapa
//
// Reglas tomadas del prototipo aprobado (Claude Design):
// - Los diagnósticos se reparten en una fila mientras la persona
//   no haya movido ninguno.
// - Cuando la persona ya ordenó su mapa, nada de lo que movió cambia
//   de lugar: un diagnóstico nuevo busca un lugar libre cerca de la fila.
// - Cada síntoma se coloca en abanico debajo de sus diagnósticos
//   (alrededor del punto medio entre ellos).
// - Lo que la persona arrastra queda donde lo dejó.
//
// Todo es determinista: el mismo mapa siempre se ve igual.
// Sin Math.random.
// ─────────────────────────────────────────────────────────────

export const MUNDO = { ancho: 790, alto: 520 }
export const FILA_Y = 110
export const FILA_MARGEN = 92
export const DISTANCIA_LIBRE = 118   // separación mínima entre diagnósticos
export const CENTRO_SIN_DIAGNOSTICO = { x: 395, y: 150 }

/** Posición x del diagnóstico i de n en la fila. */
export function xEnFila(i, n) {
  if (n <= 1) return MUNDO.ancho / 2
  return Math.round(FILA_MARGEN + i * ((MUNDO.ancho - FILA_MARGEN * 2) / (n - 1)))
}

/**
 * Busca un lugar libre para un diagnóstico nuevo cuando el mapa ya
 * fue ordenado por la persona. Recorre la fila y luego filas más abajo.
 */
export function lugarLibre(ocupados) {
  const libre = (x, y) => ocupados.every(o => Math.hypot(o.x - x, o.y - y) >= DISTANCIA_LIBRE)
  for (let anillo = 0; anillo < 4; anillo++) {
    const y = FILA_Y + anillo * 120
    for (let k = 0; k <= 12; k++) {
      const x = Math.round(FILA_MARGEN + k * ((MUNDO.ancho - FILA_MARGEN * 2) / 12))
      if (libre(x, y)) return { x, y }
    }
  }
  return { x: MUNDO.ancho / 2, y: FILA_Y }
}

/**
 * Posición del síntoma número k (0, 1, 2…) entre los que comparten
 * exactamente los mismos diagnósticos. `centros` son las posiciones de
 * esos diagnósticos; vacío = síntoma flotante.
 */
export function lugarEnAbanico(centros, k) {
  const cx = centros.length ? centros.reduce((t, c) => t + c.x, 0) / centros.length : CENTRO_SIN_DIAGNOSTICO.x
  const cy = centros.length ? centros.reduce((t, c) => t + c.y, 0) / centros.length : CENTRO_SIN_DIAGNOSTICO.y
  const anillo = Math.floor(k / 5)
  const angulo = (Math.PI / 2) + ((k % 5) - 2) * 0.62 + (anillo % 2 ? 0.31 : 0)
  const radio = (centros.length > 1 ? 150 : 120) + anillo * 70
  return {
    x: Math.round(Math.max(70, Math.min(MUNDO.ancho - 70, cx + Math.cos(angulo) * radio))),
    y: Math.round(Math.max(90, Math.min(MUNDO.alto - 40, cy + Math.sin(angulo) * radio))),
  }
}

/**
 * Curva de cada arista (en px, con signo). Un síntoma compartido abre
 * sus aristas en abanico para que no se superpongan.
 * i = posición de este diagnóstico entre los n del síntoma.
 */
export function curvaArista(i, n) {
  return n > 1 ? (i - (n - 1) / 2) * 26 + (i % 2 ? 4 : -4) : 13
}
