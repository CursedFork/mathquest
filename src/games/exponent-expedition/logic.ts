/** Exponent Expedition — pure game logic. */

export type ExponentLevel = 1 | 2 | 3 | 4 | 5

export interface ExponentProblem {
  displayText: string  // e.g. "2³" or "x² · x³ = x^?"
  answer: number       // always an integer
  level: ExponentLevel
  typeName: string
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const sup = (n: number): string => {
  const map: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻",
  }
  return String(n).split("").map((c) => map[c] ?? c).join("")
}

export function generateExponentProblem(level: ExponentLevel): ExponentProblem {
  switch (level) {
    case 1: {
      // Direct evaluation: base^exp = ?
      const base = randInt(2, 5)
      const exp = randInt(2, 4)
      const answer = Math.pow(base, exp)
      return {
        displayText: `${base}${sup(exp)} = ?`,
        answer,
        level,
        typeName: "Evaluate",
      }
    }
    case 2: {
      // Product rule: x^a · x^b = x^?
      const a = randInt(2, 6)
      const b = randInt(1, 5)
      return {
        displayText: `x${sup(a)} · x${sup(b)} = x^?`,
        answer: a + b,
        level,
        typeName: "Product Rule",
      }
    }
    case 3: {
      // Quotient rule: x^a / x^b = x^?  (ensure a > b)
      const b = randInt(1, 4)
      const a = b + randInt(1, 5)
      return {
        displayText: `x${sup(a)} ÷ x${sup(b)} = x^?`,
        answer: a - b,
        level,
        typeName: "Quotient Rule",
      }
    }
    case 4: {
      // Power rule: (x^a)^b = x^?
      const a = randInt(2, 5)
      const b = randInt(2, 4)
      return {
        displayText: `(x${sup(a)})${sup(b)} = x^?`,
        answer: a * b,
        level,
        typeName: "Power Rule",
      }
    }
    case 5: {
      // Mixed with negative exponents: x^a · x^(-b) = x^?
      const a = randInt(3, 7)
      const b = randInt(1, a - 1) // ensure answer can be pos or neg
      const useProduct = Math.random() > 0.5
      if (useProduct) {
        return {
          displayText: `x${sup(a)} · x${sup(-b)} = x^?`,
          answer: a - b,
          level,
          typeName: "Negative Exponents",
        }
      } else {
        return {
          displayText: `x${sup(a)} ÷ x${sup(b + 1)} = x^?`,
          answer: a - (b + 1),
          level,
          typeName: "Negative Exponents",
        }
      }
    }
    default:
      return generateExponentProblem(1)
  }
}

export function checkExponentAnswer(input: string, problem: ExponentProblem): boolean {
  const parsed = parseInt(input.trim(), 10)
  return !isNaN(parsed) && parsed === problem.answer
}

export function getExponentLevel(correctCount: number): ExponentLevel {
  if (correctCount >= 30) return 5
  if (correctCount >= 20) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}
