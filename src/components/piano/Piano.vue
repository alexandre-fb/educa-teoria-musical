<script setup>
/**
 * Piano: componente reutilizável de teclado (Fase 1).
 * Apenas layout e eventos; sem áudio. Emite noteOn/noteOff para integração futura.
 */

import PianoKey from './PianoKey.vue'
import { usePiano } from './usePiano'
import { DEFAULT_PIANO_RANGE } from './types'

const props = defineProps({
  /** Intervalo de notas exibidas, ex: ['C3', 'C5']. */
  range: { type: Array, default: () => DEFAULT_PIANO_RANGE },
  /** Se false, teclas não reagem a clique. */
  interactive: { type: Boolean, default: true },
  /** Notas a destacar visualmente. */
  highlightedNotes: { type: Array, default: () => [] },
  /** Notas desabilitadas (não clicáveis). */
  disabledNotes: { type: Array, default: () => [] },
})

const emit = defineEmits(['noteOn', 'noteOff'])

const {
  whiteKeys,
  blackKeys,
  totalWhiteKeys,
  activeNote,
  interactive,
  handleNoteOn,
  handleNoteOff,
  isHighlighted,
  isDisabled,
} = usePiano(props, (e, note) => emit(e, note))

/** Estilo de posição para tecla preta: entre duas brancas, sem quebrar layout. */
function blackKeyStyle(key) {
  const total = totalWhiteKeys.value
  if (total <= 0) return {}
  const unitPercent = 100 / total
  const left = (key.whiteKeyIndex + 0.68) * unitPercent
  const width = unitPercent * 0.58
  return {
    left: `${left}%`,
    width: `${width}%`,
  }
}
</script>

<template>
  <div
    class="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-md bg-gray-200"
    style="min-height: 160px;"
  >
    <!-- Camada de teclas brancas (flex, base do layout) -->
    <div class="relative flex h-full" style="min-height: 160px;">
      <PianoKey
        v-for="key in whiteKeys"
        :key="key.note"
        :note="key.note"
        :is-black="false"
        :is-active="activeNote === key.note"
        :is-highlighted="isHighlighted(key.note)"
        :is-disabled="isDisabled(key.note)"
        :interactive="interactive"
        @press="handleNoteOn(key.note)"
        @release="handleNoteOff(key.note)"
      />
    </div>

    <!-- Camada de teclas pretas (absolute, sobre as brancas) -->
    <div
      class="absolute inset-0 pointer-events-none flex"
      style="min-height: 160px;"
      aria-hidden="true"
    >
      <div
        v-for="key in blackKeys"
        :key="key.note"
        class="absolute pointer-events-auto"
        :style="{
          ...blackKeyStyle(key),
          top: 0,
          height: '62%',
        }"
      >
        <PianoKey
          :note="key.note"
          :is-black="true"
          :is-active="activeNote === key.note"
          :is-highlighted="isHighlighted(key.note)"
          :is-disabled="isDisabled(key.note)"
          :interactive="interactive"
          class="absolute inset-0 w-full h-full rounded-b"
          @press="handleNoteOn(key.note)"
          @release="handleNoteOff(key.note)"
        />
      </div>
    </div>
  </div>
</template>
