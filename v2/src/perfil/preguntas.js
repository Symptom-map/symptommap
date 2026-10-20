// ─────────────────────────────────────────────────────────────
// preguntas.js — the questions of the diagnosis profile
//
// Wording and options are the approved UX copy of the Claude Design
// prototype (8 Oct 2026). They are clinical content: the psychologist still
// has to review them before the pilot (docs/FUENTES-Y-DECISIONES.md §4).
//
// Rules (FUNCTIONAL-INVENTORY §5):
// - The question set is chosen by the internal key (claveCanonica from the
//   catalogue); the title always shows the person's own wording.
// - Specialised sets for the main diagnoses; diagnoses with known patterns get
//   those as options; anything else (including unrecognised wording) gets a
//   generic set with patterns in the person's own words. Nothing is invented.
// - Patterns that can coexist are multi-select; ADHD's main presentation is
//   single-select. Nothing is pre-selected.
// - First setup requires: age at diagnosis (1–120), at least one trigger and
//   at least one pattern (when the set has a pattern section).
//
// Pure functions (no React) so they can be tested with node --test.
// ─────────────────────────────────────────────────────────────

const DESENCADENANTES_COMUNES = ['Stress', 'Noise / environment', 'Social interaction', 'Irregular sleep', 'Unexpected change']
const CONOCIDOS_COMUNES = { label: 'Symptoms you already know you have', placeholder: 'e.g. what you already notice…' }
const ELIGE_VARIAS = 'Choose any that fit.'

const ESPECIALIZADOS = {
  adhd: {
    desc: 'Tell me how it shows up for you. Suggestions then sit closer to your experience.',
    patron: { label: 'Main presentation', opciones: ['Predominantly inattentive', 'Predominantly hyperactive', 'Combined', 'Not sure / mixed'], varias: false },
    desencadenantes: ['Stress', 'Noise / environment', 'Long tasks', 'Social interaction', 'Irregular sleep', 'Screens'],
    edad: 'e.g. 22',
    conocidos: { label: 'Symptoms you already know you have', placeholder: 'e.g. procrastination, hyperfocus, forgetting…' },
  },
  bpd: {
    desc: 'Borderline looks different in every person. This helps personalise the suggestions.',
    patron: { label: 'Pattern you recognise most', opciones: ['Intense fear of abandonment', 'Shifts in identity', 'Impulsivity', 'Fast emotional swings', 'Frequent dissociation'], varias: true },
    desencadenantes: ['Perceived rejection', 'Conflict', 'Being alone', 'Work stress', 'Unexpected change', 'Criticism'],
    edad: 'e.g. 26',
    conocidos: { label: 'Symptoms you recognise in yourself', placeholder: 'e.g. intense shame, emotional swings…' },
  },
  cptsd: {
    desc: 'It varies a lot with the kind of trauma and how it is processed. This personalises the suggestions.',
    patron: { label: 'Most present right now', opciones: ['Hypervigilance', 'Dissociation', 'Emotional flashbacks', 'Toxic shame', 'Difficulty trusting'], varias: true },
    desencadenantes: ['Conflict', 'Criticism', 'Perceived abandonment', 'Accumulated stress', 'Body sensations'],
    edad: 'e.g. 32',
    conocidos: { label: 'Symptoms you recognise in yourself', placeholder: 'e.g. dissociation under stress…' },
  },
  autism: {
    desc: 'Autism shows up differently for everyone. This helps the suggestions fit you.',
    patron: { label: 'What you notice most', opciones: ['Sensory sensitivity', 'Social energy', 'Need for routine', 'Deep focus', 'Shutdowns or meltdowns'], varias: true },
    desencadenantes: ['Noise', 'Crowds', 'Unexpected change', 'Social demands', 'Bright light', 'Tiredness'],
    edad: 'e.g. 24',
    conocidos: { label: 'Symptoms you already know you have', placeholder: 'e.g. needing quiet after people…' },
  },
  anxiety: {
    desc: 'Anxiety can sit in the body, the thoughts, or both. This personalises the suggestions.',
    patron: { label: 'Where you feel it most', opciones: ['Constant worry', 'Physical tension', 'Restlessness', 'Trouble sleeping', 'Not sure'], varias: true },
    desencadenantes: ['Uncertainty', 'Work or study', 'Health worries', 'Social situations', 'Money', 'Tiredness'],
    edad: 'e.g. 19',
    conocidos: { label: 'Symptoms you already know you have', placeholder: 'e.g. going over conversations…' },
  },
}

