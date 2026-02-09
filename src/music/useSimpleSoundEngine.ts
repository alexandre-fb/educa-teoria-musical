import type { Note } from './notes'

/** A4 = 69 em MIDI. Índice da nota na oitava (C=0, D=2, ..., B=11). */
const SEMITONES: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
}

/**
 * Converte nota (ex: C4, A3) em número MIDI.
 * A4 = 69; usamos isso para calcular frequência depois.
 */
export function noteToMidi(note: Note): number {
  const letter = note[0]
  const octave = parseInt(note[1], 10)
  return (octave + 1) * 12 + SEMITONES[letter]
}

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

    const frequency = midiToFrequency(noteToMidi(note))
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
