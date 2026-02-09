<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import PianoWithSound from '@/components/PianoWithSound.vue'
import type { Note } from '@/music/notes'
import { generateNotes } from '@/music/notes'

const props = defineProps<{
  notes?: Note[]
  from?: Note
  to?: Note
}>()

// Fonte das notas: prioriza array explícito, depois intervalo, senão vazio
const availableNotes = computed(() => {
  if (props.notes?.length) return props.notes
  if (props.from && props.to) return generateNotes(props.from, props.to)
  return []
})

// Sorteia uma nota aleatória do array disponível; null se não houver notas
function randomNote(): Note | null {
  const list = availableNotes.value
  if (!list.length) return null
  return list[Math.floor(Math.random() * list.length)]
}

const targetNote = ref<Note | null>(null)
const selectedNote = ref<Note | null>(null)
/** Feedback de acerto visível por alguns segundos */
const showCorrectFeedback = ref(false)

// Sorteia nota alvo quando há notas disponíveis
watchEffect(() => {
  if (availableNotes.value.length) {
    const next = randomNote()
    if (next !== null) targetNote.value = next
  }
})

const FEEDBACK_DURATION_MS = 2000

function onNoteSelected(note: Note) {
  selectedNote.value = note

  if (note === targetNote.value) {
    showCorrectFeedback.value = true
    setTimeout(() => {
      showCorrectFeedback.value = false
      const next = randomNote()
      if (next !== null) targetNote.value = next
      selectedNote.value = null
    }, FEEDBACK_DURATION_MS)
  }
}

// Determina intervalo para o Piano (se não houver array explícito)
const pianoFrom = computed(() => {
  if (props.notes?.length) {
    // Se tem array, usa primeira e última nota
    return props.notes[0]
  }
  return props.from
})

const pianoTo = computed(() => {
  if (props.notes?.length) {
    return props.notes[props.notes.length - 1]
  }
  return props.to
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6">
    <template v-if="availableNotes.length === 0">
      <p class="text-lg text-gray-600">Nenhuma nota configurada</p>
    </template>
    
    <template v-else>
      <div class="text-center">
        <p class="text-xl text-gray-700 mb-2">
          Clique na nota: <span class="text-3xl font-bold text-blue-600">{{ targetNote }}</span>
        </p>
        <p v-if="showCorrectFeedback" class="text-lg text-green-600 animate-pulse">
          ✓ Correto!
        </p>
        <p v-else-if="selectedNote && !showCorrectFeedback" class="text-lg text-red-600">
          ✗ Errado. Você clicou em {{ selectedNote }}
        </p>
      </div>
      
      <PianoWithSound
        v-if="pianoFrom && pianoTo"
        :from="pianoFrom"
        :to="pianoTo"
        @noteSelected="onNoteSelected"
      />
    </template>
  </div>
</template>
