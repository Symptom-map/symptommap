import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buscarDiagnosticos, coincidenciaExacta, MAXIMO_SUGERENCIAS } from './catalogo.js'

test('nothing is suggested under 3 characters', () => {
  assert.deepEqual(buscarDiagnosticos(''), [])
  assert.deepEqual(buscarDiagnosticos('ad'), [])
})

test('finds a diagnosis by any part of its English name', () => {
  assert.ok(buscarDiagnosticos('adh').some(d => d.clave === 'tda' && d.etiqueta === 'ADHD / ADD'))
  assert.ok(buscarDiagnosticos('anxiety').some(d => d.clave === 'anx'))
})

test('also finds it by the Spanish name, without accents or capitals', () => {
  assert.ok(buscarDiagnosticos('depresion').some(d => d.clave === 'depresion'))
  assert.ok(buscarDiagnosticos('DEPRESIÓN').some(d => d.clave === 'depresion'))
})

test('never shows more than 6 suggestions', () => {
  assert.ok(buscarDiagnosticos('dis').length <= MAXIMO_SUGERENCIAS)
})

test('exact match recognises a catalogue name, a short form or the Spanish name', () => {
  assert.equal(coincidenciaExacta('ADHD').clave, 'tda')
  assert.equal(coincidenciaExacta('adhd / add').clave, 'tda')
  assert.equal(coincidenciaExacta('Fibromialgia').clave, 'fibro')
  assert.equal(coincidenciaExacta('my own words'), null)
  assert.equal(coincidenciaExacta('  '), null)
})
