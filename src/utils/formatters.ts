export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m > 0) return `${m}:${s.toString().padStart(2, "0")}`
  return `${s}s`
}

export function formatScore(score: number): string {
  return score.toLocaleString()
}

export function formatAccuracy(correct: number, total: number): string {
  if (total === 0) return "—"
  return `${Math.round((correct / total) * 100)}%`
}

export function getAccuracyPercent(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function getScoreGrade(accuracy: number): { grade: string; color: string; label: string } {
  if (accuracy >= 95) return { grade: "S", color: "text-yellow-400", label: "Perfect!" }
  if (accuracy >= 85) return { grade: "A", color: "text-green-400", label: "Excellent!" }
  if (accuracy >= 70) return { grade: "B", color: "text-blue-400", label: "Great job!" }
  if (accuracy >= 55) return { grade: "C", color: "text-orange-400", label: "Good effort!" }
  return { grade: "D", color: "text-red-400", label: "Keep practicing!" }
}

export function getDifficultyLabel(level: number): string {
  const labels = ["", "Beginner", "Easy", "Medium", "Hard", "Expert"]
  return labels[level] ?? "Expert"
}

export function getDifficultyBadgeClass(difficulty: string): string {
  const map: Record<string, string> = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
    mixed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  }
  return map[difficulty] ?? map.mixed
}
