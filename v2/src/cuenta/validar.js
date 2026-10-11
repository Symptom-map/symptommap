// ─────────────────────────────────────────────────────────────
// validar.js — reglas de los formularios de cuenta (del prototipo aprobado)
//
// Funciones puras, sin React ni red, para poder probarlas con node --test.
// La fecha de nacimiento solo se usa aquí, en el navegador: nunca se envía.
// ─────────────────────────────────────────────────────────────

export const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const ELEGIBILIDAD = [
  'Psychiatrist',
  'Psychologist',
  'GP / Medical doctor',
  'Other qualified health professional',
  'I have not received a formal diagnosis from a qualified health professional',
]
export const SIN_DIAGNOSTICO = ELEGIBILIDAD[4]

const CORREO = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/

export function correoValido(texto) {
  return CORREO.test(String(texto || '').trim())
}

export function reglasContrasena(contrasena) {
  const c = String(contrasena || '')
  return [
    { etiqueta: 'At least 8 characters', ok: c.length >= 8 },
    { etiqueta: 'Includes a number', ok: /[0-9]/.test(c) },
    { etiqueta: 'Includes an upper and lower-case letter', ok: /[a-z]/.test(c) && /[A-Z]/.test(c) },
  ]
}

/**
 * Revisa la fecha de nacimiento escrita como día, mes (nombre en inglés) y año.
 * Devuelve { valida, edad, error } — error es el texto a mostrar o ''.
 */
export function revisarNacimiento({ dia, mes, anio }, hoy = new Date()) {
  const d = String(dia || '')
  const a = String(anio || '')
  const indiceMes = MESES.indexOf(mes)
  if (d === '' || indiceMes < 0 || a === '') return { valida: false, edad: null, error: '' }
  if (!/^\d{4}$/.test(a) || Number(a) < 1900) return { valida: false, edad: null, error: 'Enter a valid 4-digit year.' }
  const nd = Number(d)
  const na = Number(a)
  const fecha = new Date(na, indiceMes, nd)
  const existe = /^\d{1,2}$/.test(d) && nd >= 1 && fecha.getFullYear() === na && fecha.getMonth() === indiceMes && fecha.getDate() === nd
  if (!existe || fecha > hoy) return { valida: false, edad: null, error: 'Enter a valid date of birth.' }
  const cumplioEsteAnio = hoy.getMonth() > indiceMes || (hoy.getMonth() === indiceMes && hoy.getDate() >= nd)
  const edad = hoy.getFullYear() - na - (cumplioEsteAnio ? 0 : 1)
  return { valida: true, edad, error: '' }
}
