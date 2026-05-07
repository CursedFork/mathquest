// Stub types prepared for future Supabase integration

export type UserRole = "student" | "teacher" | "parent"

export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
  email?: string
  createdAt: string
  role: UserRole
  classroomCode?: string
}

export interface GameHighScore {
  userId: string
  gameId: string
  score: number
  accuracy: number
  achievedAt: string
}

export interface UserStats {
  totalGamesPlayed: number
  totalXpEarned: number
  totalCorrectAnswers: number
  averageAccuracy: number
  highScores: Record<string, GameHighScore>
  achievements: string[]
}

// Future Supabase table shape (for reference)
export interface SupabaseUserRow {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  role: UserRole
  classroom_code: string | null
  created_at: string
}
