"use client"

import { useGameStore } from "@/store/gameStore"
import { calculateProblemScore, getDifficultyLevel } from "@/utils/mathUtils"

/**
 * Thin abstraction over game store for score-related actions.
 * Encapsulates the scoring formula so game components stay clean.
 */
export function useScore() {
  const score = useGameStore((s) => s.score)
  const streak = useGameStore((s) => s.streak)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const totalAttempts = useGameStore((s) => s.totalAttempts)
  const addScore = useGameStore((s) => s.addScore)
  const incrementStreak = useGameStore((s) => s.incrementStreak)
  const resetStreak = useGameStore((s) => s.resetStreak)
  const incrementCorrect = useGameStore((s) => s.incrementCorrect)
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)

  const recordCorrect = (answerTimeMs: number): number => {
    const points = calculateProblemScore(streak, answerTimeMs)
    addScore(points)
    incrementStreak()
    incrementCorrect()
    incrementAttempts()
    return points
  }

  const recordIncorrect = () => {
    resetStreak()
    incrementAttempts()
  }

  return {
    score,
    streak,
    correctAnswers,
    totalAttempts,
    currentDifficultyLevel: getDifficultyLevel(correctAnswers),
    recordCorrect,
    recordIncorrect,
  }
}
