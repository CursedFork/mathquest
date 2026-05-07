import { create } from "zustand"
import type { GameStatus, GameResult, GameConfig } from "@/types/game"

interface GameSessionState {
  status: GameStatus
  score: number
  streak: number
  longestStreak: number
  correctAnswers: number
  totalAttempts: number
  timeRemaining: number
  config: GameConfig
  result: GameResult | null

  startGame: (config?: Partial<GameConfig>) => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  resetGame: () => void
  addScore: (points: number) => void
  incrementStreak: () => void
  resetStreak: () => void
  incrementCorrect: () => void
  incrementAttempts: () => void
  setTimeRemaining: (time: number) => void
  decrementTime: () => void
}

const DEFAULT_CONFIG: GameConfig = {
  duration: 60,
  difficulty: "easy",
  soundEnabled: true,
}

export const useGameStore = create<GameSessionState>((set, get) => ({
  status: "idle",
  score: 0,
  streak: 0,
  longestStreak: 0,
  correctAnswers: 0,
  totalAttempts: 0,
  timeRemaining: DEFAULT_CONFIG.duration,
  config: DEFAULT_CONFIG,
  result: null,

  startGame: (config) => {
    const merged = { ...DEFAULT_CONFIG, ...config }
    set({
      status: "playing",
      score: 0,
      streak: 0,
      longestStreak: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      timeRemaining: merged.duration,
      config: merged,
      result: null,
    })
  },

  pauseGame: () => set({ status: "paused" }),
  resumeGame: () => set({ status: "playing" }),

  endGame: () => {
    const { score, correctAnswers, totalAttempts, longestStreak, config, timeRemaining } = get()
    const timeTaken = config.duration - timeRemaining
    const accuracy =
      totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0
    const result: GameResult = {
      score,
      accuracy,
      totalProblems: totalAttempts,
      correctAnswers,
      longestStreak,
      timeTaken,
      xpEarned: Math.floor(score * 1.5),
    }
    set({ status: "finished", result })
  },

  resetGame: () =>
    set({
      status: "idle",
      score: 0,
      streak: 0,
      longestStreak: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      timeRemaining: DEFAULT_CONFIG.duration,
      result: null,
    }),

  addScore: (points) => set((s) => ({ score: s.score + points })),

  incrementStreak: () =>
    set((s) => {
      const newStreak = s.streak + 1
      return { streak: newStreak, longestStreak: Math.max(s.longestStreak, newStreak) }
    }),

  resetStreak: () => set({ streak: 0 }),
  incrementCorrect: () => set((s) => ({ correctAnswers: s.correctAnswers + 1 })),
  incrementAttempts: () => set((s) => ({ totalAttempts: s.totalAttempts + 1 })),
  setTimeRemaining: (time) => set({ timeRemaining: time }),

  decrementTime: () => {
    const { timeRemaining, endGame } = get()
    if (timeRemaining <= 1) {
      endGame()
    } else {
      set({ timeRemaining: timeRemaining - 1 })
    }
  },
}))
