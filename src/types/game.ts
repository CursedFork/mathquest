export type GameStatus = "idle" | "starting" | "playing" | "paused" | "finished"

export type Difficulty = "easy" | "medium" | "hard" | "mixed"

export interface GameConfig {
  duration: number // seconds
  difficulty: Difficulty
  soundEnabled: boolean
}

export interface GameResult {
  score: number
  accuracy: number // 0-100
  totalProblems: number
  correctAnswers: number
  longestStreak: number
  timeTaken: number // seconds
  xpEarned: number
}

export interface GameMetadata {
  id: string
  title: string
  description: string
  difficulty: Difficulty | Difficulty[]
  subjects: string[]
  gradeRange: string
  tags: string[]
  isNew?: boolean
  comingSoon?: boolean
}

export interface GameDefinition extends GameMetadata {
  path: string
  gradientFrom: string
  gradientTo: string
  icon: string // emoji
}
