"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import {
  generateFactorProblem,
  getFactorLevel,
  isValidFactor,
  scoreFactorRound,
  type FactorProblem,
} from "./logic"

export function FactorFactoryGame() {
  const status = useGameStore((s) => s.status)
  const streak = useGameStore((s) => s.streak)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const addScore = useGameStore((s) => s.addScore)
  const incrementStreak = useGameStore((s) => s.incrementStreak)
  const resetStreak = useGameStore((s) => s.resetStreak)
  const incrementCorrect = useGameStore((s) => s.incrementCorrect)
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)
  const { playSound } = useSoundToggle()

  const [problem, setProblem] = useState<FactorProblem | null>(null)
  const [collected, setCollected] = useState<number[]>([])
  const [input, setInput] = useState("")
  const [inputFeedback, setInputFeedback] = useState<"ok" | "bad" | "dup" | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupCounter = useRef(0)

  const spawnProblem = useCallback((count: number) => {
    const level = getFactorLevel(count)
    setProblem(generateFactorProblem(level))
    setCollected([])
    setInput("")
    setInputFeedback(null)
    setSubmitted(false)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  useEffect(() => {
    if (status === "playing") spawnProblem(0)
  }, [status, spawnProblem])

  const addFactor = useCallback(() => {
    if (!problem || submitted || !input.trim()) return
    const result = isValidFactor(input, problem)
    if (result === "invalid" || result === "not-factor") {
      setInputFeedback("bad")
      playSound("incorrect")
      setInput("")
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setInputFeedback(null), 600)
      return
    }
    const n = parseInt(input.trim(), 10)
    if (collected.includes(n)) {
      setInputFeedback("dup")
      setInput("")
      timerRef.current = setTimeout(() => setInputFeedback(null), 500)
      return
    }
    setInputFeedback("ok")
    setCollected((prev) => [...prev, n].sort((a, b) => a - b))
    setInput("")
    timerRef.current = setTimeout(() => setInputFeedback(null), 300)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [problem, submitted, input, collected, playSound])

  const handleDone = useCallback(() => {
    if (!problem || submitted) return
    setSubmitted(true)

    const pts = scoreFactorRound(collected, problem.allFactors, streak)
    const allFound = problem.allFactors.every((f) => collected.includes(f))

    if (allFound) {
      addScore(pts)
      incrementStreak()
      incrementCorrect()
      if (streak >= 4) playSound("streak")
      else playSound("correct")
    } else {
      resetStreak()
      if (pts > 0) addScore(pts) // partial credit
      playSound("incorrect")
    }
    incrementAttempts()
    setScorePopup({ pts, id: ++popupCounter.current })

    timerRef.current = setTimeout(() => spawnProblem(correctAnswers + (allFound ? 1 : 0)), 1800)
  }, [problem, submitted, collected, streak, addScore, incrementStreak, resetStreak,
      incrementCorrect, incrementAttempts, playSound, spawnProblem, correctAnswers])

  if (status !== "playing" || !problem) return null

  const allFound = submitted && problem.allFactors.every((f) => collected.includes(f))
  const missing = submitted ? problem.allFactors.filter((f) => !collected.includes(f)) : []

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
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

      {/* Target number */}
      <div className={`w-full rounded-2xl border-2 bg-card px-8 py-6 text-center transition-colors ${
        submitted ? (allFound ? "border-success" : "border-destructive") : "border-border"
      }`}>
        <p className="text-xs text-muted-foreground mb-1">Find all factors of</p>
        <p className="font-mono text-7xl font-black text-foreground">{problem.number}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {problem.allFactors.length} factor{problem.allFactors.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Collected factors */}
      <div className="w-full min-h-[60px] rounded-xl border border-border bg-muted/20 px-4 py-3 flex flex-wrap gap-2">
        <AnimatePresence>
          {collected.map((f) => (
            <motion.span
              key={f}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-full px-3 py-1 text-sm font-bold font-mono ${
                submitted && !problem.allFactors.includes(f)
                  ? "bg-destructive/20 text-destructive border border-destructive/40"
                  : "bg-primary/20 text-primary border border-primary/40"
              }`}
            >
              {f}
            </motion.span>
          ))}
        </AnimatePresence>
        {collected.length === 0 && (
          <span className="text-xs text-muted-foreground/50 self-center">Factors will appear here…</span>
        )}
      </div>

      {/* Missing factors revealed after submit */}
      <AnimatePresence>
        {submitted && missing.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2"
          >
            <p className="text-xs text-destructive font-medium mb-1">Missed:</p>
            <div className="flex flex-wrap gap-1.5">
              {missing.map((f) => (
                <span key={f} className="rounded-full bg-destructive/20 border border-destructive/40 px-2 py-0.5 text-xs font-mono font-bold text-destructive">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback hint */}
      <AnimatePresence mode="wait">
        {inputFeedback === "bad" && (
          <motion.p key="bad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs text-destructive font-medium">
            Not a factor of {problem.number}
          </motion.p>
        )}
        {inputFeedback === "dup" && (
          <motion.p key="dup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs text-warning font-medium">
            Already found!
          </motion.p>
        )}
        {inputFeedback === "ok" && (
          <motion.p key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs text-success font-medium">
            ✓ Factor added
          </motion.p>
        )}
        {!inputFeedback && !submitted && <div key="empty" className="h-4" />}
      </AnimatePresence>

      {/* Input + buttons */}
      {!submitted && (
        <div className="flex gap-3 w-full">
          <motion.input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFactor() } }}
            animate={inputFeedback === "bad" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
            placeholder="factor…"
            className="flex-1 rounded-xl border-2 bg-input px-4 py-3 text-center font-mono text-xl font-bold outline-none transition-all border-input focus:border-primary focus:ring-2 focus:ring-primary/25 placeholder:text-muted-foreground/30"
            autoComplete="off"
          />
          <button
            onClick={addFactor}
            disabled={!input.trim()}
            className="rounded-xl bg-primary/20 text-primary border border-primary/40 font-bold px-4 py-3 hover:bg-primary/30 active:scale-95 transition-all disabled:opacity-40"
          >
            Add
          </button>
          <button
            onClick={handleDone}
            className="rounded-xl bg-primary text-white font-bold px-4 py-3 hover:bg-primary/85 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Type each factor · press Add or Enter · press Done when finished
      </p>
    </div>
  )
}
