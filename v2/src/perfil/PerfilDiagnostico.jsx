// ─────────────────────────────────────────────────────────────
// PerfilDiagnostico.jsx — the diagnosis profile window (approved prototype)
//
// - First time (right after "Add a diagnosis"): the diagnosis is only added to
//   the map when the profile is saved. "Save profile" stays disabled until the
//   required answers are there. Closing asks "Discard this diagnosis?".
// - Editing later: "Save profile" or "Skip"; "Something else?" appears.
// - The person's words are kept exactly as written (triggers included).
//
// This component decides nothing about the map: the parent saves the profile
// with the core (agregarDiagnostico / guardarPerfil).
// ─────────────────────────────────────────────────────────────

import { useEffect, useId, useState } from 'react'
import { ds } from '../ds/index.js'
import { agregarDesencadenantes, errorEdad, perfilCompleto, perfilVacio } from './preguntas.js'

export default function PerfilDiagnostico({ titulo, preguntas, inicial, primeraVez, onGuardar, onOmitir, onDescartar }) {
  const { Modal, TextField, PillSelect, Button } = ds()
  const id = useId()
  const [perfil, setPerfil] = useState(() => ({ ...perfilVacio(preguntas), ...(inicial || {}) }))
  const [nuevoDesencadenante, setNuevoDesencadenante] = useState('')
  const [preguntaDescartar, setPreguntaDescartar] = useState(false)

  const cambiar = cambios => setPerfil(p => ({ ...p, ...cambios }))
  const completo = perfilCompleto(preguntas, perfil)

  function cerrar() {
    if (primeraVez) setPreguntaDescartar(true)
    else onOmitir()
  }

  useEffect(() => {
    const alTeclear = e => { if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); preguntaDescartar ? setPreguntaDescartar(false) : cerrar() } }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

  function sumarDesencadenantes(texto) {
    if (!String(texto).trim()) return
    cambiar({ desencadenantes: agregarDesencadenantes(perfil.desencadenantes, texto) })
    setNuevoDesencadenante('')
  }

  function escribirDesencadenante(e) {
    const v = e.target.value
    if (v.includes(',')) sumarDesencadenantes(v)
    else setNuevoDesencadenante(v)
  }

  // Suggested triggers plus the ones the person wrote, so theirs can be unticked too.
  const opcionesDesencadenantes = [
    ...preguntas.desencadenantes,
    ...perfil.desencadenantes.filter(t => !preguntas.desencadenantes.includes(t)),
  ]

  function guardar() {
    if (primeraVez && !completo) return
    // A trigger still being typed is kept too.
    const final = nuevoDesencadenante.trim()
      ? { ...perfil, desencadenantes: agregarDesencadenantes(perfil.desencadenantes, nuevoDesencadenante) }
      : perfil
    onGuardar(final)
  }

  const acciones = primeraVez
    ? [<Button key="save" variant="primary" disabled={!completo} onClick={guardar}>Save profile</Button>]
    : [
        <Button key="save" variant="primary" onClick={guardar}>Save profile</Button>,
        <Button key="skip" variant="ghost" onClick={onOmitir}>Skip</Button>,
      ]

  const { patron } = preguntas
  return (
    <div className="capa">
      <Modal title={titulo} description={preguntas.desc} width={600} onClose={cerrar} actions={acciones}>
        <div className="perfil">
          {primeraVez && <p className="sm-support perfil__ayuda">This helps SymptomMap tailor suggestions more closely to your experience.</p>}

          {patron.tipo === 'libre' ? (
            <TextField id={`${id}-patron`} label={patron.label} placeholder={patron.placeholder}
              value={perfil.patron} onChange={e => cambiar({ patron: e.target.value })} />
          ) : (
            <>
              <div role="group" aria-label={patron.label}>
                <PillSelect label={patron.label} options={patron.opciones} multiple={patron.varias} hint={patron.pista}
                  value={patron.varias ? perfil.patron : perfil.patron || null}
                  onChange={v => cambiar({ patron: v })} />
              </div>
              {!primeraVez && (
                <TextField id={`${id}-otro`} label="Something else? (optional)" placeholder="Add in your own words"
                  value={perfil.otro} onChange={e => cambiar({ otro: e.target.value })} />
              )}
            </>
          )}

          <TextField id={`${id}-edad`} label={preguntas.edad.label} placeholder={preguntas.edad.placeholder}
            type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" maxLength={3}
            value={perfil.edad} error={errorEdad(perfil.edad)}
            onChange={e => cambiar({ edad: String(e.target.value).replace(/\D/g, '').slice(0, 3) })} />

          <div role="group" aria-label="Frequent triggers">
            <PillSelect label="Frequent triggers" options={opcionesDesencadenantes} multiple
              value={perfil.desencadenantes} onChange={v => cambiar({ desencadenantes: Array.isArray(v) ? v : [] })} />
          </div>
          <TextField id={`${id}-propio`} label="Add a trigger in your own words" placeholder="Type it, then press Enter"
            value={nuevoDesencadenante} onChange={escribirDesencadenante}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sumarDesencadenantes(e.target.value) } }}
            onBlur={e => sumarDesencadenantes(e.target.value)} />

          <TextField id={`${id}-conocidos`} label={preguntas.conocidos.label} placeholder={preguntas.conocidos.placeholder}
            value={perfil.conocidos} onChange={e => cambiar({ conocidos: e.target.value })} />
        </div>
      </Modal>

      {preguntaDescartar && (
        <div className="capa capa--encima">
          <Modal title="Discard this diagnosis?" description="Your diagnosis hasn’t been added yet." width={440}
            onClose={() => setPreguntaDescartar(false)}
            actions={[
              <Button key="keep" variant="primary" onClick={() => setPreguntaDescartar(false)}>Keep editing</Button>,
              <Button key="discard" variant="ghost" onClick={onDescartar}>Discard diagnosis</Button>,
            ]} />
        </div>
      )}
    </div>
  )
}
