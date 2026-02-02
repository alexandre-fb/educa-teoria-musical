<script setup>
/**
 * PianoKey: uma tecla do piano (branca ou preta).
 * Responsável apenas por layout e eventos de pointer; não emite som.
 */

import { ref } from 'vue'

const props = defineProps({
  /** Nota desta tecla (ex: "C3", "C#3"). */
  note: { type: String, required: true },
  /** Se true, tecla preta (sustenido). */
  isBlack: { type: Boolean, default: false },
  /** Tecla está pressionada (feedback visual). */
  isActive: { type: Boolean, default: false },
  /** Destaque (ex: nota da lição). */
  isHighlighted: { type: Boolean, default: false },
  /** Tecla desabilitada (não reage a clique). */
  isDisabled: { type: Boolean, default: false },
  /** Se false, não dispara eventos de press/release. */
  interactive: { type: Boolean, default: true },
})

const emit = defineEmits(['press', 'release'])

const keyEl = ref(null)

function onPointerDown(e) {
  if (!props.interactive || props.isDisabled) return
  e.preventDefault()
  keyEl.value?.setPointerCapture?.(e.pointerId)
  emit('press')
}

function onPointerUp(e) {
  if (!props.interactive || props.isDisabled) return
  keyEl.value?.releasePointerCapture?.(e.pointerId)
  emit('release')
}

function onPointerLeave(e) {
  if (!props.interactive || props.isDisabled) return
  if (e.buttons === 1) emit('release')
}
</script>

<template>
  <button
    ref="keyEl"
    type="button"
    class="touch-none select-none border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1"
    :class="[
      isBlack
        ? 'absolute z-10 h-[62%] rounded-b border-gray-800 bg-gray-900 text-white shadow-lg'
        : 'relative flex-1 min-w-0 rounded-b border-gray-400 bg-white text-gray-900',
      isActive && 'opacity-90',
      isBlack && isActive && 'bg-gray-700 shadow-inner',
      !isBlack && isActive && 'bg-gray-200',
      isHighlighted && !isBlack && 'ring-2 ring-amber-400 ring-inset',
      isHighlighted && isBlack && 'ring-2 ring-amber-400 ring-inset',
      isDisabled && 'cursor-not-allowed opacity-60',
      interactive && !isDisabled && 'cursor-pointer active:scale-[0.98]',
    ]"
    :disabled="!interactive || isDisabled"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointerleave="onPointerLeave"
  >
    <!-- Bola verde de feedback quando a tecla está pressionada -->
    <span
      v-if="isActive"
      class="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-green-500 shadow-sm"
      aria-hidden="true"
    />
    <!-- Label opcional para acessibilidade; pode ser oculto visualmente -->
    <span class="sr-only">{{ note }}</span>
  </button>
</template>
