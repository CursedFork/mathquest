"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import {
  generatePrimeProblem,
  getPrimeLevel,
  getPrimeLevelName,
  getSmallFacts,
  type PrimeProblem,
} from "./logic"
import { calculateProblemScore } from "@/utils/mathUtils"

export function PrimeSieveGame() {
  const status = useGameStore((s) => s.status)
  const streak = useGameStore((s) => s.streak)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const addScore = useGameStore((s) => s.addScore)
  const incrementStreak = useGameStore((s) => s.incrementStreak)
  const resetStreak = useGameStore((s) => s.resetStreak)
  const incrementCorrect = useGameStore((s) => s.incrementCorrect)
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)
  const { playSound } = useSoundToggle()

  const [problem, setProblem] = useState<PrimeProblem | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [fact, setFact] = useState("")

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupCounter = useRef(0)
  const problemStart = useRef(Date.now())

  const spawnProblem = useCallback((count: number) => {
    const level = getPrimeLevel(count)
    setCurrentLevel(level)
    setProblem(generatePrimeProblem(level))
    setFeedback(null)
    setFact("")
    problemStart.current = Date.now()
  }, [])

  useEffect(() => {
    if (status === "playing") spawnProblem(0)
  }, [status, spawnProblem])

  // keyboard shortcut: P = prime, C = composite
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (feedback || status !== "playing" || !problem) return
      if (e.key === "p" || e.key === "P") handleGuess(true)
      if (e.key === "c" || e.key === "C") handleGuess(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }) // re-attaches each render so handler closes over latest state

  const handleGuess = useCallback((guessedPrime: boolean) => {
    if (!problem || feedback) return
    const elapsed = Date.now() - problemStart.current
    const correct = guessedPrime === problem.isPrime
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
      setFact(getSmallFacts(problem.number))
      setScorePopup({ pts, id: ++popupCounter.current })
      timerRef.current = setTimeout(() => spawnProblem(correctAnswers + 1), 900)
    } else {
      resetStreak()
      incrementAttempts()
      playSound("incorrect")
      setFeedback("wrong")
      setFact(getSmallFacts(problem.number))
      timerRef.current = setTimeout(() => spawnProblem(correctAnswers), 1200)
    }
  }, [problem, feedback, streak, addScore, incrementStreak, resetStreak,
      incrementCorrect, incrementAttempts, playSound, spawnProblem, correctAnswers])

  if (status !== "playing" || !problem) return null

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      {/* Level badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Level</span>
        <span className="rounded-full bg-accent/15 border border-accent/30 px-3 py-0.5 text-xs font-bold text-accent">
          {currentLevel} — {getPrimeLevelName(currentLevel)}
        </span>
      </div>

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

      {/* Number display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={problem.number}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`w-full rounded-3xl border-2 bg-card px-8 py-10 text-center transition-colors ${
            feedback === "correct" ? "border-success" : feedback === "wrong" ? "border-destructive" : "border-border"
          }`}
        >
          <p className="font-mono text-8xl font-black text-foreground">{problem.number}</p>
          <AnimatePresence>
            {fact && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-sm font-medium ${feedback === "correct" ? "text-success" : "text-destructive"}`}>
                {fact}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Choice buttons */}
      <div className="flex gap-4 w-full">
        <motion.button
          onClick={() => handleGuess(true)}
          disabled={!!feedback}
          whileHover={{ scale: feedback ? 1 : 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex-1 rounded-2xl border-2 border-success/40 bg-success/10 text-success font-black text-xl py-6 hover:bg-success/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prime
          <span className="block text-xs font-normal text-success/60 mt-1">(P)</span>
        </motion.button>
        <motion.button
          onClick={() => handleGuess(false)}
          disabled={!!feedback}
          whileHover={{ scale: feedback ? 1 : 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex-1 rounded-2xl border-2 border-destructive/40 bg-destructive/10 text-destructive font-black text-xl py-6 hover:bg-destructive/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Composite
          <span className="block text-xs font-normal text-destructive/60 mt-1">(C)</span>
        </motion.button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Is the number prime or composite? · Press P or C on keyboard
      </p>
    </div>
  )
}
