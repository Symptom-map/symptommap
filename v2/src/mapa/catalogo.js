// ─────────────────────────────────────────────────────────────
// catalogo.js — autocomplete suggestions for "Add a diagnosis"
//
// The person can always write their diagnosis in their own words; the
// catalogue only suggests names. It reads the existing diagnosis registry
// (src/js/data.js, English and Spanish names) so there is a single list.
// Expanding the catalogue (ICD-11 + DSM-5-TR synonyms, reviewed by the
// psychologist) is pending: docs/FUENTES-Y-DECISIONES.md §4.
//
// Pure functions (no React, no network) so they can be tested with node --test.
// Matching rule from the approved prototype: at least 3 characters, the text
// appears anywhere in a name, at most 6 suggestions.
// ─────────────────────────────────────────────────────────────

import { DIAGNOSES } from '../../../src/js/data.js'
import { normalizar } from '../../../src/core/mapa.js'

export const MINIMO_CARACTERES = 3
export const MAXIMO_SUGERENCIAS = 6

// Each name is its own suggestion (Ana, 21 Oct 2026: "ADHD / ADD" is two
// names, never one label). A registry entry like "ADHD / ADD" or "TDA / TDAH"
// gives four options ("ADHD", "ADD", "TDA", "TDAH") that share one internal
// key, so the profile questions are the same whichever name the person picks.
function nombresDe(d) {
  const partes = [d.labelEn, d.label].flatMap(t => String(t).split('/')).map(t => t.trim()).filter(Boolean)
  const vistos = new Set()
  return partes.filter(t => {
    const n = normalizar(t)
    if (vistos.has(n)) return false
    vistos.add(n)
    return true
  })
}

const OPCIONES = DIAGNOSES.flatMap(d => nombresDe(d).map(etiqueta => ({ clave: d.id, etiqueta, nombre: normalizar(etiqueta) })))

/** Catalogue names that match what the person typed (empty list under 3 characters). */
export function buscarDiagnosticos(texto) {
  const consulta = normalizar(texto)
  if (consulta.length < MINIMO_CARACTERES) return []
  // Names that start with the text first, then names that contain it.
  const empieza = OPCIONES.filter(o => o.nombre.startsWith(consulta))
  const contiene = OPCIONES.filter(o => !o.nombre.startsWith(consulta) && o.nombre.includes(consulta))
  return [...empieza, ...contiene].slice(0, MAXIMO_SUGERENCIAS).map(({ clave, etiqueta }) => ({ clave, etiqueta }))
}

/**
 * The catalogue name that is exactly what the person typed, or null. Only
 * used to hide "Use “…”" when it would repeat a suggestion: typing never sets
 * the internal key, only picking from the list does (FUNCTIONAL-INVENTORY §8,
 * "ambiguous free text is never guessed").
 */
export function coincidenciaExacta(texto) {
  const consulta = normalizar(texto)
  if (!consulta) return null
  const o = OPCIONES.find(x => x.nombre === consulta)
  return o ? { clave: o.clave, etiqueta: o.etiqueta } : null
}
