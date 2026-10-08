// ─────────────────────────────────────────────────────────────
// color.js — asignación de color de los diagnósticos
//
// Copia exacta del algoritmo del design system
// (components/map/diagnosisColor.js). No modificar aquí: si el
// design system cambia el algoritmo, se vuelve a copiar.
//
// El color NO es una propiedad del diagnóstico: se asigna por mapa,
// para que los diagnósticos de una persona queden lo más separados
// posible en la rueda de 10 colores.
//
//   Regla 01 — reparto parejo al crear:  slot(i) = round(i * 10 / n)
//   Regla 02 — el hueco más amplio al agregar; lo que ya está en el
//              mapa nunca cambia de color por sí solo.
//
// Decisión de producto (8 oct 2026): el sistema propone el color con
// la Regla 02 y la persona puede cambiarlo (ver mapa.js → cambiarColor).
// ─────────────────────────────────────────────────────────────

// Posiciones de la rueda (1–10) y su tono. Los colores reales viven
// en los tokens del design system (--sm-dx-N-base, -tint, -ink).
export const RUEDA = [
  { slot: 1, nombre: 'Blue', tono: 250 },
  { slot: 2, nombre: 'Violet', tono: 282 },
  { slot: 3, nombre: 'Orchid', tono: 314 },
  { slot: 4, nombre: 'Rose', tono: 346 },
  { slot: 5, nombre: 'Coral', tono: 18 },
  { slot: 6, nombre: 'Orange', tono: 50 },
  { slot: 7, nombre: 'Gold', tono: 88 },
  { slot: 8, nombre: 'Lime', tono: 118 },
  { slot: 9, nombre: 'Green', tono: 146 },
  { slot: 10, nombre: 'Teal', tono: 178 },
]

/** Regla 01 — reparto parejo para n diagnósticos creados juntos. */
export function asignarSlots(n) {
  const salida = []
  const cuenta = Math.max(1, Math.min(10, n))
  for (let i = 0; i < cuenta; i++) salida.push(Math.round(i * 10 / cuenta) % 10 + 1)
  return salida
}

/** Distancia entre dos posiciones, medida alrededor de la rueda. */
export function distanciaEnRueda(a, b) {
  const d = Math.abs(a - b) % 10
  return Math.min(d, 10 - d)
}

/** Regla 02 — la posición que toma un diagnóstico nuevo. null si no quedan. */
export function slotParaAgregar(ocupados) {
  if (ocupados.length >= 10) return null
  let mejor = null
  let puntaje = -1
  for (let i = 1; i <= 10; i++) {
    if (ocupados.indexOf(i) >= 0) continue
    let masCercano = 10
    for (const t of ocupados) masCercano = Math.min(masCercano, distanciaEnRueda(t, i))
    if (masCercano > puntaje) {
      puntaje = masCercano
      mejor = i
    }
  }
  return mejor
}

/** Menor separación de tono (en grados) que logra un conjunto de posiciones. */
export function separacionMinima(slots) {
  let min = 360
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = RUEDA[slots[i] - 1].tono
      const b = RUEDA[slots[j] - 1].tono
      const d = Math.abs(a - b) % 360
      min = Math.min(min, Math.min(d, 360 - d))
    }
  }
  return slots.length < 2 ? 360 : min
}
