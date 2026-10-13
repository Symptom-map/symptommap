// ─────────────────────────────────────────────────────────────
// construir-sitio.mjs — arma el sitio completo que publica Vercel
//
//   dist/        ← app actual (archivos estáticos de la raíz, sin cambios)
//   dist/app/    ← v2 (React + Vite)
//
// SITIO EN CONSTRUCCIÓN: en producción (www.symptommap.com.au) el sitio está
// cerrado. Solo se publica proximamente.html, como / y como 404, así cualquier
// dirección muestra el logo y "Coming soon". Las vistas previas de Vercel
// (protegidas, solo el equipo) siguen armando el sitio completo para probar.
// Para abrir el sitio: en Vercel → Settings → Environment Variables, agregar
// SITIO_ABIERTO = si (solo Production) y volver a publicar.
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

const enConstruccion = process.env.VERCEL_ENV === 'production' && process.env.SITIO_ABIERTO !== 'si'
if (enConstruccion || process.env.SITIO_SIMULAR_CERRADO === 'si') {
  for (const ruta of ['robots.txt', 'sitemap.xml', 'assets']) {
    cpSync(path.join(raiz, ruta), path.join(destino, ruta), { recursive: true })
  }
  cpSync(path.join(raiz, 'proximamente.html'), path.join(destino, 'index.html'))
  cpSync(path.join(raiz, 'proximamente.html'), path.join(destino, '404.html'))
  console.log('Sitio EN CONSTRUCCIÓN: solo la página "Coming soon" (ver comentario arriba)')
  process.exit(0)
}

for (const ruta of PUBLICOS) {
  const origen = path.join(raiz, ruta)
  if (!existsSync(origen)) throw new Error('Falta un archivo público: ' + ruta)
  cpSync(origen, path.join(destino, ruta), { recursive: true })
}

execSync('npx vite build', { cwd: path.join(raiz, 'v2'), stdio: 'inherit' })
console.log('Sitio listo en dist/ (app actual en /, v2 en /app/)')
