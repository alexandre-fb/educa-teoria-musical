/**
 * Composable do Piano: lógica de range, teclas e eventos.
 * Sem áudio; apenas prepara dados e handlers para o componente.
 * Na Fase 2, um motor de som poderá escutar noteOn/noteOff do componente.
 */

import { ref, computed } from 'vue'
import type { Note } from './types'
import {
  notesInRange,
  isBlackNote,
  DEFAULT_PIANO_RANGE,
} from './types'

export interface UsePianoProps {
  range?: [Note, Note]
  interactive?: boolean
  highlightedNotes?: Note[]
  disabledNotes?: Note[]
}

export interface PianoKeyItem {
  note: Note
  isBlack: boolean
  /** Índice da tecla branca "antes" desta (para posicionar pretas). -1 se for branca. */
  whiteKeyIndex: number
}

/**
 * Retorna lista de teclas para renderizar e handlers de noteOn/noteOff.
 * O componente Piano usa isso para layout e para emitir eventos.
 */
export function usePiano(props: UsePianoProps, emit: (e: 'noteOn' | 'noteOff', note: Note) => void) {
  const interactive = computed(() => props.interactive ?? true)
  const highlightedSet = computed(() => new Set(props.highlightedNotes ?? []))
  const disabledSet = computed(() => new Set(props.disabledNotes ?? []))

  /** Nota atualmente pressionada (feedback visual). */
  const activeNote = ref<Note | null>(null)

  const allNotes = computed(() => {
    const [start, end] = props.range ?? DEFAULT_PIANO_RANGE
    return notesInRange(start, end)
  })

  /** Teclas brancas: uma por item, com whiteKeyIndex = índice na lista de brancas. */
  const whiteKeys = computed(() => {
    const list: PianoKeyItem[] = []
    let wi = 0
    for (const note of allNotes.value) {
      if (!isBlackNote(note)) {
        list.push({ note, isBlack: false, whiteKeyIndex: wi })
        wi++
      }
    }
    return list
  })

  /** Teclas pretas: com whiteKeyIndex = índice da branca à esquerda (para posicionar). */
  const blackKeys = computed(() => {
    const list: PianoKeyItem[] = []
    let wi = 0
    for (const note of allNotes.value) {
      if (isBlackNote(note)) {
        list.push({ note, isBlack: true, whiteKeyIndex: wi })
      } else {
        wi++
      }
    }
    return list
  })

  const totalWhiteKeys = computed(() => whiteKeys.value.length)

  function handleNoteOn(note: Note) {
    if (!interactive.value) return
    if (disabledSet.value.has(note)) return
    activeNote.value = note
    emit('noteOn', note)
  }

  function handleNoteOff(note: Note) {
    if (!interactive.value) return
    if (activeNote.value === note) activeNote.value = null
    emit('noteOff', note)
  }

  function isHighlighted(note: Note) {
    return highlightedSet.value.has(note)
  }

  function isDisabled(note: Note) {
    return disabledSet.value.has(note)
  }

  return {
    whiteKeys,
    blackKeys,
    totalWhiteKeys,
    activeNote,
    interactive,
    handleNoteOn,
    handleNoteOff,
    isHighlighted,
    isDisabled,
  }
}
