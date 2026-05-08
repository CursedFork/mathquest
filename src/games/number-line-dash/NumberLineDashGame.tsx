"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import {
  generateNumberLineProblem,
  checkNumberLineAnswer,
  getNumberLineLevel,
  type NumberLineProblem,
  type NumberLineMode,
} from "./logic"
import { calculateProblemScore } from "@/utils/mathUtils"

interface NumberLineDashGameProps {
  mode?: NumberLineMode
}

export function NumberLineDashGame({ mode = "integers" }: NumberLineDashGameProps) {
  const status = useGameStore((s) => s.status)
  const streak = useGameStore((s) => s.streak)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const addScore = useGameStore((s) => s.addScore)
  const incrementStreak = useGameStore((s) => s.incrementStreak)
  const resetStreak = useGameStore((s) => s.resetStreak)
  const incrementCorrect = useGameStore((s) => s.incrementCorrect)
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)
  const { playSound } = useSoundToggle()

  const [problem, setProblem] = useState<NumberLineProblem | null>(null)
  const [input, setInput] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupCounter = useRef(0)
  const problemStart = useRef(Date.now())

  const spawnProblem = useCallback((count: number) => {
    const level = getNumberLineLevel(count)
    setProblem(generateNumberLineProblem(level, mode))
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
    const correct = checkNumberLineAnswer(input, problem)
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
  }, [problem, input, feedback, streak, addScore, incrementStreak, resetStreak,
      incrementCorrect, incrementAttempts, playSound, spawnProblem, correctAnswers])

  if (status !== "playing" || !problem) return null

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl">
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

      {/* Number line SVG */}
      <AnimatePresence mode="wait">
        <motion.div
          key={problem.value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className={`w-full rounded-2xl border-2 bg-card px-6 py-8 transition-colors duration-200 ${
            feedback === "correct" ? "border-success" : feedback === "wrong" ? "border-destructive" : "border-border"
          }`}
        >
          <NumberLineSVG problem={problem} feedback={feedback} />
          {feedback === "correct" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm font-bold text-success mt-4"
            >
              ✓ {problem.displayValue}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Input */}
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm font-medium">Value =</span>
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
          placeholder={mode === "fractions" ? "e.g. 3/4" : "?"}
          className={`w-36 rounded-xl border-2 bg-input px-4 py-3 text-center font-mono text-2xl font-black outline-none transition-all duration-150 placeholder:text-muted-foreground/30 disabled:opacity-60 ${
            feedback === "correct" ? "border-success ring-2 ring-success/25"
            : feedback === "wrong" ? "border-destructive ring-2 ring-destructive/25"
            : "border-input focus:border-primary focus:ring-2 focus:ring-primary/25"
          }`}
          autoComplete="off"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {mode === "fractions" ? "Enter as a fraction like 3/4 or a decimal" : "Type the value at the marker · Enter to submit"}
      </p>

      <button
        onClick={handleSubmit}
        disabled={!input.trim() || feedback === "correct"}
        className="rounded-xl bg-primary text-white font-bold py-3 px-8 hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit <span className="text-xs text-white/60 ml-1">(Enter)</span>
      </button>
    </div>
  )
}

// ─── Number Line SVG ─────────────────────────────────────────────────────────

function NumberLineSVG({ problem, feedback }: { problem: NumberLineProblem; feedback: "correct" | "wrong" | null }) {
  const W = 480
  const H = 90
  const PAD = 30
  const CY = 45

  const range = problem.max - problem.min
  const toX = (v: number) => PAD + ((v - problem.min) / range) * (W - PAD * 2)

  // Generate tick positions
  const ticks: number[] = []
  const step = problem.tickStep
  const start = Math.ceil(problem.min / step) * step
  for (let t = start; t <= problem.max; t += step) ticks.push(t)

  const markerX = toX(problem.value)
  const markerColor = feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : "#6366f1"

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none">
      {/* Main line */}
      <line x1={PAD} y1={CY} x2={W - PAD} y2={CY} stroke="rgb(120 120 160)" strokeWidth="2" />
      {/* Arrow heads */}
      <polygon points={`${W - PAD},${CY} ${W - PAD - 8},${CY - 5} ${W - PAD - 8},${CY + 5}`} fill="rgb(120 120 160)" />
      <polygon points={`${PAD},${CY} ${PAD + 8},${CY - 5} ${PAD + 8},${CY + 5}`} fill="rgb(120 120 160)" />

      {/* Ticks and labels */}
      {ticks.map((t) => {
        const x = toX(t)
        const isZero = t === 0
        return (
          <g key={t}>
            <line
              x1={x} y1={CY - (isZero ? 10 : 6)} x2={x} y2={CY + (isZero ? 10 : 6)}
              stroke={isZero ? "rgb(180 180 220)" : "rgb(100 100 140)"}
              strokeWidth={isZero ? 2 : 1}
            />
            <text
              x={x} y={CY + 22}
              textAnchor="middle"
              fontSize={isZero ? "13" : "11"}
              fontWeight={isZero ? "700" : "400"}
              fill="rgb(140 140 180)"
              fontFamily="monospace"
            >
              {t}
            </text>
          </g>
        )
      })}

      {/* Target marker */}
      <circle cx={markerX} cy={CY} r={10} fill={markerColor} opacity="0.25" />
      <circle cx={markerX} cy={CY} r={6} fill={markerColor} />
      {/* Question mark above */}
      <text x={markerX} y={CY - 15} textAnchor="middle" fontSize="14" fontWeight="800" fill={markerColor} fontFamily="monospace">
        ?
      </text>
    </svg>
  )
}
