/** Decimal Duel — pure game logic. */

export type DecimalMode = "compare" | "add" | "subtract"

export interface DecimalProblem {
  mode: DecimalMode
  // compare mode
  valueA?: number
  valueB?: number
  answer?: "A" | "B" | "equal"
  // compute mode
  num1?: number
  num2?: number
  result?: number
  displayText?: string
  decimalPlaces?: number
  level: number
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randDecimal(min: number, max: number, places: number): number {
  const factor = Math.pow(10, places)
  const raw = randInt(Math.round(min * factor), Math.round(max * factor))
  return raw / factor
}

export function generateDecimalProblem(level: number, mode: DecimalMode): DecimalProblem {
  const places = level <= 2 ? 1 : level <= 4 ? 2 : 2

  if (mode === "compare") {
    const range = level <= 2 ? 10 : 100
    const a = randDecimal(0, range, places)
    let b = randDecimal(0, range, places)
    // occasionally make them equal for levels 3+
    if (level >= 3 && Math.random() < 0.1) b = a
    const answer: "A" | "B" | "equal" = a > b ? "A" : b > a ? "B" : "equal"
    return { mode, valueA: a, valueB: b, answer, level }
  }

  // add or subtract
  const range = level <= 2 ? 5 : level <= 4 ? 20 : 50
  let num1 = randDecimal(0.1, range, places)
  let num2 = randDecimal(0.1, range, places)

  if (mode === "subtract" && num2 > num1) {
    [num1, num2] = [num2, num1]
  }

  const result =
    mode === "add"
      ? parseFloat((num1 + num2).toFixed(places + 1))
      : parseFloat((num1 - num2).toFixed(places + 1))

  const op = mode === "add" ? "+" : "−"
  const displayText = `${num1.toFixed(places)} ${op} ${num2.toFixed(places)}`

  return { mode, num1, num2, result, displayText, decimalPlaces: places, level }
}

export function checkDecimalAnswer(input: string, problem: DecimalProblem): boolean {
  if (problem.mode === "compare") {
    const t = input.trim().toUpperCase()
    return t === problem.answer || (problem.answer === "equal" && t === "EQUAL")
  }
  const parsed = parseFloat(input.trim())
  if (isNaN(parsed)) return false
  return Math.abs(parsed - (problem.result ?? 0)) < 0.001
}

export function getDecimalLevel(correctCount: number): number {
  if (correctCount >= 30) return 5
  if (correctCount >= 20) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}

export function formatDecimal(n: number, places: number): string {
  return n.toFixed(places)
}
