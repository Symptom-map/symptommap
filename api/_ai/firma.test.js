import { test } from 'node:test'
import assert from 'node:assert/strict'
import { firmar, codificar } from './firma.js'

// Ejemplo "get-vanilla" del conjunto de pruebas oficial de AWS Signature V4.
test('firma igual al ejemplo oficial de AWS (get-vanilla)', () => {
  const h = firmar({
    metodo: 'GET', host: 'example.amazonaws.com', ruta: '/', region: 'us-east-1', servicio: 'service',
    claveId: 'AKIDEXAMPLE', claveSecreta: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
    fecha: new Date('2015-08-30T12:36:00Z'),
  })
  assert.equal(h.authorization,
    'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, SignedHeaders=host;x-amz-date, Signature=5fa00fa31553b73ebf1942676e86291e8372ff2a2260956d9b8aae1d763fbf31')
})

test('el ":" del modelo se firma doblemente codificado', () => {
  assert.equal(codificar(codificar('au.anthropic.claude-sonnet-4-5-20250929-v1:0')), 'au.anthropic.claude-sonnet-4-5-20250929-v1%253A0')
})
