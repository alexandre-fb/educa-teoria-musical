/**
 * Core musical cromático: representação de notas, conversões MIDI e geração de intervalos.
 * Toda a lógica musical de notas fica neste arquivo; componentes usam apenas os helpers exportados.
 */

// --- 1. Representação de nota ---

export type Pitch =
  | 'C' | 'C#'
  | 'D' | 'D#'
  | 'E'
  | 'F' | 'F#'
  | 'G' | 'G#'
  | 'A' | 'A#'
  | 'B'

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Note = `${Pitch}${Octave}`

// --- 2. Escala cromática base (12 semitons) ---

export const CHROMATIC_SCALE: Pitch[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
]

// --- Helpers internos de parsing ---

/** Extrai pitch e oitava de uma Note (ex: "C#4" → { pitch: 'C#', octave: 4 }). */
function parseNote(note: Note): { pitch: Pitch; octave: Octave } {
  const last = note.slice(-1)
  const octave = parseInt(last, 10) as Octave
  const pitch = note.slice(0, -1) as Pitch
  if (!CHROMATIC_SCALE.includes(pitch)) {
    throw new Error(`Nota inválida: ${note}`)

  }
  return { pitch, octave }
}

// --- 3. Conversão Note → MIDI ---

/** Converte nota para número MIDI. C0 = 12, A4 = 69. */
export function noteToMidi(note: Note): number {
  const { pitch, octave } = parseNote(note)
  const pitchIndex = CHROMATIC_SCALE.indexOf(pitch)
  return 12 + octave * 12 + pitchIndex
}

// --- 4. Conversão MIDI → Note ---

/** Converte número MIDI em Note. Clamp no MIDI garante sempre C0–B8 (evita pitch+oitava inválidos). */
export function midiToNote(midi: number): Note {
  // C0 = 12, B8 = 12 + 9*12 - 1 = 119
  const clamped = Math.max(12, Math.min(119, midi))
  const normalized = clamped - 12

  const pitchIndex = normalized % 12
  const octave = Math.floor(normalized / 12) as Octave
  const pitch = CHROMATIC_SCALE[pitchIndex]

  return `${pitch}${octave}` as Note
}

// --- 5. Geração cromática de intervalos ---

/** Gera todas as notas entre from e to (inclusive), em ordem cromática. Suporta várias oitavas. */
export function generateNotes(from: Note, to: Note): Note[] {
  const fromMidi = noteToMidi(from)
  const toMidi = noteToMidi(to)
  const low = Math.min(fromMidi, toMidi)
  const high = Math.max(fromMidi, toMidi)
  const result: Note[] = []
  for (let midi = low; midi <= high; midi++) {
    result.push(midiToNote(midi))
  }
  return result
}

// --- 6. Transposição ---

/** Transpõe uma nota por N semitons (positivo = mais agudo, negativo = mais grave). */
export function transpose(note: Note, semitones: number): Note {
  return midiToNote(noteToMidi(note) + semitones)
}

// --- Constantes de conveniência (compatibilidade) ---

/** Uma oitava padrão (Dó4 a Si4, apenas naturais). */
export const DEFAULT_NOTES: Note[] = [
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
]
