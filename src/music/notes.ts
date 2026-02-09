/** Nota musical com oitava (nomenclatura internacional). Múltiplas oitavas, sem sustenidos. */
export type Note =
  | 'C2' | 'D2' | 'E2' | 'F2' | 'G2' | 'A2' | 'B2'
  | 'C3' | 'D3' | 'E3' | 'F3' | 'G3' | 'A3' | 'B3'
  | 'C4' | 'D4' | 'E4' | 'F4' | 'G4' | 'A4' | 'B4'
  | 'C5' | 'D5' | 'E5' | 'F5' | 'G5' | 'A5' | 'B5'

/** Uma oitava padrão (Dó4 a Si4). */
export const DEFAULT_NOTES: Note[] = [
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
]

/** Ordem das notas naturais em uma oitava. */
const NOTE_ORDER = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const

/**
 * Gera um array de notas de um intervalo (inclusive).
 * Exemplo: generateNotes('C3', 'B4') retorna todas as notas de C3 até B4.
 */
export function generateNotes(from: Note, to: Note): Note[] {
  // Extrai nota e oitava: 'C3' -> { note: 'C', octave: 3 }
  const parseNote = (n: Note) => {
    const note = n[0] as 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
    const octave = parseInt(n[1]) as 2 | 3 | 4 | 5
    return { note, octave }
  }

  const start = parseNote(from)
  const end = parseNote(to)

  const result: Note[] = []
  let currentOctave = start.octave
  let currentNoteIndex = NOTE_ORDER.indexOf(start.note)

  const endOctave = end.octave
  const endNoteIndex = NOTE_ORDER.indexOf(end.note)

  while (
    currentOctave < endOctave ||
    (currentOctave === endOctave && currentNoteIndex <= endNoteIndex)
  ) {
    const note = `${NOTE_ORDER[currentNoteIndex]}${currentOctave}` as Note
    result.push(note)

    // Avança para próxima nota
    currentNoteIndex++
    if (currentNoteIndex >= NOTE_ORDER.length) {
      currentNoteIndex = 0
      currentOctave++
    }
  }

  return result
}
