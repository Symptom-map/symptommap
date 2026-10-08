// Punto de entrada de la v2.
//
// El design system (hecho en Claude Design) viene como un paquete que espera
// encontrar React en `window.React`. Por eso se expone React antes de cargarlo
// y solo después se monta la app.

import React from 'react'
import { createRoot } from 'react-dom/client'
import './ds/styles.css'
import './estilos.css'

window.React = React

async function iniciar() {
  await import('./ds/_ds_bundle.js')
  const { default: App } = await import('./App.jsx')
  createRoot(document.getElementById('raiz')).render(<App />)
}

iniciar()
