// ─────────────────────────────────────────────────────────────
// PantallaChica.jsx — notice for phones (Ana, 26 Oct 2026)
//
// The pilot is for large screens: a phone version needs its own prototype
// (docs/FUENTES-Y-DECISIONES.md §3e). Below 700 px wide the app shows this
// notice instead of a squeezed map. The rule is about screen width, not the
// kind of device: a large tablet is wider than 700 px and goes straight in.
// There is no way past the notice (Ana, 31 Oct 2026).
//
// Design (design system readme + the 404 page): logo lockup on cream, one
// white panel, one single-line illustration in charcoal ink (line-head,
// "mind"), Outfit title, one primary action (copy the link, so the person can
// send it to themselves).
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { ds } from '../ds/index.js'
import cabeza from '../../../assets/line-head.png'

const CONSULTA = '(max-width: 699px)'
const ENLACE = 'www.symptommap.com.au/app'

export function usePantallaChica() {
  const [chica, setChica] = useState(() => window.matchMedia?.(CONSULTA).matches ?? false)
  useEffect(() => {
    const m = window.matchMedia?.(CONSULTA)
    if (!m) return
    const cambio = e => setChica(e.matches)
    m.addEventListener('change', cambio)
    return () => m.removeEventListener('change', cambio)
  }, [])
  return chica
}

export default function PantallaChica() {
  const { Card, Button, Logo } = ds()
  const enlace = useRef(null)
  const [copiado, setCopiado] = useState(false)

  // If the clipboard is not available, select the link so the phone shows
  // its own "Copy" menu.
  function seleccionar() {
    const rango = document.createRange()
    rango.selectNodeContents(enlace.current)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(rango)
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(`https://${ENLACE}`)
      setCopiado(true)
    } catch {
      seleccionar()
    }
  }

  return (
    <div className="chica">
      <header className="chica__cabeza">
        {Logo ? <Logo variant="lockup" size={28} /> : <span className="sm-h3">SymptomMap</span>}
      </header>
      <main className="chica__centro">
        <Card variant="panel" className="chica__panel">
          <span className="chica__ilustracion" style={{ '--ilustracion': `url(${cabeza})` }} aria-hidden="true" />
          <h1 className="sm-h2 chica__titulo">SymptomMap works on a computer for now</h1>
          <p className="sm-body chica__texto">The map needs a bigger screen. Open this link on a laptop or desktop computer.</p>

          <p className="sm-emphasis chica__enlace" ref={enlace} onClick={seleccionar}>{ENLACE}</p>
          <Button variant="primary" block onClick={copiar}>
            {copiado ? 'Link copied' : 'Copy link'}
          </Button>
          <p className="sr-only" aria-live="polite">{copiado ? 'Link copied' : ''}</p>

        </Card>
      </main>
    </div>
  )
}
