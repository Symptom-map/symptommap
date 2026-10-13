// ─────────────────────────────────────────────────────────────
// mapa.js — leer y guardar el mapa de la persona con sesión
//
// El mapa es UN documento JSON por persona, con la forma exacta del núcleo
// (src/core/mapa.js). Aquí no hay reglas del mapa: solo se lee y se guarda.
//
// `revision` sube en cada guardado (lo hace la base de datos). Guardar exige
// la revisión que se leyó: si otra pestaña o dispositivo guardó antes, no se
// pisa su trabajo y se avisa con el código 'conflicto'.
//
// El mapa nunca se guarda en el navegador (ni localStorage ni caché).
// ─────────────────────────────────────────────────────────────

import { crearMapa } from '@nucleo/mapa.js'
import { supabase } from './cliente.js'

export class ErrorMapaNube extends Error {
  constructor(codigo) {
    super(codigo)
    this.codigo = codigo
  }
}

/** Devuelve { mapa, revision }. Un mapa nuevo viene vacío. */
export async function cargarMapa() {
  const { data, error } = await supabase.from('mapas').select('datos, revision').maybeSingle()
  if (error) throw new ErrorMapaNube('sin_conexion')
  if (!data) throw new ErrorMapaNube('sin_mapa')
  return { mapa: { ...crearMapa(), ...data.datos }, revision: data.revision }
}

/** Guarda el mapa si nadie lo cambió desde `revision`. Devuelve la revisión nueva. */
export async function guardarMapa(userId, mapa, revision) {
  const { data, error } = await supabase
    .from('mapas')
    .update({ datos: mapa })
    .eq('user_id', userId)
    .eq('revision', revision)
    .select('revision')
  if (error) throw new ErrorMapaNube(error.code === '23514' ? 'demasiado_grande' : 'sin_conexion')
  if (!data || data.length === 0) throw new ErrorMapaNube('conflicto')
  return data[0].revision
}
