import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// La v2 se publica en /app/ dentro del mismo sitio. La app actual sigue en /.
// Para armar el sitio completo: npm run build:sitio (lo usa Vercel).
// El núcleo del mapa vive fuera de esta carpeta (../src/core) y se comparte
// tal cual: la v2 nunca copia ni reimplementa sus reglas.
export default defineConfig({
  base: '/app/',
  plugins: [react()],
  resolve: {
    alias: {
      '@nucleo': fileURLToPath(new URL('../src/core', import.meta.url)),
    },
  },
  server: {
    fs: { allow: ['..'] },
  },
  build: {
    outDir: '../dist/app',
    emptyOutDir: true,
    target: 'es2022',
  },
})
