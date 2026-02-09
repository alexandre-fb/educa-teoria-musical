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
  <!-- Braço do violão: madeira, cordas horizontais, trastes verticais, casas circulares -->
  <div
    class="w-full rounded-xl shadow-md overflow-hidden border border-amber-900/80"
    style="background: linear-gradient(180deg, #78350f 0%, #92400e 50%, #78350f 100%)"
    role="group"
    aria-label="Violão"
  >
    <div class="flex flex-col">
      <!-- Cada linha = uma corda (linha horizontal fina + casas) -->
      <div
        v-for="(notes, stringIndex) in stringNotes"
        :key="stringIndex"
        class="relative flex border-b border-gray-500/50 last:border-b-0"
      >
        <!-- Corda: linha horizontal fina cinza, atravessa todo o braço -->
        <div
          class="absolute inset-x-0 top-1/2 h-px -translate-y-px bg-gray-400/70 pointer-events-none z-0"
          aria-hidden="true"
        />
        <!-- Nut: primeira coluna mais grossa -->
        <div class="w-4 flex-shrink-0 border-r-4 border-amber-950 bg-amber-950/70 z-10" />
        <!-- Casas (trastes): divisão vertical, círculo central clicável -->
        <button
          v-for="(note, fretIndex) in notes.slice(0, fretCount + 1)"
          :key="fretIndex"
          type="button"
          class="relative flex-1 min-w-0 h-10 border-r border-l border-amber-900/90 flex items-center justify-center transition-all duration-[180ms] cursor-pointer group z-20"
          :aria-label="`Corda ${STRINGS[stringIndex]}, traste ${fretIndex}, nota ${note}`"
          @click="selectNote(note)"
        >
          <span
            :class="[
              'inline-flex items-center justify-center min-w-[1.25rem] min-h-[1.25rem] px-1 rounded-full text-[10px] font-medium transition-all duration-[180ms] pointer-events-none',
              note === activeNote
                ? 'scale-110 bg-blue-500 text-white ring-2 ring-blue-300'
                : 'bg-amber-800/50 text-amber-100/80 group-hover:bg-amber-700/70 group-hover:scale-105'
            ]"
          >
            {{ note }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
