/**
 * Tipos e constantes do componente Piano.
 * Centralizados aqui para reuso e futura integração com motor de som.
 */

/** Nota no formato "nome+oitava", ex: "C3", "C#4", "A5" */
export type Note = string

/** Ordem das 12 notas em uma oitava (semitons). Usado para gerar o range. */
export const NOTES_IN_OCTAVE = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

/** Notas que são teclas pretas (sustenido). */
const BLACK_NOTE_NAMES = new Set(['C#', 'D#', 'F#', 'G#', 'A#'])

/**
 * Indica se a nota é uma tecla preta (sustenido).
 * Usado para layout e estilos.
 */
export function isBlackNote(note: Note): boolean {
  const name = note.replace(/\d+$/, '')
  return BLACK_NOTE_NAMES.has(name)
}

/**
 * Extrai nome da nota (sem oitava) e oitava.
 * Ex: "C#3" -> { name: "C#", octave: 3 }
 */
export function parseNote(note: Note): { name: string; octave: number } {
  const match = note.match(/^([A-G]#?)(\d+)$/)
  if (!match) throw new Error(`Nota inválida: ${note}`)
  return { name: match[1], octave: parseInt(match[2], 10) }
}

/**
 * Gera a string da nota a partir de nome e oitava.
 */
export function noteToString(name: string, octave: number): Note {
  return `${name}${octave}`
}

/**
 * Retorna o índice da nota dentro da oitava (0–11).
 */
function noteIndexInOctave(name: string): number {
  const i = NOTES_IN_OCTAVE.indexOf(name as (typeof NOTES_IN_OCTAVE)[number])
  if (i === -1) throw new Error(`Nome de nota inválido: ${name}`)
  return i
}

/**
 * Lista todas as notas entre start e end (inclusive).
 * Útil para renderizar o teclado dentro do range [Note, Note].
 */
export function notesInRange(start: Note, end: Note): Note[] {
  const s = parseNote(start)
  const e = parseNote(end)
  const startIdx = noteIndexInOctave(s.name) + s.octave * 12
  const endIdx = noteIndexInOctave(e.name) + e.octave * 12
  if (startIdx > endIdx) return []

  const result: Note[] = []
  for (let i = startIdx; i <= endIdx; i++) {
    const octave = Math.floor(i / 12)
    const name = NOTES_IN_OCTAVE[i % 12]
    result.push(noteToString(name, octave))
  }
  return result
}

/** Range padrão do piano (C3 a C5) para uso quando range não é passado. */
export const DEFAULT_PIANO_RANGE: [Note, Note] = ['C3', 'C5']
