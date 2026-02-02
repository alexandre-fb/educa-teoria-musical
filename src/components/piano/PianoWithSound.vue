<script setup>
/**
 * PianoWithSound — Integração Piano + motor de som (samples reais).
 * Camada intermediária: não altera o Piano; conecta eventos ao useSoundEngine.
 * Fluxo: interação → noteOn/noteOff → play/stop; mute via GainNode (só zera volume).
 */

import { ref } from 'vue'
import Piano from './Piano.vue'
import { useSoundEngine } from '@/composables/useSoundEngine'

const engine = useSoundEngine()

/** Inicializado na primeira interação (autoplay do browser). */
const audioInitialized = ref(false)

/** Mute global: motor usa GainNode (zera volume, não para o som). */
const isMuted = ref(false)

/** Garante contexto e samples carregados antes de tocar. */
async function ensureAudio() {
  if (audioInitialized.value) return
  engine.init()
  await engine.loadSamples()
  audioInitialized.value = true
}

function onNoteOn(note) {
  ensureAudio().then(() => {
    if (!isMuted.value) engine.play(note)
  })
}

function onNoteOff(note) {
  engine.stop(note)
}

function toggleMute() {
  isMuted.value = !isMuted.value
  engine.mute(isMuted.value)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-xl shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        :class="{ 'opacity-60': isMuted }"
        :title="isMuted ? 'Ativar som' : 'Desativar som'"
        @click="toggleMute"
      >
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
      <span class="text-sm text-gray-600">
        {{ isMuted ? 'Som desligado' : 'Som ligado' }}
      </span>
      <span v-if="engine.loadError" class="text-sm text-red-600">
        {{ engine.loadError }}
      </span>
    </div>
    <Piano
      :range="['C3', 'C5']"
      :interactive="true"
      @note-on="onNoteOn"
      @note-off="onNoteOff"
    />
  </div>
</template>
