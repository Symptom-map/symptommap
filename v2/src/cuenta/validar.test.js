import { test } from 'node:test'
import assert from 'node:assert/strict'
import { correoValido, reglasContrasena, revisarNacimiento } from './validar.js'

const HOY = new Date(2026, 9, 11) // 11 oct 2026

test('correo', () => {
  assert.ok(correoValido('ana@example.com'))
  assert.ok(correoValido('  ana.p+sm@live.vu.edu.au '))
  assert.ok(!correoValido('ana@'))
  assert.ok(!correoValido('ana example.com'))
})

test('contraseña: las tres reglas del prototipo', () => {
  assert.deepEqual(reglasContrasena('abc').map(r => r.ok), [false, false, false])
  assert.deepEqual(reglasContrasena('Abcdefg1').map(r => r.ok), [true, true, true])
  assert.deepEqual(reglasContrasena('abcdefg1').map(r => r.ok), [true, true, false])
})

test('nacimiento: 18 años justo hoy cuenta como 18', () => {
  assert.deepEqual(revisarNacimiento({ dia: '11', mes: 'October', anio: '2008' }, HOY), { valida: true, edad: 18, error: '' })
  assert.equal(revisarNacimiento({ dia: '12', mes: 'October', anio: '2008' }, HOY).edad, 17)
})

test('nacimiento: fechas imposibles o futuras', () => {
  assert.equal(revisarNacimiento({ dia: '30', mes: 'February', anio: '2000' }, HOY).error, 'Enter a valid date of birth.')
  assert.equal(revisarNacimiento({ dia: '1', mes: 'January', anio: '2030' }, HOY).error, 'Enter a valid date of birth.')
  assert.equal(revisarNacimiento({ dia: '1', mes: 'January', anio: '98' }, HOY).error, 'Enter a valid 4-digit year.')
  assert.equal(revisarNacimiento({ dia: '29', mes: 'February', anio: '2000' }, HOY).valida, true)
})

test('nacimiento incompleto no muestra error todavía', () => {
  assert.deepEqual(revisarNacimiento({ dia: '5', mes: '', anio: '' }, HOY), { valida: false, edad: null, error: '' })
})
