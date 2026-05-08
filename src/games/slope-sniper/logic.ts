/** Slope Sniper — pure game logic. */

export type SlopeMode = "all" | "positive" | "negative" | "zero"

export interface SlopeProblem {
  x1: number
  y1: number
  x2: number
  y2: number
  // Slope as reduced fraction
  riseAnswer: number   // numerator (signed)
  runAnswer: number    // denominator (always positive)
  // Decimal form for flexible checking
  decimalAnswer: number
  isZero: boolean
  level: number
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b)
  return b === 0 ? a : gcd(b, a % b)
}

export function generateSlopeProblem(level: number, mode: SlopeMode): SlopeProblem {
  const coordRange = level <= 2 ? 5 : level <= 4 ? 8 : 10

  let x1: number, y1: number, x2: number, y2: number

  let attempts = 0
  do {
    x1 = randInt(-coordRange, coordRange)
    y1 = randInt(-coordRange, coordRange)
    x2 = randInt(-coordRange, coordRange)
    y2 = randInt(-coordRange, coordRange)
    attempts++
  } while (
    (x2 === x1 || // no vertical (undefined) slopes
    (mode === "positive" && y2 - y1 <= 0) ||
    (mode === "negative" && y2 - y1 >= 0) ||
    (mode === "zero" && y2 !== y1)) &&
    attempts < 50
  )

  // For zero mode, force horizontal
  if (mode === "zero") {
    y2 = y1
    while (x2 === x1) x2 = randInt(-coordRange, coordRange)
  }

  const rise = y2 - y1
  const run = x2 - x1

  let riseAnswer: number, runAnswer: number
  if (rise === 0) {
    riseAnswer = 0
    runAnswer = 1
  } else {
    const g = gcd(Math.abs(rise), Math.abs(run))
    riseAnswer = rise / g
    runAnswer = run / g
    // keep run positive
    if (runAnswer < 0) { riseAnswer = -riseAnswer; runAnswer = -runAnswer }
  }

  return {
    x1, y1, x2, y2,
    riseAnswer,
    runAnswer,
    decimalAnswer: rise === 0 ? 0 : riseAnswer / runAnswer,
    isZero: rise === 0,
    level,
  }
}

export function checkSlopeAnswer(input: string, problem: SlopeProblem): boolean {
  const trimmed = input.trim()
  if (trimmed === "") return false
  // accept fraction form "3/2" or "-1/2"
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/")
    if (parts.length !== 2) return false
    const n = parseFloat(parts[0])
    const d = parseFloat(parts[1])
    if (isNaN(n) || isNaN(d) || d === 0) return false
    return Math.abs(n / d - problem.decimalAnswer) < 0.001
  }
  // decimal or integer
  const parsed = parseFloat(trimmed)
  return !isNaN(parsed) && Math.abs(parsed - problem.decimalAnswer) < 0.001
}

export function getSlopeLevel(correctCount: number): number {
  if (correctCount >= 30) return 5
  if (correctCount >= 20) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}

export function formatSlope(rise: number, run: number): string {
  if (rise === 0) return "0"
  if (run === 1) return String(rise)
  return `${rise}/${run}`
}
