// ─────────────────────────────────────────────────────────────
// PantallaChica.jsx — notice for phones (Ana, 26 Oct 2026)
//
// The pilot is computer-only: a phone version needs its own prototype
// (docs/FUENTES-Y-DECISIONES.md §3e). On narrow screens the app shows this
// notice instead of a squeezed map. "Continue anyway" lets someone on a
// larger tablet go on; the choice lasts for this visit only.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { ds } from '../ds/index.js'

const CONSULTA = '(max-width: 699px)'

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

export default function PantallaChica({ onSeguir }) {
  const { Card, Button, Logo } = ds()
  return (
    <div className="cuenta">
      <Card variant="panel" className="cuenta__panel chica">
        {Logo ? <Logo variant="lockup" size={28} /> : null}
        <h1 className="sm-h2 chica__titulo">SymptomMap works on a computer for now</h1>
        <p className="sm-body chica__texto">The map needs a bigger screen. Open this page on a laptop or desktop computer:</p>
        <p className="sm-emphasis chica__enlace">www.symptommap.com.au/app</p>
        <Button variant="ghost" size="sm" onClick={onSeguir}>Continue anyway</Button>
      </Card>
    </div>
  )
}
