/** Factor Factory — pure game logic. */

export interface FactorProblem {
  number: number
  allFactors: number[]  // sorted ascending
  level: number
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getFactors(n: number): number[] {
  const factors: number[] = []
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i)
  }
  return factors
}

export function generateFactorProblem(level: number): FactorProblem {
  // Use numbers with more factors at higher levels — avoid primes
  const candidates = getCandidates(level)
  const number = candidates[randInt(0, candidates.length - 1)]
  return { number, allFactors: getFactors(number), level }
}

function getCandidates(level: number): number[] {
  // Pre-curated numbers with interesting factor counts
  if (level === 1) return [4, 6, 8, 9, 10, 12, 14, 15, 16]
  if (level === 2) return [12, 18, 20, 24, 28, 30, 32, 36]
  if (level === 3) return [24, 36, 40, 48, 60, 72, 80]
  if (level === 4) return [48, 60, 72, 84, 90, 96, 100]
  return [60, 72, 84, 96, 100, 120, 144]
}

export function getFactorLevel(correctCount: number): number {
  if (correctCount >= 25) return 5
  if (correctCount >= 15) return 4
  if (correctCount >= 8) return 3
  if (correctCount >= 3) return 2
  return 1
}

export function isValidFactor(input: string, problem: FactorProblem): "valid" | "not-factor" | "invalid" {
  const n = parseInt(input.trim(), 10)
  if (isNaN(n) || n <= 0) return "invalid"
  if (problem.number % n !== 0) return "not-factor"
  return "valid"
}

export function scoreFactorRound(
  collected: number[],
  allFactors: number[],
  streak: number
): number {
  const correctFound = collected.filter((f) => allFactors.includes(f)).length
  const total = allFactors.length
  const ratio = correctFound / total
  const base = Math.round(ratio * 15 * total)
  const multiplier = streak >= 10 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1
  return Math.max(0, Math.round(base * multiplier))
}
