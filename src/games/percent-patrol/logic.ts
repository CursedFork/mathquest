/** Percent Patrol — pure game logic. */

export type PercentMode = "to-decimal" | "to-percent" | "find-percent"

export interface PercentProblem {
  mode: PercentMode
  displayText: string    // what's shown to the player
  answer: number         // expected numeric answer
  answerDisplay: string  // formatted expected answer for feedback
  level: number
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Common "nice" percentages for learning */
const NICE_PERCENTS = [10, 20, 25, 33, 40, 50, 60, 66, 75, 80, 90, 100]
const HARD_PERCENTS = [5, 12, 15, 35, 45, 55, 65, 70, 85, 95]

export function generatePercentProblem(level: number, mode: PercentMode): PercentProblem {
  if (mode === "to-decimal") {
    // "35% = ?"  → answer 0.35
    const pool = level <= 2 ? NICE_PERCENTS : level <= 4 ? [...NICE_PERCENTS, ...HARD_PERCENTS] : [...NICE_PERCENTS, ...HARD_PERCENTS, 1, 2, 3, 7]
    const pct = pool[randInt(0, pool.length - 1)]
    const answer = pct / 100
    return {
      mode,
      displayText: `${pct}% = ?`,
      answer,
      answerDisplay: answer.toString(),
      level,
    }
  }

  if (mode === "to-percent") {
    // "0.45 = ?%"  → answer 45
    const pool = level <= 2 ? NICE_PERCENTS : [...NICE_PERCENTS, ...HARD_PERCENTS]
    const pct = pool[randInt(0, pool.length - 1)]
    const decimal = pct / 100
    return {
      mode,
      displayText: `${decimal} = ?%`,
      answer: pct,
      answerDisplay: `${pct}%`,
      level,
    }
  }

  // find-percent: "What is X% of Y?"
  const pool = level <= 2 ? [10, 20, 25, 50, 75, 100] : level <= 4 ? NICE_PERCENTS : [...NICE_PERCENTS, ...HARD_PERCENTS]
  const pct = pool[randInt(0, pool.length - 1)]
  const multiples = level <= 2 ? [10, 20, 40, 50, 100, 200] : level <= 4 ? [4, 8, 12, 16, 20, 25, 40, 50, 60, 80, 100, 120, 150, 200] : [12, 24, 36, 48, 60, 80, 90, 120, 150, 200, 250, 300, 400]
  const whole = multiples[randInt(0, multiples.length - 1)]
  const answer = (pct / 100) * whole
  return {
    mode,
    displayText: `${pct}% of ${whole} = ?`,
    answer,
    answerDisplay: answer.toString(),
    level,
  }
}

export function checkPercentAnswer(input: string, problem: PercentProblem): boolean {
  const parsed = parseFloat(input.trim())
  return !isNaN(parsed) && Math.abs(parsed - problem.answer) < 0.01
}

export function getPercentLevel(correctCount: number): number {
  if (correctCount >= 30) return 5
  if (correctCount >= 20) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}
