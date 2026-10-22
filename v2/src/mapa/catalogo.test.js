import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buscarDiagnosticos, coincidenciaExacta, MAXIMO_SUGERENCIAS } from './catalogo.js'

test('nothing is suggested under 3 characters', () => {
  assert.deepEqual(buscarDiagnosticos(''), [])
  assert.deepEqual(buscarDiagnosticos('ad'), [])
})

test('finds a diagnosis by any part of its English name', () => {
  assert.ok(buscarDiagnosticos('adh').some(d => d.clave === 'tda' && d.etiqueta === 'ADHD'))
  assert.ok(buscarDiagnosticos('anxiety').some(d => d.clave === 'anx'))
})

test('also finds it by the Spanish name, without accents or capitals', () => {
  assert.ok(buscarDiagnosticos('depresion').some(d => d.clave === 'depresion'))
  assert.ok(buscarDiagnosticos('DEPRESIÓN').some(d => d.clave === 'depresion'))
})

test('never shows more than 6 suggestions', () => {
  assert.ok(buscarDiagnosticos('dis').length <= MAXIMO_SUGERENCIAS)
})

test('every name is its own option, never two names joined with "/"', () => {
  const nombres = buscarDiagnosticos('add').concat(buscarDiagnosticos('adhd'), buscarDiagnosticos('tdah'), buscarDiagnosticos('borderline'))
  assert.ok(nombres.every(d => !d.etiqueta.includes('/')))
  assert.ok(buscarDiagnosticos('add').some(d => d.etiqueta === 'ADD' && d.clave === 'tda'))
  assert.ok(buscarDiagnosticos('tdah').some(d => d.etiqueta === 'TDAH' && d.clave === 'tda'))
  assert.ok(buscarDiagnosticos('borderline').some(d => d.etiqueta === 'Borderline' && d.clave === 'tlp'))
})

test('names that start with the text come first', () => {
  assert.equal(buscarDiagnosticos('ptsd')[0].etiqueta, 'PTSD')
})

test('exact match only recognises a full catalogue name (English or Spanish)', () => {
  assert.equal(coincidenciaExacta('adhd / add'), null)
  assert.equal(coincidenciaExacta('ADHD').clave, 'tda') // only hides "Use …"; the key is set only when picked
  assert.equal(coincidenciaExacta('Fibromialgia').clave, 'fibro')
  assert.equal(coincidenciaExacta('my own words'), null)
  assert.equal(coincidenciaExacta('  '), null)
})
