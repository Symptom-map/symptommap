// ─────────────────────────────────────────────────────────────
// BarraLateral.jsx — left sidebar of "My map" (approved prototype)
//
// "My diagnoses": the person's diagnoses in map order and the button that
// opens "Add a diagnosis". "Suggest symptoms" and "Add a symptom" come with
// their own tasks; until then they are not shown (no buttons that do nothing).
// ─────────────────────────────────────────────────────────────

import { ds } from '../ds/index.js'

export default function BarraLateral({ mapa, onAgregarDiagnostico }) {
  const { SidebarGroup, DiagnosisChip, Button } = ds()
  const diagnosticos = [...mapa.diagnosticos].sort((a, b) => a.orden - b.orden)
  const vacio = diagnosticos.length === 0

  return (
    <aside className="barra" aria-label="My diagnoses and symptoms">
      <SidebarGroup title="My diagnoses">
        {vacio ? (
          <>
            <p className="barra__texto">Nothing here yet. Start with one, you can add the rest whenever you want.</p>
            <Button variant="primary" size="sm" onClick={onAgregarDiagnostico}>Add a diagnosis</Button>
          </>
        ) : (
          <div className="barra__lista">
            {diagnosticos.map(d => (
              <DiagnosisChip key={d.id} label={d.etiqueta} slot={d.slot} compact />
            ))}
          </div>
        )}
      </SidebarGroup>
      {!vacio && (
        <div className="barra__acciones">
          <Button variant="primary" size="sm" block onClick={onAgregarDiagnostico}>Add diagnosis</Button>
        </div>
      )}
      {vacio && (
        <SidebarGroup title="Symptoms">
          <p className="barra__texto barra__texto--corto">Symptoms appear here once you add a diagnosis to attach them to.</p>
        </SidebarGroup>
      )}
    </aside>
  )
}
