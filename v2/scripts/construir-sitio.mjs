// ─────────────────────────────────────────────────────────────
// construir-sitio.mjs — arma el sitio completo que publica Vercel
//
//   dist/        ← app actual (archivos estáticos de la raíz, sin cambios)
//   dist/app/    ← v2 (React + Vite)
//
// Solo se copian los archivos públicos de la lista. Documentos internos
// (docs/, AGENTS.md…), node_modules y el código fuente de la v2 no se publican.
// La función api/claude.js la publica Vercel aparte, desde la raíz del repo.
// ─────────────────────────────────────────────────────────────

import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const destino = path.join(raiz, 'dist')

const PUBLICOS = ['index.html', '404.html', 'robots.txt', 'sitemap.xml', 'llms.txt', 'assets', 'src/js', 'src/styles']

rmSync(destino, { recursive: true, force: true })
mkdirSync(destino, { recursive: true })

for (const ruta of PUBLICOS) {
  const origen = path.join(raiz, ruta)
  if (!existsSync(origen)) throw new Error('Falta un archivo público: ' + ruta)
  cpSync(origen, path.join(destino, ruta), { recursive: true })
}

execSync('npx vite build', { cwd: path.join(raiz, 'v2'), stdio: 'inherit' })
console.log('Sitio listo en dist/ (app actual en /, v2 en /app/)')
