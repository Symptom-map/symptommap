// ─────────────────────────────────────────────────────────────
// cliente.js — conexión con Supabase (proyecto `symptommap`, Sydney)
//
// La URL y la clave "publishable" son públicas por diseño: identifican el
// proyecto, no dan permisos. Lo que protege cada mapa son las reglas de la
// base de datos (Row Level Security: cada persona solo ve y cambia lo suyo).
// La clave secreta (service_role) NUNCA va en este código ni en el navegador.
//
// Se pueden reemplazar con VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY
// (por ejemplo, para apuntar a un proyecto de pruebas).
// ─────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const URL_PROYECTO = import.meta.env.VITE_SUPABASE_URL || 'https://uuuhzhryaftirrtvgedh.supabase.co'
const CLAVE_PUBLICA = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_c9VAQR8_pXsu6FmDLHuryg_7M3WaSPs'

export const supabase = createClient(URL_PROYECTO, CLAVE_PUBLICA, {
  auth: {
    // La sesión (no el mapa) queda en el navegador para no pedir la contraseña
    // cada vez. El mapa solo vive en memoria y en la base de datos.
    persistSession: true,
    autoRefreshToken: true,
    // Usamos códigos de 6 dígitos, no enlaces: no hay nada que leer en la URL.
    detectSessionInUrl: false,
  },
})
