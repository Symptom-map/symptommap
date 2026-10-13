import { test } from 'node:test'
import assert from 'node:assert/strict'
import { peticionBedrock, bedrockConfigurado, MODELO_POR_DEFECTO } from './bedrock.js'

const env = { AWS_ACCESS_KEY_ID: 'AKIDEXAMPLE', AWS_SECRET_ACCESS_KEY: 'secreto' }

test('por defecto usa el perfil de Australia desde Sydney', () => {
  const p = peticionBedrock({ texto: 'hola', maxTokens: 100, env, fecha: new Date('2026-10-13T12:00:00Z') })
  assert.ok(MODELO_POR_DEFECTO.startsWith('au.'))
  assert.equal(p.url, 'https://bedrock-runtime.ap-southeast-2.amazonaws.com/model/au.anthropic.claude-sonnet-4-5-20250929-v1%3A0/invoke')
  assert.match(p.encabezados.authorization, /Credential=AKIDEXAMPLE\/20261013\/ap-southeast-2\/bedrock\/aws4_request/)
  assert.deepEqual(JSON.parse(p.cuerpo), { anthropic_version: 'bedrock-2023-05-31', max_tokens: 100, messages: [{ role: 'user', content: 'hola' }] })
})

test('el modelo se puede cambiar con BEDROCK_MODELO', () => {
  const p = peticionBedrock({ texto: 'x', maxTokens: 10, env: { ...env, BEDROCK_MODELO: 'au.anthropic.otro-v1:0' } })
  assert.match(p.url, /\/model\/au\.anthropic\.otro-v1%3A0\/invoke$/)
})

test('sin claves de AWS no se considera configurado', () => {
  assert.equal(bedrockConfigurado({}), false)
  assert.equal(bedrockConfigurado(env), true)
})
