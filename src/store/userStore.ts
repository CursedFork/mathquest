/**
 * User store stub — structured for clean Supabase drop-in later.
 * Currently persists only to memory (local session).
 */
import { create } from "zustand"
import type { UserProfile, UserStats, GameHighScore } from "@/types/user"

interface UserState {
  profile: UserProfile | null
  stats: UserStats
  isLoading: boolean

  setProfile: (profile: UserProfile | null) => void
  updateHighScore: (gameId: string, score: number, accuracy: number) => void
  addXp: (amount: number) => void
  clearSession: () => void
  // Stub placeholders for future Supabase auth
  // signIn: (email: string, password: string) => Promise<void>
  // signOut: () => Promise<void>
  // fetchProfile: () => Promise<void>
}

const DEFAULT_STATS: UserStats = {
  totalGamesPlayed: 0,
  totalXpEarned: 0,
  totalCorrectAnswers: 0,
  averageAccuracy: 0,
  highScores: {},
  achievements: [],
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  stats: DEFAULT_STATS,
  isLoading: false,

  setProfile: (profile) => set({ profile }),

  updateHighScore: (gameId, score, accuracy) => {
    const { stats } = get()
    const prev = stats.highScores[gameId]
    const newHighScore: GameHighScore = {
      userId: "local",
      gameId,
      score: Math.max(prev?.score ?? 0, score),
      accuracy,
      achievedAt: new Date().toISOString(),
    }
    const newPlayed = stats.totalGamesPlayed + 1
    set({
      stats: {
        ...stats,
        totalGamesPlayed: newPlayed,
        averageAccuracy: Math.round(
          (stats.averageAccuracy * stats.totalGamesPlayed + accuracy) / newPlayed
        ),
        highScores: { ...stats.highScores, [gameId]: newHighScore },
      },
    })
  },

  addXp: (amount) =>
    set((s) => ({ stats: { ...s.stats, totalXpEarned: s.stats.totalXpEarned + amount } })),

  clearSession: () => set({ profile: null, stats: DEFAULT_STATS }),
}))
