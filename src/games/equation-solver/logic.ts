/**
 * Equation Solver — pure game logic.
 * Core mechanic: solve a linear equation for x.
 */

export interface EquationProblem {
  display: string // e.g. "2x + 5 = 13"
  answer: number  // the integer value of x
  level: number
  typeName: string
}

export type EquationLevel = 1 | 2 | 3 | 4 | 5
export type EquationFocus = "mixed" | EquationLevel

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateEquationProblem(level: EquationLevel): EquationProblem {
  switch (level) {
    case 1: {
      // x + a = b  or  x − a = b   (one-step, always positive answer)
      const answer = randInt(1, 20)
      const a = randInt(1, 15)
      const subtract = Math.random() > 0.5
      const b = subtract ? answer - a : answer + a
      if (b <= 0 || b > 35) return generateEquationProblem(1)
      return {
        display: subtract ? `x − ${a} = ${b}` : `x + ${a} = ${b}`,
        answer,
        level,
        typeName: "One-Step +/−",
      }
    }

    case 2: {
      // ax = b   (one-step multiplication/division)
      const a = randInt(2, 12)
      const answer = randInt(1, 12)
      return {
        display: `${a}x = ${a * answer}`,
        answer,
        level,
        typeName: "One-Step ×",
      }
    }

    case 3: {
      // ax + b = c   (two-step)
      const a = randInt(2, 8)
      const answer = randInt(1, 10)
      const b = randInt(1, 20)
      const c = a * answer + b
      return {
        display: `${a}x + ${b} = ${c}`,
        answer,
        level,
        typeName: "Two-Step",
      }
    }

    case 4: {
      // ax − b = c   (two-step with subtraction) or  ax + b = c  with larger values
      const a = randInt(2, 9)
      const answer = randInt(2, 12)
      const b = randInt(1, 15)
      const c = a * answer - b
      if (c <= 0) return generateEquationProblem(4)
      return {
        display: `${a}x − ${b} = ${c}`,
        answer,
        level,
        typeName: "Two-Step −",
      }
    }

    case 5: {
      // ax + b = cx + d   (variables on both sides)
      // Ensure a > c so x is positive
      const c = randInt(1, 4)
      const a = c + randInt(1, 5)
      const answer = randInt(1, 10)
      const b = randInt(1, 10)
      const d = (a - c) * answer + b
      return {
        display: `${a}x + ${b} = ${c}x + ${d}`,
        answer,
        level,
        typeName: "Both Sides",
      }
    }

    default:
      return generateEquationProblem(1)
  }
}

export function checkEquationAnswer(raw: string, problem: EquationProblem): boolean {
  const parsed = parseInt(raw.trim(), 10)
  return !isNaN(parsed) && parsed === problem.answer
}

export function getEquationLevel(correctCount: number): EquationLevel {
  if (correctCount >= 40) return 5
  if (correctCount >= 25) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}
