"use client"

import { useGameStore } from "@/store/gameStore"
import { getStreakMultiplier } from "@/utils/mathUtils"

export function useStreak() {
  const streak = useGameStore((s) => s.streak)
  const longestStreak = useGameStore((s) => s.longestStreak)

  const multiplier = getStreakMultiplier(streak)
  const isHot = streak >= 5
  const isOnFire = streak >= 10

  const getStreakLabel = (): string | null => {
    if (streak >= 10) return "ON FIRE! 🔥"
    if (streak >= 5) return "HOT STREAK! ⚡"
    if (streak >= 3) return `COMBO ×${streak}`
    return null
  }

  return {
    streak,
    longestStreak,
    multiplier,
    isHot,
    isOnFire,
    streakLabel: getStreakLabel(),
  }
}
