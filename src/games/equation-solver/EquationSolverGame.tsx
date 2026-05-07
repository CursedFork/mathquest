"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import { EquationDisplay } from "./EquationDisplay"
import {
  generateEquationProblem,
  checkEquationAnswer,
  getEquationLevel,
  type EquationProblem,
  type EquationLevel,
} from "./logic"
import { calculateProblemScore } from "@/utils/mathUtils"

export function EquationSolverGame() {
  const status = useGameStore((s) => s.status)
  const streak = useGameStore((s) => s.streak)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const addScore = useGameStore((s) => s.addScore)
  const incrementStreak = useGameStore((s) => s.incrementStreak)
  const resetStreak = useGameStore((s) => s.resetStreak)
  const incrementCorrect = useGameStore((s) => s.incrementCorrect)
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)
  const { playSound } = useSoundToggle()

  const [problem, setProblem] = useState<EquationProblem | null>(null)
  const [input, setInput] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)
  const [currentLevel, setCurrentLevel] = useState<EquationLevel>(1)
  const [prevLevel, setPrevLevel] = useState<EquationLevel>(1)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupCounter = useRef(0)
  const problemStart = useRef(Date.now())

  const spawnProblem = useCallback((count: number) => {
    const level = getEquationLevel(count)
    setCurrentLevel(level)
    setProblem(generateEquationProblem(level))
    setInput("")
    setFeedback(null)
    problemStart.current = Date.now()
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  useEffect(() => {
    if (status === "playing") spawnProblem(0)
  }, [status, spawnProblem])

  // Level-up notification
  useEffect(() => {
    if (currentLevel > prevLevel && status === "playing") {
      playSound("levelup")
      setPrevLevel(currentLevel)
    }
  }, [currentLevel, prevLevel, status, playSound])

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const handleSubmit = useCallback(() => {
    if (!problem || !input.trim() || feedback === "correct") return

    const elapsed = Date.now() - problemStart.current
    const correct = checkEquationAnswer(input, problem)

    clearTimer()

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
      timerRef.current = setTimeout(() => spawnProblem(correctAnswers + 1), 320)
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
  }, [
    problem, input, feedback, streak,
    addScore, incrementStreak, resetStreak, incrementCorrect,
    incrementAttempts, playSound, spawnProblem, correctAnswers,
  ])

  if (status !== "playing" || !problem) return null

  const levelColors: Record<EquationLevel, string> = {
    1: "text-green-400 bg-green-500/15 border-green-500/30",
    2: "text-blue-400 bg-blue-500/15 border-blue-500/30",
    3: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
    4: "text-orange-400 bg-orange-500/15 border-orange-500/30",
    5: "text-red-400 bg-red-500/15 border-red-500/30",
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      {/* Level badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Level</span>
          <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${levelColors[currentLevel]}`}>
            {currentLevel} — {problem.typeName}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Score popup */}
      <div className="relative h-6 w-full flex justify-center">
        <AnimatePresence>
          {scorePopup && (
            <motion.div
              key={scorePopup.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -28 }}
              exit={{}}
              transition={{ duration: 0.65, ease: "easeOut" }}
              onAnimationComplete={() => setScorePopup(null)}
              className="absolute text-success font-black text-xl pointer-events-none"
            >
              +{scorePopup.pts}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Equation display */}
      <EquationDisplay display={problem.display} feedback={feedback} />

      {/* x = [input] */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-3xl font-black text-muted-foreground">x =</span>
        <motion.input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit() } }}
          animate={feedback === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.35 }}
          disabled={feedback === "correct"}
          placeholder="?"
          className={`w-28 rounded-xl border-2 bg-input px-4 py-4 text-center font-mono text-3xl font-black outline-none transition-all duration-150 placeholder:text-muted-foreground/30 disabled:opacity-60 ${
            feedback === "correct"
              ? "border-success ring-2 ring-success/25"
              : feedback === "wrong"
                ? "border-destructive ring-2 ring-destructive/25"
                : "border-input focus:border-primary focus:ring-2 focus:ring-primary/25"
          }`}
          autoComplete="off"
        />
      </div>

      {/* Hint about variable */}
      <p className="text-xs text-muted-foreground">
        Solve for <span className="font-mono font-bold text-foreground">x</span> · Press Enter to submit
      </p>

      <button
        onClick={handleSubmit}
        disabled={!input.trim() || feedback === "correct"}
        className="rounded-xl bg-primary text-white font-bold py-3 px-8 hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Solve <span className="text-xs text-white/60 ml-1">(Enter)</span>
      </button>

      {/* Streak dots */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <span>Streak:</span>
          <div className="flex gap-1">
            {[...Array(Math.min(streak, 10))].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-primary" style={{ opacity: 0.4 + i * 0.06 }} />
            ))}
            {streak > 10 && <span className="text-xs text-primary font-bold ml-1">+{streak - 10}</span>}
          </div>
        </motion.div>
      )}
    </div>
  )
}
