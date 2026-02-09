<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Note } from '@/music/notes'
import { generateNotes } from '@/music/notes'

const props = withDefaults(defineProps<{
  fretCount?: number
}>(), {
  fretCount: 12,
})

const emit = defineEmits<{
  (e: 'noteSelected', note: Note): void
}>()

/** Nota atualmente selecionada no braço (destaca todas as ocorrências). */
const activeNote = ref<Note | null>(null)

/** Afinação padrão do violão (E standard): 6ª corda até 1ª corda. */
const STRINGS: Note[] = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

/** Para cada corda, gera as notas naturais até completar aproximadamente 1 oitava (12 semitons). */
const stringNotes = computed(() => {
  return STRINGS.map((openNote) => {
    // Para 12 trastes: gera de openNote até a mesma nota uma oitava acima
    // Exemplo: E2 → E3, A2 → A3, etc.
    const openOctave = parseInt(openNote[1], 10)
    const targetOctave = (openOctave + 1) as 2 | 3 | 4 | 5
    const finalNote = `${openNote[0]}${targetOctave}` as Note
    
    // Gera todas as notas naturais da corda aberta até 1 oitava acima
    return generateNotes(openNote, finalNote)
  })
})

function selectNote(note: Note) {
  activeNote.value = note
  emit('noteSelected', note)
}
</script>

<template>
  <div class="flex flex-col gap-1" role="group" aria-label="Violão">
    <div
      v-for="(notes, stringIndex) in stringNotes"
      :key="stringIndex"
      class="flex items-center gap-1"
    >
      <!-- Label da corda -->
      <span class="w-8 text-sm font-medium text-gray-600 text-right">
        {{ STRINGS[stringIndex] }}
      </span>
      
      <!-- Trastes (botões) - limitado por fretCount -->
      <button
        v-for="(note, fretIndex) in notes.slice(0, fretCount + 1)"
        :key="fretIndex"
        type="button"
        :class="[
          'min-w-[2rem] h-10 border rounded transition-colors text-xs',
          note === activeNote
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white hover:bg-gray-100 border-gray-400 text-gray-800'
        ]"
        :aria-label="`Corda ${STRINGS[stringIndex]}, traste ${fretIndex}, nota ${note}`"
        @click="selectNote(note)"
      >
        {{ note }}
      </button>
    </div>
  </div>
</template>
