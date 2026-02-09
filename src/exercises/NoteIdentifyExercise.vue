<script setup lang="ts">
import { ref } from 'vue'
import Piano from '@/components/Piano.vue'
import type { Note } from '@/music/notes'

const selectedNote = ref<Note | null>(null)

function onNoteSelected(note: Note) {
  selectedNote.value = note
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6">
    <p class="text-2xl font-semibold text-gray-800">
      Nota selecionada: {{ selectedNote ?? '—' }}
    </p>
    <Piano from="C3" to="C5" @noteSelected="onNoteSelected" />
  </div>
</template>
