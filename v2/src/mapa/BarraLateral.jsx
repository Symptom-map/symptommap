// ─────────────────────────────────────────────────────────────
// BarraLateral.jsx — left sidebar of "My map" (approved prototype)
//
// "My diagnoses": the person's diagnoses in map order, each with "Edit
// profile", then "Add diagnosis" and "Add a symptom". "Symptoms": every
// symptom, with a bar in the colours of the diagnoses it connects to (grey
// when its origin is not placed yet). "Suggest symptoms" comes with the AI
// task; until then it is not shown (no buttons that do nothing).
// ─────────────────────────────────────────────────────────────

import { diagnosticosDe } from '@nucleo/mapa.js'
import { ds } from '../ds/index.js'

// Bar colour of a symptom row: one colour per connected diagnosis, in equal parts.
function barra(slots) {
  if (slots.length === 0) return { '--fila-barra': 'var(--sm-grey)' }
  if (slots.length === 1) return { '--fila-barra': `var(--sm-dx-${slots[0]}-base)` }
  const paso = 100 / slots.length
  const tramos = slots.map((s, i) => `var(--sm-dx-${s}-base) ${(i * paso).toFixed(2)}% ${((i + 1) * paso).toFixed(2)}%`)
  return { '--fila-barra': `linear-gradient(to bottom, ${tramos.join(', ')})` }
}

export default function BarraLateral({ mapa, onAgregarDiagnostico, onAgregarSintoma, onEditarPerfil }) {
  const { SidebarGroup, DiagnosisChip, Button, IconButton, Icon, SymptomRow } = ds()
  const diagnosticos = [...mapa.diagnosticos].sort((a, b) => a.orden - b.orden)
  const vacio = diagnosticos.length === 0

  return (
    <aside className="barra" aria-label="My diagnoses and symptoms">
      <SidebarGroup title="My diagnoses">
        {/* Empty map: the canvas says what to do and has the only button, so the
            sidebar stays quiet instead of repeating it (Ana, 21 Oct 2026). */}
        {vacio ? null : (
          <div className="barra__lista">
            {diagnosticos.map(d => (
              <DiagnosisChip
                key={d.id}
                label={d.etiqueta}
                slot={d.slot}
                compact
                actions={
                  <IconButton label={`Edit profile: ${d.etiqueta}`} variant="ghost" size="sm" onClick={() => onEditarPerfil(d.id)}>
                    <Icon name="edit" size={14} color="var(--sm-ink-meta)" />
                  </IconButton>
                }
              />
            ))}
          </div>
        )}
      </SidebarGroup>
      {!vacio && (
        <div className="barra__acciones">
          <Button variant="primary" size="sm" block onClick={onAgregarDiagnostico}>Add diagnosis</Button>
          <Button variant="ghost" size="sm" block onClick={onAgregarSintoma}>Add a symptom</Button>
        </div>
      )}
      <SidebarGroup title="Symptoms">
        {mapa.sintomas.length === 0 ? (
          vacio ? null : <p className="barra__texto barra__texto--corto">Add something you experience, in your own words.</p>
        ) : (
          <div className="barra__filas">
            {mapa.sintomas.map(s => {
              const slots = diagnosticosDe(mapa, s.id).map(d => d.slot)
              return <SymptomRow key={s.id} label={s.texto} slot={slots[0] ?? 1} sources={slots} compact style={barra(slots)} />
            })}
          </div>
        )}
      </SidebarGroup>
    </aside>
  )
}
