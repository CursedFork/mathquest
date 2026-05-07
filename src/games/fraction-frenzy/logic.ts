/**
 * Fraction Frenzy — pure game logic.
 * Core mechanic: reduce a fraction to its simplest form.
 */

export interface FractionProblem {
  numerator: number
  denominator: number
  answerNum: number // fully reduced
  answerDen: number
  factor: number // what it was multiplied by (for debug / hint purposes)
}

export type FractionLevel = 1 | 2 | 3 | 4 | 5

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b)
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function simplifyFraction(num: number, den: number): [number, number] {
  const g = gcd(Math.abs(num), Math.abs(den))
  return [num / g, den / g]
}

export type CheckResult = "correct" | "partial" | "wrong"

/**
 * Checks the user's answer.
 * "partial" = equivalent to target but not fully reduced (e.g. 4/6 when answer is 2/3).
 */
export function checkFractionAnswer(
  userNum: number,
  userDen: number,
  targetNum: number,
  targetDen: number
): CheckResult {
  if (isNaN(userNum) || isNaN(userDen) || userDen === 0) return "wrong"
  // Cross-multiply for equivalence (avoids float division)
  const equivalent = userNum * targetDen === targetNum * userDen
  if (!equivalent) return "wrong"
  const fullyReduced = gcd(Math.abs(userNum), Math.abs(userDen)) === 1
  return fullyReduced ? "correct" : "partial"
}

export function generateFractionProblem(level: FractionLevel): FractionProblem {
  let targetNum = 1
  let targetDen = 2
  let factor = 2
  let attempts = 0

  // Keep regenerating until we get a coprime target (so the problem is actually reducible)
  do {
    attempts++
    switch (level) {
      case 1:
        targetDen = [2, 3, 4][randInt(0, 2)]
        targetNum = randInt(1, targetDen - 1)
        factor = randInt(2, 3)
        break
      case 2:
        targetDen = randInt(2, 8)
        targetNum = randInt(1, targetDen - 1)
        factor = randInt(2, 4)
        break
      case 3:
        targetDen = randInt(3, 10)
        targetNum = randInt(1, targetDen - 1)
        factor = randInt(3, 5)
        break
      case 4:
        targetDen = randInt(4, 12)
        targetNum = randInt(1, targetDen - 1)
        factor = randInt(4, 6)
        break
      case 5:
        targetDen = randInt(5, 15)
        targetNum = randInt(1, targetDen - 1)
        factor = randInt(5, 8)
        break
    }
  } while (gcd(targetNum, targetDen) !== 1 && attempts < 60)

  return {
    numerator: targetNum * factor,
    denominator: targetDen * factor,
    answerNum: targetNum,
    answerDen: targetDen,
    factor,
  }
}

export function getFractionLevel(correctCount: number): FractionLevel {
  if (correctCount >= 40) return 5
  if (correctCount >= 25) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}

export function getFractionLevelName(level: FractionLevel): string {
  const names: Record<FractionLevel, string> = {
    1: "Halves & Thirds",
    2: "Simple Fractions",
    3: "Harder Fractions",
    4: "Complex Fractions",
    5: "Expert Mode",
  }
  return names[level]
}

export function fractionProblemScore(streak: number, answerTimeMs: number): number {
  const base = 12
  const multiplier = streak >= 10 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1
  const timeBonus = answerTimeMs < 5000 ? 5 : 0 // slightly more lenient — fractions take longer
  return Math.round(base * multiplier) + timeBonus
}
