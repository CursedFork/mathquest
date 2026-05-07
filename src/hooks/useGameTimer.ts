"use client"

import { useEffect, useRef } from "react"
import { useGameStore } from "@/store/gameStore"

/**
 * Manages the game countdown. Must be rendered inside a component
 * that is mounted for the full game session (GameShell).
 */
export function useGameTimer() {
  const status = useGameStore((s) => s.status)
  const decrementTime = useGameStore((s) => s.decrementTime)
  const timeRemaining = useGameStore((s) => s.timeRemaining)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (status === "playing") {
      intervalRef.current = setInterval(() => {
        decrementTime()
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [status, decrementTime])

  return { timeRemaining }
}
