/** Sequence Spotter — pure game logic. */

export type SequenceMode = "arithmetic" | "geometric" | "mixed"

export interface SequenceProblem {
  terms: number[]       // displayed terms (first 4 or 5)
  nextTerm: number      // answer
  mode: "arithmetic" | "geometric"
  rule: string          // human-readable description for after correct
  level: number
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateSequenceProblem(
  level: number,
  mode: SequenceMode
): SequenceProblem {
  const useGeometric =
    mode === "geometric" ||
    (mode === "mixed" && Math.random() < 0.4 && level >= 3)

  if (useGeometric) {
    return generateGeometric(level)
  }
  return generateArithmetic(level)
}

function generateArithmetic(level: number): SequenceProblem {
  const step = level <= 1 ? randInt(1, 5) :
               level <= 2 ? randInt(1, 10) :
               level <= 3 ? randInt(-10, 10) :
               level <= 4 ? randInt(-15, 15) :
                            randInt(-20, 20)
  // avoid 0 step
  const d = step === 0 ? 1 : step
  const start = level <= 2 ? randInt(1, 20) : randInt(-20, 30)
  const count = level <= 3 ? 4 : 5
  const terms: number[] = []
  for (let i = 0; i < count; i++) terms.push(start + i * d)
  const nextTerm = start + count * d
  const sign = d > 0 ? "+" : "−"
  return {
    terms,
    nextTerm,
    mode: "arithmetic",
    rule: `Each term ${sign} ${Math.abs(d)}`,
    level,
  }
}

function generateGeometric(level: number): SequenceProblem {
  // Ratios that keep numbers reasonable
  const ratios = level <= 3 ? [2, 3] : level <= 4 ? [2, 3, 4] : [2, 3, 4, 5]
  const ratio = ratios[randInt(0, ratios.length - 1)]
  const start = level <= 2 ? randInt(1, 5) : randInt(1, 4)
  const count = 4
  const terms: number[] = []
  for (let i = 0; i < count; i++) terms.push(start * Math.pow(ratio, i))
  const nextTerm = start * Math.pow(ratio, count)
  return {
    terms,
    nextTerm,
    mode: "geometric",
    rule: `Each term × ${ratio}`,
    level,
  }
}

export function checkSequenceAnswer(input: string, problem: SequenceProblem): boolean {
  const parsed = parseFloat(input.trim())
  return !isNaN(parsed) && Math.abs(parsed - problem.nextTerm) < 0.001
}

export function getSequenceLevel(correctCount: number): number {
  if (correctCount >= 30) return 5
  if (correctCount >= 20) return 4
  if (correctCount >= 12) return 3
  if (correctCount >= 5) return 2
  return 1
}
