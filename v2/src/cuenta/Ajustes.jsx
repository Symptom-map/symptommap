// ─────────────────────────────────────────────────────────────
// Ajustes.jsx — Settings (approved prototype "Settings · B" and
// "Settings · privacy"), only the parts that work today:
// - Account: name and email (read only; changing them is a later task).
// - Privacy & your data: "Delete your account and data", confirmed in place
//   with the wording Ana approved on 25 Oct 2026
//   (docs/FUENTES-Y-DECISIONES.md §3d). Deletion is immediate and complete:
//   borrar_mi_cuenta() in Supabase deletes the account and, in cascade,
//   everything in it.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { ds } from '../ds/index.js'
import { MENSAJES, ocultarCorreo } from './Pantallas.jsx'

export default function Ajustes({ nombre, correo, onVolver, onBorrarCuenta }) {
  const { Button, InlineMessage } = ds()
  const titulo = useRef(null)
  const [confirmando, setConfirmando] = useState(false)
  const [borrando, setBorrando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { titulo.current?.focus() }, [])

  async function borrar() {
    setBorrando(true)
    setError('')
    try {
      await onBorrarCuenta()
    } catch (e) {
      setError(MENSAJES[e?.codigo] || MENSAJES.desconocido)
      setBorrando(false)
    }
  }

  return (
    <div className="ajustes">
      <div className="ajustes__contenido">
        <Button variant="link" onClick={onVolver}>Back to your map</Button>
        <h1 className="sm-h1 ajustes__titulo" tabIndex={-1} ref={titulo}>Settings</h1>

        <section className="ajustes__seccion" aria-labelledby="aj-cuenta">
          <h2 className="sm-h3" id="aj-cuenta">Account</h2>
          <dl className="ajustes__datos">
            <div>
              <dt className="sm-field-label">Name</dt>
              <dd className="sm-body">{nombre || '—'}</dd>
            </div>
            <div>
              <dt className="sm-field-label">Email</dt>
              <dd className="sm-body">{ocultarCorreo(correo)}</dd>
              <dd className="sm-support ajustes__ayuda">Used to sign in and receive security codes.</dd>
            </div>
          </dl>
        </section>

        <section className="ajustes__seccion" aria-labelledby="aj-privacidad">
          <h2 className="sm-h3" id="aj-privacidad">Privacy &amp; your data</h2>
          <div className="ajustes__borrar">
            <p className="sm-emphasis ajustes__subtitulo">Delete your account and data</p>
            <p className="sm-support ajustes__ayuda">This removes your diagnoses, symptoms and notes.</p>
            {!confirmando ? (
              <div><Button variant="link" onClick={() => setConfirmando(true)}>Delete account and data</Button></div>
            ) : (
              <div className="ajustes__confirmar" role="alert">
                <p className="sm-body-sm"><strong>Delete your account and data?</strong></p>
                <p className="sm-body-sm">
                  This deletes your account and everything in it: your diagnoses, profiles, symptoms and notes.
                  For your security, SymptomMap doesn’t keep any of it. If you want to use SymptomMap again,
                  you’ll create a new account and start from zero. This can’t be undone.
                </p>
                {error && <InlineMessage tone="error">{error}</InlineMessage>}
                <div className="panel__botones">
                  <Button variant="secondary" size="sm" disabled={borrando} onClick={() => { setConfirmando(false); setError('') }}>Keep my account</Button>
                  <Button variant="link" disabled={borrando} onClick={borrar}>{borrando ? 'Deleting…' : 'Delete'}</Button>
                </div>
              </div>
            )}
            <p className="sm-support ajustes__ayuda">Backup copies of the database are erased automatically within 7 days.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