// Diagnoses with known patterns but no specialised set.
const PATRONES = {
  anorexia: ['Thoughts about food take up a lot of space', 'Strict rules around eating', 'Feeling uneasy after eating', 'Checking my body often', 'Wanting to feel in control', 'Avoiding meals with others'],
  bulimia: ['Eating that feels out of control', 'Guilt or shame after eating', 'Trying to undo eating afterwards', 'Keeping eating private', 'Mood tied to eating'],
  depression: ['Low mood most days', 'Losing interest in things', 'Everything takes more energy', 'Sleep changes', 'Feeling empty or hopeless', 'Pulling away from people'],
  dysthymia: ['Low mood that lasts a long time', 'Little energy', 'Feeling flat rather than sad', 'Hard to feel hopeful'],
  social: ['Worry about being judged', 'Dreading social plans', 'Replaying conversations afterwards', 'Blushing or shaking around people', 'Holding back from speaking up'],
  ptsd: ['Memories that intrude', 'Nightmares', 'Avoiding reminders', 'Feeling on edge', 'Startling easily'],
  bipolar: ['Periods of very high energy', 'Periods of low mood', 'Needing less sleep at times', 'Racing thoughts', 'Acting on impulse in high periods'],
  ocd: ['Unwanted thoughts that keep returning', 'Checking or repeating things', 'Needing things to feel right', 'Relief that doesn’t last', 'Time lost to routines'],
  panic: ['Sudden waves of intense fear', 'Racing heart or breathlessness', 'Worry about the next one', 'Avoiding places linked to panic'],
  dissociative: ['Feeling detached from myself', 'Gaps in memory', 'The world feeling unreal', 'Losing track of time'],
}

// Catalogue key (src/js/data.js) → question set.
const POR_CLAVE = {
  tda: { especializado: 'adhd' },
  tlp: { especializado: 'bpd' },
  cptsd: { especializado: 'cptsd' },
  aut: { especializado: 'autism' },
  anx: { especializado: 'anxiety' },
  an: { patrones: 'anorexia' },
  bulimia: { patrones: 'bulimia' },
  depresion: { patrones: 'depression' },
  distimia: { patrones: 'dysthymia' },
  fobia: { patrones: 'social' },
  tept: { patrones: 'ptsd' },
  bi1: { patrones: 'bipolar' },
  bi2: { patrones: 'bipolar' },
  toc: { patrones: 'ocd' },
  panico: { patrones: 'panic' },
  disoc: { patrones: 'dissociative' },
}

/**
 * The questions for one diagnosis.
 * patron.tipo: 'opciones' (pills) or 'libre' (own words).
 */
export function preguntasPara(claveCanonica) {
  const destino = POR_CLAVE[claveCanonica] || {}
  const e = ESPECIALIZADOS[destino.especializado]
  if (e) {
    return {
      desc: e.desc,
      patron: { tipo: 'opciones', label: e.patron.label, opciones: e.patron.opciones, varias: e.patron.varias, pista: e.patron.varias ? ELIGE_VARIAS : undefined },
      desencadenantes: e.desencadenantes,
      edad: { label: 'Age at diagnosis', placeholder: e.edad },
      conocidos: e.conocidos,
    }
  }
  const opciones = PATRONES[destino.patrones]
  if (opciones) {
    return {
      desc: 'It shows up differently for everyone. This helps the suggestions fit you.',
      patron: { tipo: 'opciones', label: 'What you notice most', opciones, varias: true, pista: ELIGE_VARIAS },
      desencadenantes: DESENCADENANTES_COMUNES,
      edad: { label: 'Age at diagnosis', placeholder: 'e.g. 25' },
      conocidos: CONOCIDOS_COMUNES,
    }
  }
  return {
    desc: 'Tell me a little about how it shows up for you. Suggestions then sit closer to your experience.',
    patron: { tipo: 'libre', label: 'Patterns you recognise most', placeholder: 'In your own words, e.g. what shows up most for you' },
    desencadenantes: DESENCADENANTES_COMUNES,
    edad: { label: 'Age at diagnosis', placeholder: 'e.g. 25' },
    conocidos: CONOCIDOS_COMUNES,
  }
}

/** An empty profile (nothing pre-selected). */
export function perfilVacio(preguntas) {
  const varias = preguntas.patron.tipo === 'opciones' && preguntas.patron.varias
  return { patron: varias ? [] : '', otro: '', edad: '', desencadenantes: [], conocidos: '' }
}

/** Error text for the age field, or '' (empty is not an error yet). */
export function errorEdad(edad) {
  const v = String(edad ?? '')
  if (!v) return ''
  const n = Number(v)
  return /^\d{1,3}$/.test(v) && n >= 1 && n <= 120 ? '' : 'Use a number between 1 and 120'
}

/** Required on first setup: age, at least one trigger, at least one pattern. */
export function perfilCompleto(preguntas, perfil) {
  const edadOk = String(perfil.edad ?? '') !== '' && errorEdad(perfil.edad) === ''
  const desencadenantesOk = Array.isArray(perfil.desencadenantes) && perfil.desencadenantes.length > 0
  const patronOk = Array.isArray(perfil.patron) ? perfil.patron.length > 0 : String(perfil.patron ?? '').trim() !== ''
  return edadOk && desencadenantesOk && patronOk
}

/**
 * Adds triggers written by the person ("a, b" → two chips), kept in their
 * exact wording, without repeating one that is already there (any case).
 */
export function agregarDesencadenantes(actuales, texto) {
  const lista = [...(actuales || [])]
  for (const parte of String(texto || '').split(',').map(t => t.trim()).filter(Boolean)) {
    if (!lista.some(t => t.toLowerCase() === parte.toLowerCase())) lista.push(parte)
  }
  return lista
}
