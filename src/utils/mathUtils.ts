export type Operation = "+" | "-" | "*" | "/"

export interface MathProblem {
  num1: number
  num2: number
  operation: Operation
  answer: number
  displayText: string
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickOp(ops: Operation[]): Operation {
  return ops[Math.floor(Math.random() * ops.length)]
}

export function generateArithmeticProblem(level: DifficultyLevel): MathProblem {
  let num1: number, num2: number, answer: number
  let operation: Operation

  switch (level) {
    case 1: {
      // Single-digit add / subtract — guaranteed non-negative results
      operation = pickOp(["+", "-"])
      num1 = randInt(1, 9)
      num2 = randInt(1, 9)
      if (operation === "-" && num2 > num1) [num1, num2] = [num2, num1]
      answer = operation === "+" ? num1 + num2 : num1 - num2
      break
    }
    case 2: {
      // Two-digit add / subtract
      operation = pickOp(["+", "-"])
      num1 = randInt(10, 99)
      num2 = randInt(1, 49)
      if (operation === "-" && num2 > num1) [num1, num2] = [num2, num1]
      answer = operation === "+" ? num1 + num2 : num1 - num2
      break
    }
    case 3: {
      // Introduce multiplication (times tables)
      operation = pickOp(["+", "-", "*"])
      if (operation === "*") {
        num1 = randInt(2, 12)
        num2 = randInt(2, 12)
        answer = num1 * num2
      } else if (operation === "+") {
        num1 = randInt(10, 50)
        num2 = randInt(10, 50)
        answer = num1 + num2
      } else {
        num1 = randInt(20, 99)
        num2 = randInt(1, 20)
        if (num2 > num1) [num1, num2] = [num2, num1]
        answer = num1 - num2
      }
      break
    }
    case 4: {
      // Add clean division (no remainders)
      operation = pickOp(["+", "-", "*", "/"])
      if (operation === "/") {
        num2 = randInt(2, 12)
        answer = randInt(2, 12)
        num1 = num2 * answer
      } else if (operation === "*") {
        num1 = randInt(2, 15)
        num2 = randInt(2, 15)
        answer = num1 * num2
      } else {
        num1 = randInt(20, 100)
        num2 = randInt(10, 50)
        if (operation === "-" && num2 > num1) [num1, num2] = [num2, num1]
        answer = operation === "+" ? num1 + num2 : num1 - num2
      }
      break
    }
    case 5: {
      // Mixed — random draw from levels 2-4
      return generateArithmeticProblem(randInt(2, 4) as DifficultyLevel)
    }
    default: {
      operation = "+"
      num1 = randInt(1, 9)
      num2 = randInt(1, 9)
      answer = num1 + num2
    }
  }

  return {
    num1,
    num2,
    operation,
    answer,
    displayText: `${num1} ${formatOperation(operation)} ${num2}`,
  }
}

export function formatOperation(op: Operation): string {
  const symbols: Record<Operation, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" }
  return symbols[op]
}

export function getDifficultyLevel(correctCount: number): DifficultyLevel {
  if (correctCount >= 40) return 5
  if (correctCount >= 25) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 6) return 2
  return 1
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 3
  if (streak >= 5) return 2
  if (streak >= 3) return 1.5
  return 1
}

export function calculateProblemScore(streak: number, answerTimeMs: number): number {
  const base = 10
  const multiplier = getStreakMultiplier(streak)
  const timeBonus = answerTimeMs < 3000 ? 5 : 0
  return Math.round(base * multiplier) + timeBonus
}

export function generateCoordinatePoint(max: number = 8): { x: number; y: number } {
  const x = randInt(-max, max)
  const y = randInt(-max, max)
  return { x, y }
}
