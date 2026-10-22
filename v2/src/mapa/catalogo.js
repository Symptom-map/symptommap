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

// Every name a catalogue entry can be found by: the English label, the
// Spanish label and each part separated by "/" (e.g. "ADHD", "ADD").
function nombresDe(d) {
  const partes = [d.labelEn, d.label].flatMap(t => [t, ...String(t).split('/')])
  return [...new Set(partes.map(normalizar).filter(Boolean))]
}

const ENTRADAS = DIAGNOSES.map(d => ({ clave: d.id, etiqueta: d.labelEn, nombres: nombresDe(d) }))

/** Catalogue entries that match what the person typed (empty list under 3 characters). */
export function buscarDiagnosticos(texto) {
  const consulta = normalizar(texto)
  if (consulta.length < MINIMO_CARACTERES) return []
  return ENTRADAS
    .filter(e => e.nombres.some(n => n.includes(consulta)))
    .slice(0, MAXIMO_SUGERENCIAS)
    .map(({ clave, etiqueta }) => ({ clave, etiqueta }))
}

/**
 * The catalogue entry whose full name (English or Spanish) is exactly what the
 * person typed, or null. Only used to hide "Use “…”" when it would repeat the
 * suggestion: typing never sets the internal key, only picking from the list
 * does (FUNCTIONAL-INVENTORY §8, "ambiguous free text is never guessed").
 */
export function coincidenciaExacta(texto) {
  const consulta = normalizar(texto)
  if (!consulta) return null
  const e = DIAGNOSES.find(d => normalizar(d.labelEn) === consulta || normalizar(d.label) === consulta)
  return e ? { clave: e.id, etiqueta: e.labelEn } : null
}
