"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import {
  generateDecimalProblem,
  checkDecimalAnswer,
  getDecimalLevel,
  type DecimalProblem,
  type DecimalMode,
} from "./logic"
import { calculateProblemScore } from "@/utils/mathUtils"

interface DecimalDuelGameProps {
  mode?: DecimalMode
}

export function DecimalDuelGame({ mode = "compare" }: DecimalDuelGameProps) {
  const status = useGameStore((s) => s.status)
  const streak = useGameStore((s) => s.streak)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const addScore = useGameStore((s) => s.addScore)
  const incrementStreak = useGameStore((s) => s.incrementStreak)
  const resetStreak = useGameStore((s) => s.resetStreak)
  const incrementCorrect = useGameStore((s) => s.incrementCorrect)
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)
  const { playSound } = useSoundToggle()

  const [problem, setProblem] = useState<DecimalProblem | null>(null)
  const [input, setInput] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupCounter = useRef(0)
  const problemStart = useRef(Date.now())

  const spawnProblem = useCallback((count: number) => {
    const level = getDecimalLevel(count)
    setProblem(generateDecimalProblem(level, mode))
    setInput("")
    setFeedback(null)
    problemStart.current = Date.now()
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [mode])

  useEffect(() => {
    if (status === "playing") spawnProblem(0)
  }, [status, spawnProblem])

  const handleAnswer = useCallback((answer: string) => {
    if (!problem || feedback === "correct") return
    const elapsed = Date.now() - problemStart.current
    const correct = checkDecimalAnswer(answer, problem)
    if (timerRef.current) clearTimeout(timerRef.current)

    if (correct) {
      const pts = calculateProblemScore(streak, elapsed)
      addScore(pts)
      incrementStreak()
      incrementCorrect()
      incrementAttempts()
      if (streak >= 4) playSound("streak")
      else playSound("correct")
      setFeedback("correct")
      setInput(answer)
      setScorePopup({ pts, id: ++popupCounter.current })
      timerRef.current = setTimeout(() => spawnProblem(correctAnswers + 1), 350)
    } else {
      resetStreak()
      incrementAttempts()
      playSound("incorrect")
      setFeedback("wrong")
      setInput("")
      timerRef.current = setTimeout(() => {
        setFeedback(null)
        inputRef.current?.focus()
      }, 500)
    }
  }, [problem, feedback, streak, addScore, incrementStreak, resetStreak,
      incrementCorrect, incrementAttempts, playSound, spawnProblem, correctAnswers])

  if (status !== "playing" || !problem) return null

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      {/* Score popup */}
      <div className="relative h-6 w-full flex justify-center">
        <AnimatePresence>
          {scorePopup && (
            <motion.div key={scorePopup.id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -28 }}
              exit={{}} transition={{ duration: 0.65, ease: "easeOut" }} onAnimationComplete={() => setScorePopup(null)}
              className="absolute text-success font-black text-xl pointer-events-none">
              +{scorePopup.pts}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mode === "compare" ? (
        <CompareView problem={problem} feedback={feedback} onChoose={handleAnswer} />
      ) : (
        <ComputeView
          problem={problem}
          feedback={feedback}
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          onSubmit={() => handleAnswer(input)}
        />
      )}
    </div>
  )
}

// ─── Compare mode ─────────────────────────────────────────────────────────────

function CompareView({
  problem,
  feedback,
  onChoose,
}: {
  problem: DecimalProblem
  feedback: "correct" | "wrong" | null
  onChoose: (v: string) => void
}) {
  const places = Math.max(
    String(problem.valueA).split(".")[1]?.length ?? 0,
    String(problem.valueB).split(".")[1]?.length ?? 0
  )
  const fmt = (n: number) => n.toFixed(places)

  return (
    <div className={`w-full rounded-2xl border-2 bg-card p-8 transition-colors ${
      feedback === "correct" ? "border-success" : feedback === "wrong" ? "border-destructive" : "border-border"
    }`}>
      <p className="text-center text-sm text-muted-foreground mb-6">Which is <span className="font-bold text-foreground">greater</span>?</p>
      <div className="flex items-center justify-center gap-6">
        {(["A", "B"] as const).map((key) => {
          const val = key === "A" ? problem.valueA! : problem.valueB!
          const isAnswer = problem.answer === key
          return (
            <motion.button
              key={key}
              onClick={() => onChoose(key)}
              disabled={!!feedback}
              whileHover={{ scale: feedback ? 1 : 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`flex flex-col items-center rounded-2xl border-2 px-8 py-6 font-mono text-4xl font-black transition-all ${
                feedback && isAnswer ? "border-success bg-success/10 text-success"
                : feedback && !isAnswer ? "border-muted opacity-40"
                : "border-border hover:border-primary cursor-pointer"
              }`}
            >
              <span className="text-xs font-sans text-muted-foreground mb-1">{key}</span>
              {fmt(val)}
            </motion.button>
          )
        })}
      </div>
      {feedback === "correct" && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center text-sm font-bold text-success mt-4">
          ✓ Correct!
        </motion.p>
      )}
    </div>
  )
}

// ─── Compute mode ─────────────────────────────────────────────────────────────

function ComputeView({
  problem, feedback, input, setInput, inputRef, onSubmit,
}: {
  problem: DecimalProblem
  feedback: "correct" | "wrong" | null
  input: string
  setInput: (v: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onSubmit: () => void
}) {
  return (
    <>
      <div className={`w-full rounded-2xl border-2 bg-card px-8 py-8 text-center transition-colors ${
        feedback === "correct" ? "border-success" : feedback === "wrong" ? "border-destructive" : "border-border"
      }`}>
        <p className="font-mono text-4xl sm:text-5xl font-black tracking-wide text-foreground">
          {problem.displayText}
        </p>
        {feedback === "correct" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm font-bold text-success">
            ✓ Correct!
          </motion.p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-2xl font-black text-muted-foreground">= </span>
        <motion.input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onSubmit() } }}
          animate={feedback === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.35 }}
          disabled={feedback === "correct"}
          placeholder="?"
          className={`w-36 rounded-xl border-2 bg-input px-4 py-4 text-center font-mono text-3xl font-black outline-none transition-all placeholder:text-muted-foreground/30 disabled:opacity-60 ${
            feedback === "correct" ? "border-success ring-2 ring-success/25"
            : feedback === "wrong" ? "border-destructive ring-2 ring-destructive/25"
            : "border-input focus:border-primary focus:ring-2 focus:ring-primary/25"
          }`}
          autoComplete="off"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={!input.trim() || feedback === "correct"}
        className="rounded-xl bg-primary text-white font-bold py-3 px-8 hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit <span className="text-xs text-white/60 ml-1">(Enter)</span>
      </button>
    </>
  )
}
