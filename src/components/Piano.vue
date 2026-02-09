<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '@/music/notes'
import { generateNotes } from '@/music/notes'

const props = defineProps<{
  from: Note
  to: Note
}>()

const emit = defineEmits<{
  (e: 'noteSelected', note: Note): void
}>()

// Gera o array de notas a partir do intervalo
const notes = computed(() => generateNotes(props.from, props.to))

function selectNote(note: Note) {
  emit('noteSelected', note)
}
</script>

<template>
  <div class="flex gap-1" role="group" aria-label="Piano">
    <button
      v-for="note in notes"
      :key="note"
      type="button"
      class="flex-1 min-w-[2.5rem] h-24 border border-gray-400 rounded bg-white hover:bg-gray-100 transition-colors text-gray-800 font-medium"
      :aria-label="`Nota ${note}`"
      @click="selectNote(note)"
    >
      {{ note }}
    </button>
  </div>
</template>
