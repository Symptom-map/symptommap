// ─────────────────────────────────────────────────────────────
// comprobar-produccion.mjs — the production build has no test mode
//
// Builds the site as Vercel production does (VERCEL_ENV=production, site
// open) and fails if anything from test mode (v2/src/prueba.js) is in the
// bundle: the "Try without an account" link, the #prueba route or the
// example AI answers. Runs in CI (.github/workflows/tests.yml).
// Rebuild normally afterwards if you need the preview build in dist/.
// ─────────────────────────────────────────────────────────────

import { execSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const v2 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assets = path.join(v2, '..', 'dist', 'app', 'assets')
const PROHIBIDO = ['Try without an account', '#prueba', 'Example reason (test mode)', 'VITE_MODO_PRUEBA']

execSync('node scripts/construir-sitio.mjs', {
  cwd: v2,
  stdio: 'inherit',
  env: { ...process.env, VERCEL_ENV: 'production', SITIO_ABIERTO: 'si' },
})

const encontrados = []
for (const archivo of readdirSync(assets).filter(a => a.endsWith('.js'))) {
  const texto = readFileSync(path.join(assets, archivo), 'utf8')
  for (const p of PROHIBIDO) if (texto.includes(p)) encontrados.push(`${archivo}: "${p}"`)
}

if (encontrados.length) {
  console.error('Test mode found in the production build:\n  ' + encontrados.join('\n  '))
  process.exit(1)
}
console.log('OK: the production build has no test-mode code.')
