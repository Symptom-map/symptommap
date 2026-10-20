// ─────────────────────────────────────────────────────────────
// AgregarSintoma.jsx — the "Add a symptom" window (approved prototype)
//
// - "What you experience" and the optional "When or how does this usually
//   show up?", both in the person's own words, growing as they type.
// - Never asks which diagnosis the symptom belongs to.
// - "Add without analysing" adds it with no connections ("Origin not placed
//   yet"). "Analyse connections" (AI) comes in the next task; until then it is
//   not shown, so there is no button that does nothing.
//
// The parent adds it with the core (agregarSintoma), which merges wording
// that matches an existing symptom instead of creating a second node.
// ─────────────────────────────────────────────────────────────

import { useEffect, useId, useRef, useState } from 'react'
import { ds } from '../ds/index.js'

// Grows a textarea with its text, up to its CSS max-height.
function crecer(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight + 3}px`
}

export default function AgregarSintoma({ onAgregar, onCerrar }) {
  const { Modal, Button } = ds()
  const id = useId()
  const que = useRef(null)
  const [texto, setTexto] = useState('')
  const [cuando, setCuando] = useState('')

  useEffect(() => { que.current?.focus() }, [])
  useEffect(() => {
    const alTeclear = e => { if (e.key === 'Escape' && !e.defaultPrevented) onCerrar() }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [onCerrar])

  const vacio = !texto.trim()
  const agregar = () => { if (!vacio) onAgregar({ texto: texto.trim(), cuando: cuando.trim() }) }

  return (
    <div className="capa">
      <Modal
        title="Add a symptom"
        description="Add something you experience in your own words. You don’t need to know where it comes from yet."
        width={480}
        onClose={onCerrar}
        actions={[<Button key="plain" variant="primary" disabled={vacio} onClick={agregar}>Add without analysing</Button>]}
      >
        <div className="sintoma">
          <label className="sintoma__campo" htmlFor={`${id}-que`}>
            <span className="sm-field-label">What you experience</span>
            <textarea
              id={`${id}-que`} ref={que} className="sintoma__texto" rows={3}
              placeholder="e.g. I shut down in noisy places…"
              value={texto} onChange={e => { setTexto(e.target.value); crecer(e.target) }}
            />
          </label>
          <label className="sintoma__campo" htmlFor={`${id}-cuando`}>
            <span className="sm-field-label">When or how does this usually show up? (optional)</span>
            <textarea
              id={`${id}-cuando`} className="sintoma__texto sintoma__texto--largo" rows={5}
              placeholder="e.g. After a long day with people, I find it harder to speak and need to be somewhere quiet."
              value={cuando} onChange={e => { setCuando(e.target.value); crecer(e.target) }}
            />
          </label>
        </div>
      </Modal>
    </div>
  )
}
