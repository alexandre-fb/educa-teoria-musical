/**
 * Motor de som com samples reais (Web Audio API).
 * Desacoplado da UI: responde a play(note), stop(note), mute(isMuted).
 * Carrega .wav de /sounds/piano/ e usa AudioBufferSourceNode + GainNode.
 */

import { ref } from 'vue'

/** Nota no formato "nome+oitava", ex: "C3", "A#4". Mesmo contrato do Piano. */
export type Note = string

/** Notas da oitava 4 que temos como sample (arquivos C4.wav … B4.wav). */
const SAMPLE_NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'] as const

/** Índice de cada nota na oitava (0=C, 11=B). */
const NOTE_INDEX: Record<string, number> = {
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
}

/** Mapeia índice de pitch (0=C..11=B) para sample na oitava 4 (C4.wav … B4.wav). */
const PITCH_TO_SAMPLE_KEY: (typeof SAMPLE_NOTES)[number][] = [
  'C4', 'C4', 'D4', 'D4', 'E4', 'F4', 'F4', 'G4', 'G4', 'A4', 'A4', 'B4',
]

/** Qual sample usar para uma nota: sempre um de C4..B4 (oitava 4). */
function getSampleKeyForNote(note: Note): (typeof SAMPLE_NOTES)[number] | null {
  const m = note.match(/^([A-G]#?)(\d+)$/)
  if (!m) return null
  const idx = NOTE_INDEX[m[1]]
  if (idx === undefined) return null
  return PITCH_TO_SAMPLE_KEY[idx] ?? null
}

/** Semitons entre duas notas (positivo = mais agudo). */
function semitonesBetween(from: Note, to: Note): number {
  const mFrom = from.match(/^([A-G]#?)(\d+)$/)
  const mTo = to.match(/^([A-G]#?)(\d+)$/)
  if (!mFrom || !mTo) return 0
  const octFrom = parseInt(mFrom[2], 10)
  const octTo = parseInt(mTo[2], 10)
  const idxFrom = NOTE_INDEX[mFrom[1]] ?? 0
  const idxTo = NOTE_INDEX[mTo[1]] ?? 0
  return (octTo - octFrom) * 12 + (idxTo - idxFrom)
}

/** Qual buffer usar e em qual taxa para uma nota (permite notas fora do conjunto de samples). */
function getBufferAndRate(
  note: Note,
  buffers: Record<string, AudioBuffer>
): { buffer: AudioBuffer; playbackRate: number } | null {
  const sampleKey = getSampleKeyForNote(note)
  if (!sampleKey) return null
  const buffer = buffers[sampleKey]
  if (!buffer) return null
  const semitones = semitonesBetween(sampleKey, note)
  const playbackRate = Math.pow(2, semitones / 12)
  return { buffer, playbackRate }
}

/** Uma instância de som (uma nota pode ter várias = polifonia). */
interface ActiveVoice {
  source: AudioBufferSourceNode
  gainNode: GainNode
}

const FADE_OUT_DURATION = 0.15

export function useSoundEngine() {
  let ctx: AudioContext | null = null
  /** Gain global: mute zera o volume sem parar os sources. */
  let masterGain: GainNode | null = null

  const buffers = ref<Record<string, AudioBuffer>>({})
  const isLoaded = ref(false)
  const loadError = ref<string | null>(null)

  /** Por nota: lista de vozes ativas (polifonia). */
  const activeVoices = new Map<Note, ActiveVoice[]>()

  function getContext(): AudioContext | null {
    return ctx
  }

  /**
   * Inicializa o AudioContext e o GainNode de mute.
   * Deve ser chamado após interação do usuário (autoplay).
   */
  function init(): void {
    if (ctx?.state === 'running') return
    if (ctx?.state === 'suspended') {
      ctx.resume()
      return
    }
    ctx = new AudioContext()
    masterGain = ctx.createGain()
    masterGain.gain.value = 1
    masterGain.connect(ctx.destination)
  }

  /**
   * Carrega os samples .wav uma vez; expõe isLoaded.
   * Chamar após init().
   */
  async function loadSamples(): Promise<void> {
    if (!ctx) return
    if (isLoaded.value) return
    loadError.value = null
    const base = '/sounds/piano'
    const result: Record<string, AudioBuffer> = {}
    for (const note of SAMPLE_NOTES) {
      try {
        const res = await fetch(`${base}/${note}.wav`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const arrayBuffer = await res.arrayBuffer()
        const buffer = await ctx.decodeAudioData(arrayBuffer)
        result[note] = buffer
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        loadError.value = `Falha ao carregar ${note}.wav: ${msg}`
        return
      }
    }
    buffers.value = result
    isLoaded.value = true
  }

  /**
   * Mute global: zera o volume (não para os sons).
   */
  function mute(isMuted: boolean): void {
    if (!masterGain) return
    masterGain.gain.setTargetAtTime(isMuted ? 0 : 1, (ctx?.currentTime ?? 0), 0.02)
  }

  /**
   * Inicia o som da nota (AudioBufferSourceNode → GainNode → masterGain).
   * Permite várias instâncias da mesma nota (polifonia).
   */
  function play(note: Note): void {
    if (!ctx || !masterGain) return
    const buf = buffers.value
    const info = getBufferAndRate(note, buf)
    if (!info) return
    const { buffer, playbackRate } = info
    const source = ctx.createAudioBufferSourceNode()
    const gainNode = ctx.createGain()
    source.buffer = buffer
    source.playbackRate.value = playbackRate
    gainNode.gain.value = 0.35
    source.connect(gainNode)
    gainNode.connect(masterGain)
    source.start(ctx.currentTime)
    const voice: ActiveVoice = { source, gainNode }
    const list = activeVoices.get(note) ?? []
    list.push(voice)
    activeVoices.set(note, list)
    source.onended = () => {
      const arr = activeVoices.get(note) ?? []
      const i = arr.indexOf(voice)
      if (i !== -1) arr.splice(i, 1)
      if (arr.length === 0) activeVoices.delete(note)
      gainNode.disconnect()
    }
  }

  /**
   * Para a nota com fade-out curto para evitar click.
   */
  function stop(note: Note): void {
    const list = activeVoices.get(note)
    if (!list?.length || !ctx) return
    const now = ctx.currentTime
    list.forEach(({ source, gainNode }) => {
      gainNode.gain.setTargetAtTime(0.001, now, 0.03)
      source.stop(now + FADE_OUT_DURATION)
    })
    activeVoices.set(note, [])
  }

  /**
   * Para todas as notas (útil para cleanup).
   */
  function stopAll(): void {
    activeVoices.forEach((_, note) => stop(note))
  }

  return {
    init,
    loadSamples,
    play,
    stop,
    mute,
    stopAll,
    isLoaded,
    loadError,
    getContext,
  }
}
