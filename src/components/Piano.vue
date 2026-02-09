<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Note } from '@/music/notes'
import { generateNotes } from '@/music/notes'
import { useSimpleSoundEngine } from '@/music/useSimpleSoundEngine'

const props = defineProps<{
  from: Note
  to: Note
}>()

const emit = defineEmits<{
  (e: 'noteSelected', note: Note): void
}>()

const soundEngine = useSimpleSoundEngine()
const currentNote = ref<Note | null>(null)

/** Duração do som ao clicar. */
const NOTE_DURATION_MS = 280

// Gera todas as notas do range (cromático)
const notes = computed(() => generateNotes(props.from, props.to))

/** Tecla preta = pitch com sustenido. */
function isBlackKey(note: Note): boolean {
  return note.includes('#')
}

// Separa notas brancas e pretas
const whiteNotes = computed(() => notes.value.filter((n) => !isBlackKey(n)))
const blackNotes = computed(() => notes.value.filter((n) => isBlackKey(n)))

/** Retorna a tecla preta associada a uma tecla branca, se existir no range. */
function blackKeyForWhite(whiteNote: Note): Note | null {
  // Mapeamento físico: C→C#, D→D#, E→null, F→F#, G→G#, A→A#, B→null
  const pitchMap: Record<string, string | null> = {
    C: 'C#',
    D: 'D#',
    E: null,
    F: 'F#',
    G: 'G#',
    A: 'A#',
    B: null,
  }

  const pitch = whiteNote[0]
  const octave = whiteNote.slice(-1)
  const blackPitch = pitchMap[pitch]

  if (!blackPitch) return null

  const blackNote = `${blackPitch}${octave}` as Note
  // Só retorna se a nota preta existir no array notes (dentro do range)
  return blackNotes.value.includes(blackNote) ? blackNote : null
}

function playNote(note: Note) {
  soundEngine.play(note)
  setTimeout(() => soundEngine.stop(note), NOTE_DURATION_MS)
}

function handleNoteClick(note: Note) {
  currentNote.value = note
  playNote(note)
  emit('noteSelected', note)
  
  // Limpa o estado após um tempo para feedback visual
  setTimeout(() => {
    if (currentNote.value === note) {
      currentNote.value = null
    }
  }, NOTE_DURATION_MS)
}
</script>

<template>
  <div class="flex w-full justify-center rounded-xl border border-background-elevated bg-background-elevated p-2" role="group" aria-label="Piano">
    <!-- Teclas brancas são a base visual -->
    <div
      v-for="whiteNote in whiteNotes"
      :key="whiteNote"
      class="relative"
    >
      <!-- Botão da tecla branca -->
      <button
        type="button"
        tabindex="0"
        :class="[
          'w-12 h-40 border rounded-b transition-colors text-xs font-medium',
          currentNote === whiteNote
            ? 'bg-primary text-background border-background-elevated'
            : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
        ]"
        :aria-label="`Nota ${whiteNote}`"
        @click="handleNoteClick(whiteNote)"
      >
        {{ whiteNote }}
      </button>

      <!-- black keys are rendered inside the previous white key for physical accuracy -->
      <button
        v-if="blackKeyForWhite(whiteNote)"
        type="button"
        tabindex="0"
        :class="[
          'absolute top-0 w-6 h-24 rounded-b border border-background-elevated transition-colors text-xs z-10',
          currentNote === blackKeyForWhite(whiteNote)
            ? 'bg-primary text-background'
            : 'bg-background text-neutral-100 hover:bg-background-elevated'
        ]"
        style="right: -0.75rem"
        :aria-label="`Nota ${blackKeyForWhite(whiteNote)}`"
        @click="handleNoteClick(blackKeyForWhite(whiteNote)!)"
      >
        {{ blackKeyForWhite(whiteNote) }}
      </button>
    </div>
  </div>
</template>
