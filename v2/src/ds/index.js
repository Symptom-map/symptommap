// Acceso a los componentes del design system ya cargados (ver main.jsx).
export function ds() {
  const DS = window.SymptomMapDesignSystem_dfef9e
  if (!DS) throw new Error('El design system no está cargado')
  return DS
}
