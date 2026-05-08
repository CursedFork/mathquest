/** Proportion Puzzle — pure game logic. */

export interface ProportionProblem {
  // a/b = c/d, one value is missing (always d for consistency)
  a: number
  b: number
  c: number
  answer: number  // d = (b * c) / a
  displayText: string  // e.g. "3/4 = 6/?"
  level: number
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b)
  return b === 0 ? a : gcd(b, a % b)
}

export function generateProportionProblem(level: number): ProportionProblem {
  // Strategy: pick ratio a:b (coprime), pick integer multiplier k, so c = a*k, d = b*k
  // This guarantees integer answer

  let a: number, b: number, k: number

  switch (level) {
    case 1:
      a = randInt(1, 5)
      b = randInt(1, 5)
      k = randInt(2, 5)
      break
    case 2:
      a = randInt(1, 8)
      b = randInt(1, 8)
      k = randInt(2, 8)
      break
    case 3:
      a = randInt(2, 10)
      b = randInt(2, 10)
      k = randInt(2, 10)
      break
    case 4:
      a = randInt(3, 12)
      b = randInt(3, 12)
      k = randInt(3, 15)
      break
    default:
      a = randInt(4, 15)
      b = randInt(4, 15)
      k = randInt(4, 20)
      break
  }

  // Ensure a and b are coprime for clean ratios
  const g = gcd(a, b)
  a = a / g
  b = b / g

  const c = a * k
  const d = b * k

  return {
    a,
    b,
    c,
    answer: d,
    displayText: `${a}/${b} = ${c}/?`,
    level,
  }
}

export function checkProportionAnswer(input: string, problem: ProportionProblem): boolean {
  const parsed = parseInt(input.trim(), 10)
  return !isNaN(parsed) && parsed === problem.answer
}

export function getProportionLevel(correctCount: number): number {
  if (correctCount >= 30) return 5
  if (correctCount >= 20) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}
