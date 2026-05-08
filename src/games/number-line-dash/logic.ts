/** Number Line Dash — pure game logic. */

export type NumberLineMode = "integers" | "decimals" | "fractions"

export interface NumberLineProblem {
  value: number          // exact numeric value (used for checking)
  displayValue: string   // formatted string shown after correct answer
  min: number            // left edge of number line
  max: number            // right edge of number line
  tickStep: number       // spacing between labeled ticks
  level: number
  mode: NumberLineMode
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateNumberLineProblem(
  level: number,
  mode: NumberLineMode
): NumberLineProblem {
  if (mode === "integers") {
    const range = level <= 2 ? 10 : level <= 4 ? 15 : 20
    // avoid 0 to make it slightly harder
    let value = randInt(-range, range)
    while (value === 0) value = randInt(-range, range)
    return {
      value,
      displayValue: String(value),
      min: -range,
      max: range,
      tickStep: level <= 2 ? 2 : 5,
      level,
      mode,
    }
  }

  if (mode === "fractions") {
    const denOptions = level <= 2 ? [2, 4] : level <= 4 ? [2, 3, 4] : [2, 3, 4, 5, 6]
    const den = denOptions[randInt(0, denOptions.length - 1)]
    const halfRange = level <= 2 ? 2 : 3
    let num = randInt(-halfRange * den, halfRange * den)
    // avoid 0 and whole numbers
    while (num === 0 || num % den === 0) num = randInt(-halfRange * den, halfRange * den)
    const value = num / den
    // display as simplified fraction
    const g = gcd(Math.abs(num), den)
    const sNum = num / g
    const sDen = den / g
    const displayValue = `${sNum}/${sDen}`
    return { value, displayValue, min: -halfRange - 1, max: halfRange + 1, tickStep: 1, level, mode }
  }

  // decimals
  const places = level <= 2 ? 1 : 2
  const range = level <= 2 ? 5 : level <= 4 ? 10 : 10
  const factor = Math.pow(10, places)
  let intVal = randInt(-range * factor, range * factor)
  while (intVal === 0) intVal = randInt(-range * factor, range * factor)
  const value = intVal / factor
  return {
    value,
    displayValue: value.toFixed(places),
    min: -range,
    max: range,
    tickStep: level <= 2 ? 1 : 2,
    level,
    mode,
  }
}

export function checkNumberLineAnswer(input: string, problem: NumberLineProblem): boolean {
  const trimmed = input.trim()
  if (trimmed === "") return false
  // accept fraction input like "3/4"
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/")
    if (parts.length !== 2) return false
    const n = parseFloat(parts[0])
    const d = parseFloat(parts[1])
    if (isNaN(n) || isNaN(d) || d === 0) return false
    return Math.abs(n / d - problem.value) < 0.001
  }
  const parsed = parseFloat(trimmed)
  return !isNaN(parsed) && Math.abs(parsed - problem.value) < 0.001
}

export function getNumberLineLevel(correctCount: number): number {
  if (correctCount >= 30) return 5
  if (correctCount >= 20) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}
