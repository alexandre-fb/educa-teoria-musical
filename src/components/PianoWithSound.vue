<script setup lang="ts">
import { ref } from 'vue'
import Piano from '@/components/Piano.vue'
import type { Note } from '@/music/notes'
import { useSimpleSoundEngine } from '@/music/useSimpleSoundEngine'

const props = defineProps<{
  from: Note
  to: Note
}>()

const emit = defineEmits<{
  (e: 'noteSelected', note: Note): void
}>()

const soundEngine = useSimpleSoundEngine()
const muted = ref(false)

/** Duração do som ao clicar (uma nota por vez, sem sustain). */
const NOTE_DURATION_MS = 280

function onNoteSelected(note: Note) {
  emit('noteSelected', note)

  if (!muted.value) {
    soundEngine.play(note)
    setTimeout(() => soundEngine.stop(note), NOTE_DURATION_MS)
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="p-2 rounded border border-gray-300 bg-white hover:bg-gray-50 text-lg"
        :aria-label="muted ? 'Ativar som' : 'Desligar som'"
        @click="muted = !muted"
      >
        {{ muted ? '🔇' : '🔊' }}
      </button>
      <span class="text-sm text-gray-600">
        {{ muted ? 'Som desligado' : 'Som ligado' }}
      </span>
    </div>
    <Piano :from="from" :to="to" @noteSelected="onNoteSelected" />
  </div>
</template>
