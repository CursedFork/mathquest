"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import {
  generateSlopeProblem,
  checkSlopeAnswer,
  getSlopeLevel,
  formatSlope,
  type SlopeProblem,
  type SlopeMode,
} from "./logic"
import { calculateProblemScore } from "@/utils/mathUtils"

interface SlopeSniperGameProps {
  mode?: SlopeMode
}

export function SlopeSniperGame({ mode = "all" }: SlopeSniperGameProps) {
  const status = useGameStore((s) => s.status)
  const streak = useGameStore((s) => s.streak)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const addScore = useGameStore((s) => s.addScore)
  const incrementStreak = useGameStore((s) => s.incrementStreak)
  const resetStreak = useGameStore((s) => s.resetStreak)
  const incrementCorrect = useGameStore((s) => s.incrementCorrect)
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)
  const { playSound } = useSoundToggle()

  const [problem, setProblem] = useState<SlopeProblem | null>(null)
  const [input, setInput] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupCounter = useRef(0)
  const problemStart = useRef(Date.now())

  const spawnProblem = useCallback((count: number) => {
    const level = getSlopeLevel(count)
    setProblem(generateSlopeProblem(level, mode))
    setInput("")
    setFeedback(null)
    problemStart.current = Date.now()
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [mode])

  useEffect(() => {
    if (status === "playing") spawnProblem(0)
  }, [status, spawnProblem])

  const handleSubmit = useCallback(() => {
    if (!problem || !input.trim() || feedback === "correct") return
    const elapsed = Date.now() - problemStart.current
    const correct = checkSlopeAnswer(input, problem)
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
      setScorePopup({ pts, id: ++popupCounter.current })
      timerRef.current = setTimeout(() => spawnProblem(correctAnswers + 1), 400)
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
  }, [problem, input, feedback, streak, addScore, incrementStreak, resetStreak,
      incrementCorrect, incrementAttempts, playSound, spawnProblem, correctAnswers])

  if (status !== "playing" || !problem) return null

  const slopeDisplay = formatSlope(problem.riseAnswer, problem.runAnswer)

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      {/* Score popup */}
      <div className="relative h-6 w-full flex justify-center">
        <AnimatePresence>
          {scorePopup && (
            <motion.div key={scorePopup.id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -28 }}
              exit={{}} transition={{ duration: 0.65 }} onAnimationComplete={() => setScorePopup(null)}
              className="absolute text-success font-black text-xl pointer-events-none">
              +{scorePopup.pts}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Points display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${problem.x1},${problem.y1},${problem.x2},${problem.y2}`}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={`w-full rounded-2xl border-2 bg-card px-8 py-8 transition-colors ${
            feedback === "correct" ? "border-success" : feedback === "wrong" ? "border-destructive" : "border-border"
          }`}
        >
          <p className="text-xs text-muted-foreground text-center mb-4">Find the slope between these two points</p>
          <div className="flex items-center justify-center gap-8">
            <PointCard label="A" x={problem.x1} y={problem.y1} />
            <div className="text-3xl text-muted-foreground font-bold">→</div>
            <PointCard label="B" x={problem.x2} y={problem.y2} />
          </div>
          {feedback === "correct" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
              <p className="text-sm font-bold text-success">
                ✓ slope = {slopeDisplay}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                rise = {problem.riseAnswer} · run = {problem.runAnswer}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Input */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-2xl font-black text-muted-foreground">m =</span>
        <motion.input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit() } }}
          animate={feedback === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.35 }}
          disabled={feedback === "correct"}
          placeholder="rise/run"
          className={`w-36 rounded-xl border-2 bg-input px-4 py-4 text-center font-mono text-2xl font-black outline-none transition-all placeholder:text-muted-foreground/30 disabled:opacity-60 ${
            feedback === "correct" ? "border-success ring-2 ring-success/25"
            : feedback === "wrong" ? "border-destructive ring-2 ring-destructive/25"
            : "border-input focus:border-primary focus:ring-2 focus:ring-primary/25"
          }`}
          autoComplete="off"
        />
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Enter slope as a fraction (e.g. 3/2) or decimal · Enter to submit
      </p>

      <button
        onClick={handleSubmit}
        disabled={!input.trim() || feedback === "correct"}
        className="rounded-xl bg-primary text-white font-bold py-3 px-8 hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-40"
      >
        Submit <span className="text-xs text-white/60 ml-1">(Enter)</span>
      </button>
    </div>
  )
}

function PointCard({ label, x, y }: { label: string; x: number; y: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span className="font-mono text-3xl font-black text-foreground">({x}, {y})</span>
    </div>
  )
}
