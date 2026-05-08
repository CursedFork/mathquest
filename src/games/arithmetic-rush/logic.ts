/**
 * Arithmetic Rush — pure game logic, no React dependencies.
 * All functions here are unit-testable in isolation.
 */
import {
  generateArithmeticProblem,
  generateFilteredArithmeticProblem,
  getDifficultyLevel,
  getStreakMultiplier,
  calculateProblemScore,
  type MathProblem,
  type DifficultyLevel,
  type ArithOp,
} from "@/utils/mathUtils"

export type { MathProblem, DifficultyLevel, ArithOp }
export { generateArithmeticProblem, getDifficultyLevel, getStreakMultiplier, calculateProblemScore }

export function nextProblem(correctCount: number, ops?: ArithOp[]): MathProblem {
  const level = getDifficultyLevel(correctCount)
  return ops && ops.length > 0
    ? generateFilteredArithmeticProblem(level, ops)
    : generateArithmeticProblem(level)
}

export function checkAnswer(problem: MathProblem, raw: string): boolean {
  const parsed = parseInt(raw.trim(), 10)
  return !isNaN(parsed) && parsed === problem.answer
}

export function getDifficultyName(level: DifficultyLevel): string {
  const names: Record<DifficultyLevel, string> = {
    1: "Beginner",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Expert",
  }
  return names[level]
}

export function getLevelThresholds(): Array<{ level: DifficultyLevel; at: number; name: string }> {
  return [
    { level: 1, at: 0, name: "Single-digit +/−" },
    { level: 2, at: 6, name: "Double-digit +/−" },
    { level: 3, at: 12, name: "Multiplication ×" },
    { level: 4, at: 25, name: "Division ÷" },
    { level: 5, at: 40, name: "Mixed operations" },
  ]
}
