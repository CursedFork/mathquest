"use client"

import { useState, useCallback, useRef } from "react"

export type SoundType = "correct" | "incorrect" | "streak" | "gameover" | "levelup"

/**
 * Web Audio API-based sound system. No audio files required —
 * all tones are synthesized procedurally.
 */
export function useSoundToggle(initiallyEnabled = true) {
  const [soundEnabled, setSoundEnabled] = useState(initiallyEnabled)
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = (): AudioContext | null => {
    if (typeof window === "undefined") return null
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      } catch {
        return null
      }
    }
    return ctxRef.current
  }

  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = "square", vol = 0.2, delay = 0) => {
      if (!soundEnabled) return
      const ctx = getCtx()
      if (!ctx) return
      try {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
        osc.type = type
        gain.gain.setValueAtTime(vol, ctx.currentTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur)
        osc.start(ctx.currentTime + delay)
        osc.stop(ctx.currentTime + delay + dur)
      } catch {
        // Silently ignore audio errors
      }
    },
    [soundEnabled]
  )

  const playSound = useCallback(
    (type: SoundType) => {
      switch (type) {
        case "correct":
          tone(523, 0.08, "square", 0.18) // C5
          tone(659, 0.12, "square", 0.18, 0.09) // E5
          break
        case "incorrect":
          tone(220, 0.25, "sawtooth", 0.15)
          break
        case "streak":
          tone(523, 0.08, "square", 0.22)
          tone(659, 0.08, "square", 0.22, 0.08)
          tone(784, 0.18, "square", 0.22, 0.16)
          break
        case "gameover":
          tone(392, 0.2, "sawtooth", 0.18)
          tone(330, 0.2, "sawtooth", 0.18, 0.22)
          tone(262, 0.35, "sawtooth", 0.18, 0.44)
          break
        case "levelup":
          tone(523, 0.08, "square", 0.22)
          tone(659, 0.08, "square", 0.22, 0.1)
          tone(784, 0.08, "square", 0.22, 0.2)
          tone(1047, 0.22, "square", 0.22, 0.3)
          break
      }
    },
    [tone]
  )

  const toggleSound = () => setSoundEnabled((v) => !v)

  return { soundEnabled, toggleSound, playSound }
}
