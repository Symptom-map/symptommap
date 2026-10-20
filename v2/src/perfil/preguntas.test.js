import { test } from 'node:test'
import assert from 'node:assert/strict'
import { preguntasPara, perfilVacio, perfilCompleto, errorEdad, agregarDesencadenantes } from './preguntas.js'

test('ADHD has its own set with a single-choice main presentation', () => {
  const p = preguntasPara('tda')
  assert.equal(p.patron.label, 'Main presentation')
  assert.equal(p.patron.varias, false)
  assert.ok(p.desencadenantes.includes('Screens'))
})

test('a diagnosis with known patterns gets them as multi-choice options', () => {
  const p = preguntasPara('bi1')
  assert.equal(p.patron.tipo, 'opciones')
  assert.equal(p.patron.varias, true)
  assert.ok(p.patron.opciones.includes('Racing thoughts'))
})

test('unrecognised wording gets the generic set with patterns in own words', () => {
  const p = preguntasPara(null)
  assert.equal(p.patron.tipo, 'libre')
  assert.deepEqual(perfilVacio(p).patron, '')
})

test('nothing is pre-selected', () => {
  assert.deepEqual(perfilVacio(preguntasPara('tlp')), { patron: [], otro: '', edad: '', desencadenantes: [], conocidos: '' })
})

test('age must be a whole number from 1 to 120', () => {
  assert.equal(errorEdad(''), '')
  assert.equal(errorEdad('22'), '')
  assert.equal(errorEdad('0'), 'Use a number between 1 and 120')
  assert.equal(errorEdad('121'), 'Use a number between 1 and 120')
})

test('first setup needs age, a trigger and a pattern', () => {
  const p = preguntasPara('tlp')
  const base = { patron: ['Impulsivity'], otro: '', edad: '26', desencadenantes: ['Conflict'], conocidos: '' }
  assert.ok(perfilCompleto(p, base))
  assert.ok(!perfilCompleto(p, { ...base, edad: '' }))
  assert.ok(!perfilCompleto(p, { ...base, desencadenantes: [] }))
  assert.ok(!perfilCompleto(p, { ...base, patron: [] }))
  assert.ok(!perfilCompleto(preguntasPara(null), { ...base, patron: '   ' }))
})

test('own triggers keep their wording, split on commas, no repeats', () => {
  assert.deepEqual(agregarDesencadenantes(['Conflict'], 'loud cafés, conflict,  Late nights '), ['Conflict', 'loud cafés', 'Late nights'])
})
