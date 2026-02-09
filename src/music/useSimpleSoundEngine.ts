import type { Note } from './notes'
import { noteToMidi } from './notes'

/** Frequência em Hz a partir do número MIDI. A4 = 440 Hz. */
function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

/** Uma nota tocando por vez: referência para poder parar. */
let current: {
  note: Note
  oscillator: OscillatorNode
  gainNode: GainNode
} | null = null

/** AudioContext criado só após interação do usuário (política do browser). */
let ctx: AudioContext | null = null

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

function stopCurrent(): void {
  if (!current) return
  try {
    current.oscillator.stop()
  } catch {
    // Pode já ter parado
  }
  current = null
}

/**
 * Motor de som simples: Oscillator + Gain.
 * Não depende de Vue nem DOM; pode ser usado por qualquer camada.
 */
export function useSimpleSoundEngine() {
  function play(note: Note): void {
    // Uma nota por vez: para a atual antes de iniciar outra
    stopCurrent()

    const context = getContext()
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    const midi = noteToMidi(note)
    const frequency = midiToFrequency(midi)
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gainNode.gain.value = 0.2

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.start()

    current = { note, oscillator, gainNode }
  }

  function stop(note: Note): void {
    if (!current || current.note !== note) return
    stopCurrent()
  }

  return { play, stop }
}
