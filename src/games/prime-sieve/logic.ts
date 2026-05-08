/** Prime Sieve — pure game logic. */

export interface PrimeProblem {
  number: number
  isPrime: boolean
  level: number
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

function getRange(level: number): [number, number] {
  if (level === 1) return [2, 20]
  if (level === 2) return [2, 50]
  if (level === 3) return [2, 100]
  if (level === 4) return [50, 150]
  return [100, 300]
}

export function generatePrimeProblem(level: number): PrimeProblem {
  const [min, max] = getRange(level)
  // Mix primes and composites roughly 50/50 for educational balance
  let n: number
  // Alternate between prime and composite generations to ensure variety
  if (Math.random() < 0.5) {
    // try to get a prime
    let attempts = 0
    do {
      n = randInt(min, max)
      attempts++
    } while (!isPrime(n) && attempts < 20)
    if (!isPrime(n)) n = randInt(min, max) // fallback
  } else {
    // try to get a composite
    let attempts = 0
    do {
      n = randInt(min, max)
      attempts++
    } while (isPrime(n) && attempts < 20)
    if (isPrime(n)) n = randInt(min, max) // fallback
  }
  return { number: n, isPrime: isPrime(n), level }
}

export function getPrimeLevel(correctCount: number): number {
  if (correctCount >= 30) return 5
  if (correctCount >= 20) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}

export function getPrimeLevelName(level: number): string {
  const names: Record<number, string> = {
    1: "Up to 20",
    2: "Up to 50",
    3: "Up to 100",
    4: "Up to 150",
    5: "Up to 300",
  }
  return names[level] ?? "Unknown"
}

export function getSmallFacts(n: number): string {
  if (n === 1) return "1 is neither prime nor composite"
  if (isPrime(n)) return `${n} is prime — divisible only by 1 and ${n}`
  // find smallest factor
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return `${n} = ${i} × ${n / i}`
  }
  return ""
}
