"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import { FractionDisplay } from "./FractionDisplay"
import {
  generateFractionProblem,
  generateFractionArithProblem,
  checkFractionAnswer,
  getFractionLevel,
  getFractionLevelName,
  fractionProblemScore,
  type FractionProblem,
  type FractionLevel,
  type FractionMode,
  type CheckResult,
} from "./logic"

interface FractionFrenzyGameProps {
  mode?: FractionMode
}

export function FractionFrenzyGame({ mode = "simplify" }: FractionFrenzyGameProps) {
  const status = useGameStore((s) => s.status)
  const streak = useGameStore((s) => s.streak)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const addScore = useGameStore((s) => s.addScore)
  const incrementStreak = useGameStore((s) => s.incrementStreak)
  const resetStreak = useGameStore((s) => s.resetStreak)
  const incrementCorrect = useGameStore((s) => s.incrementCorrect)
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)
  const { playSound } = useSoundToggle()

  const [problem, setProblem] = useState<FractionProblem | null>(null)
  const [numInput, setNumInput] = useState("")
  const [denInput, setDenInput] = useState("")
  const [feedback, setFeedback] = useState<CheckResult | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)
  const [currentLevel, setCurrentLevel] = useState<FractionLevel>(1)

  const numRef = useRef<HTMLInputElement>(null)
  const denRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupCounter = useRef(0)
  const problemStart = useRef(Date.now())

  const spawnProblem = useCallback((count: number) => {
    const level = getFractionLevel(count)
    setCurrentLevel(level)
    setProblem(
      mode === "add" ? generateFractionArithProblem(level, "add") :
      mode === "subtract" ? generateFractionArithProblem(level, "subtract") :
      generateFractionProblem(level)
    )
    setNumInput("")
    setDenInput("")
    setFeedback(null)
    setFeedbackMsg(null)
    problemStart.current = Date.now()
    requestAnimationFrame(() => numRef.current?.focus())
  }, [mode])

  useEffect(() => {
    if (status === "playing") spawnProblem(0)
  }, [status, spawnProblem])

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const handleSubmit = useCallback(() => {
    if (!problem || feedback === "correct") return
    const userNum = parseInt(numInput.trim(), 10)
    const userDen = parseInt(denInput.trim(), 10)
    if (isNaN(userNum) || isNaN(userDen)) {
      numRef.current?.focus()
      return
    }

    const elapsed = Date.now() - problemStart.current
    const result = checkFractionAnswer(userNum, userDen, problem.answerNum, problem.answerDen)

    clearTimer()

    if (result === "correct") {
      const pts = fractionProblemScore(streak, elapsed)
      addScore(pts)
      incrementStreak()
      incrementCorrect()
      incrementAttempts()
      if (streak >= 4) playSound("streak")
      else playSound("correct")
      setFeedback("correct")
      setFeedbackMsg(`✓ ${problem.answerNum}/${problem.answerDen} — correct!${problem.operation ? " (simplified)" : ""}`)
      setScorePopup({ pts, id: ++popupCounter.current })
      timerRef.current = setTimeout(() => spawnProblem(correctAnswers + 1), 500)
    } else if (result === "partial") {
      // Equivalent but not fully reduced — educationally important to reject
      resetStreak()
      incrementAttempts()
      playSound("incorrect")
      setFeedback("partial")
      setFeedbackMsg("Simplify further! That's not fully reduced yet.")
      setNumInput("")
      setDenInput("")
      timerRef.current = setTimeout(() => {
        setFeedback(null)
        setFeedbackMsg(null)
        numRef.current?.focus()
      }, 1200)
    } else {
      resetStreak()
      incrementAttempts()
      playSound("incorrect")
      setFeedback("wrong")
      setFeedbackMsg("Not quite — try again.")
      setNumInput("")
      setDenInput("")
      timerRef.current = setTimeout(() => {
        setFeedback(null)
        setFeedbackMsg(null)
        numRef.current?.focus()
      }, 700)
    }
  }, [
    problem, feedback, numInput, denInput, streak,
    addScore, incrementStreak, resetStreak, incrementCorrect,
    incrementAttempts, playSound, spawnProblem, correctAnswers,
  ])

  if (status !== "playing" || !problem) return null

  const borderClass =
    feedback === "correct"
      ? "border-success"
      : feedback === "partial"
        ? "border-warning"
        : feedback === "wrong"
          ? "border-destructive"
          : "border-border"

  return (
    <div className={`flex flex-col items-center gap-8 w-full ${mode === "simplify" ? "max-w-lg" : "max-w-2xl"}`}>
      {/* Level badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Level</span>
          <span className="rounded-full bg-secondary/15 border border-secondary/30 px-3 py-0.5 text-xs font-bold text-secondary">
            {currentLevel} — {getFractionLevelName(currentLevel)}
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
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => setScorePopup(null)}
              className="absolute text-success font-black text-xl pointer-events-none"
            >
              +{scorePopup.pts}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main problem area */}
      <motion.div
        className={`w-full rounded-2xl border-2 bg-card p-8 transition-colors duration-200 ${borderClass}`}
        animate={feedback === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {/* Problem display: single fraction (simplify) or two fractions + operator (add/sub) */}
          {problem.operation ? (
            <>
              <FractionDisplay numerator={problem.numerator} denominator={problem.denominator} compact />
              <span className="text-4xl font-black text-foreground select-none">
                {problem.operation === "add" ? "+" : "−"}
              </span>
              <FractionDisplay numerator={problem.num2!} denominator={problem.den2!} compact />
            </>
          ) : (
            <FractionDisplay numerator={problem.numerator} denominator={problem.denominator} />
          )}

          {/* Equals */}
          <span className="text-4xl font-bold text-muted-foreground">=</span>

          {/* Answer fraction (two inputs) */}
          <div className="flex flex-col items-center gap-1">
            <FractionInput
              ref={numRef}
              value={numInput}
              onChange={setNumInput}
              onEnter={() => denRef.current?.focus()}
              feedback={feedback}
              placeholder="?"
            />
            <div className="w-full h-1 rounded-full bg-muted-foreground/40 my-0.5" />
            <FractionInput
              ref={denRef}
              value={denInput}
              onChange={setDenInput}
              onEnter={handleSubmit}
              feedback={feedback}
              placeholder="?"
            />
          </div>
        </div>
      </motion.div>

      {/* Feedback message */}
      <div className="h-6">
        <AnimatePresence mode="wait">
          {feedbackMsg && (
            <motion.p
              key={feedbackMsg}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-medium text-center ${
                feedback === "correct"
                  ? "text-success"
                  : feedback === "partial"
                    ? "text-warning"
                    : "text-destructive"
              }`}
            >
              {feedbackMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground text-center">
        {mode === "simplify"
          ? "Reduce the fraction to its simplest form"
          : `Enter the simplified result of the ${mode === "add" ? "addition" : "subtraction"}`}
        {" · Tab between fields · Enter to submit"}
      </p>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!numInput.trim() || !denInput.trim() || feedback === "correct"}
        className="rounded-xl bg-secondary text-white font-bold py-3 px-8 hover:bg-secondary/85 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit <span className="text-xs text-white/60 ml-1">(Enter)</span>
      </button>
    </div>
  )
}

// ─── Fraction input sub-component ────────────────────────────────────────────

import { forwardRef } from "react"
import type { CheckResult as CR } from "./logic"

interface FractionInputProps {
  value: string
  onChange: (v: string) => void
  onEnter: () => void
  feedback: CR | null
  placeholder: string
}

const FractionInput = forwardRef<HTMLInputElement, FractionInputProps>(
  ({ value, onChange, onEnter, feedback, placeholder }, ref) => {
    const borderClass =
      feedback === "correct"
        ? "border-success ring-2 ring-success/25"
        : feedback === "partial"
          ? "border-warning ring-2 ring-warning/25"
          : feedback === "wrong"
            ? "border-destructive ring-2 ring-destructive/25"
            : "border-input focus:border-secondary focus:ring-2 focus:ring-secondary/25"

    return (
      <input
        ref={ref}
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); onEnter() }
        }}
        placeholder={placeholder}
        className={`w-20 rounded-xl border-2 bg-input px-3 py-3 text-center font-mono text-3xl font-black outline-none transition-all duration-150 placeholder:text-muted-foreground/30 ${borderClass}`}
        autoComplete="off"
      />
    )
  }
)
FractionInput.displayName = "FractionInput"
