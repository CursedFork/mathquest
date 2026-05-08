"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useScore } from "@/hooks/useScore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import { CoordinatePlane } from "./CoordinatePlane"
import { newTarget, checkCoordAnswer, getQuadrant, MAX_ATTEMPTS, type CoordPoint, type CoordMode } from "./logic"

type Feedback = "correct" | "wrong" | null

interface CoordinateBlastGameProps {
  mode?: CoordMode
}

export function CoordinateBlastGame({ mode = "all" }: CoordinateBlastGameProps) {
  const status = useGameStore((s) => s.status)
  const { recordCorrect, recordIncorrect, correctAnswers } = useScore()
  const { playSound } = useSoundToggle()

  const [target, setTarget] = useState<CoordPoint | null>(null)
  const [xInput, setXInput] = useState("")
  const [yInput, setYInput] = useState("")
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [attempts, setAttempts] = useState(0)
  const [showAnswer, setShowAnswer] = useState<CoordPoint | null>(null)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const xRef = useRef<HTMLInputElement>(null)
  const yRef = useRef<HTMLInputElement>(null)
  const popupCounter = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const problemStart = useRef(Date.now())

  const spawnTarget = useCallback(() => {
    setTarget(newTarget(mode))
    setXInput("")
    setYInput("")
    setFeedback(null)
    setAttempts(0)
    setShowAnswer(null)
    setFeedbackMessage(null)
    problemStart.current = Date.now()
    requestAnimationFrame(() => xRef.current?.focus())
  }, [mode])

  useEffect(() => {
    if (status === "playing") {
      spawnTarget()
    }
  }, [status, spawnTarget])

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const handleSubmit = useCallback(() => {
    if (!target || feedback === "correct") return
    if (!xInput.trim() || !yInput.trim()) {
      xRef.current?.focus()
      return
    }

    const elapsed = Date.now() - problemStart.current
    const correct = checkCoordAnswer(target, xInput, yInput)
    const newAttempts = attempts + 1

    clearTimer()

    if (correct) {
      const pts = recordCorrect(elapsed)
      playSound("correct")
      setFeedback("correct")
      setFeedbackMessage(`✓ Correct! (${target.x}, ${target.y}) — Quadrant ${getQuadrant(target)}`)
      setScorePopup({ pts, id: ++popupCounter.current })

      timerRef.current = setTimeout(spawnTarget, 700)
    } else {
      recordIncorrect()
      playSound("incorrect")
      setAttempts(newAttempts)

      if (newAttempts >= MAX_ATTEMPTS) {
        // Reveal answer and move on
        setFeedback("wrong")
        setShowAnswer(target)
        setFeedbackMessage(`Answer was (${target.x}, ${target.y}) — Quadrant ${getQuadrant(target)}`)
        timerRef.current = setTimeout(spawnTarget, 2000)
      } else {
        setFeedback("wrong")
        setFeedbackMessage(
          `Not quite. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts === 1 ? "" : "s"} left.`
        )
        setXInput("")
        setYInput("")
        timerRef.current = setTimeout(() => {
          setFeedback(null)
          setFeedbackMessage(null)
          xRef.current?.focus()
        }, 600)
      }
    }
  }, [target, feedback, xInput, yInput, attempts, recordCorrect, recordIncorrect, playSound, spawnTarget])

  if (status !== "playing") return null

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl">
      {/* Coordinate Plane — flex-1 + min-w-0 so it claims available flex space */}
      <div className="relative flex-1 min-w-0 w-full flex justify-center">
        <CoordinatePlane target={target} feedback={feedback} showAnswer={showAnswer} />

        {/* Score popup */}
        <AnimatePresence>
          {scorePopup && (
            <motion.div
              key={scorePopup.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -32 }}
              exit={{}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onAnimationComplete={() => setScorePopup(null)}
              className="absolute top-4 left-1/2 -translate-x-1/2 text-success font-black text-2xl pointer-events-none"
            >
              +{scorePopup.pts}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls panel — fixed width on desktop so plane gets all remaining space */}
      <div className="flex flex-col items-center gap-5 w-full lg:w-80 lg:flex-shrink-0">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Find the point</div>
          <div className="text-lg font-bold text-primary">
            ({target ? "?" : "—"}, {target ? "?" : "—"})
          </div>
        </div>

        {/* Coordinate inputs */}
        <div className="flex gap-3 items-end w-full">
          <CoordInput
            ref={xRef}
            label="X"
            value={xInput}
            onChange={setXInput}
            onEnter={() => yRef.current?.focus()}
            feedback={feedback}
          />
          <div className="text-2xl font-bold text-muted-foreground mb-3">,</div>
          <CoordInput
            ref={yRef}
            label="Y"
            value={yInput}
            onChange={setYInput}
            onEnter={handleSubmit}
            feedback={feedback}
          />
        </div>

        {/* Attempts indicator */}
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-colors ${
                i < attempts ? "bg-destructive" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Feedback message */}
        <AnimatePresence mode="wait">
          {feedbackMessage && (
            <motion.p
              key={feedbackMessage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm text-center font-medium ${
                feedback === "correct" ? "text-success" : "text-destructive"
              }`}
            >
              {feedbackMessage}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={handleSubmit}
          disabled={!xInput.trim() || !yInput.trim() || feedback === "correct"}
          className="w-full rounded-xl bg-primary text-white font-bold py-3 px-6 hover:bg-primary/85 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Blast! <span className="text-xs text-white/60 ml-1">(Enter)</span>
        </button>

        <p className="text-xs text-muted-foreground text-center">
          {correctAnswers} point{correctAnswers !== 1 ? "s" : ""} identified
        </p>
      </div>
    </div>
  )
}

// ─── Sub-component ─────────────────────────────────────────────────────────────

import { forwardRef } from "react"

interface CoordInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  onEnter: () => void
  feedback: Feedback
}

const CoordInput = forwardRef<HTMLInputElement, CoordInputProps>(
  ({ label, value, onChange, onEnter, feedback }, ref) => {
    const isNegative = value.startsWith("-")

    const toggleSign = () => {
      if (!value || value === "-") {
        onChange(isNegative ? "" : "-")
      } else {
        onChange(isNegative ? value.slice(1) : "-" + value)
      }
    }

    const handleChange = (raw: string) => {
      // Allow only an optional leading minus followed by digits
      const cleaned = raw.replace(/[^0-9-]/g, "").replace(/(?!^)-/g, "")
      onChange(cleaned)
    }

    const borderClass =
      feedback === "correct"
        ? "border-success ring-2 ring-success/25"
        : feedback === "wrong"
          ? "border-destructive ring-2 ring-destructive/25"
          : "border-input focus:border-primary focus:ring-2 focus:ring-primary/25"

    return (
      <div className="flex flex-col items-center gap-1 flex-1">
        <label className="text-xs text-muted-foreground font-medium">{label}</label>
        <div className="flex gap-1.5 w-full items-stretch">
          {/* ± toggle — visible on all screen sizes, essential on mobile */}
          <button
            type="button"
            onClick={toggleSign}
            tabIndex={-1}
            aria-label="Toggle negative"
            className={`rounded-xl border-2 px-2 font-mono text-xl font-black transition-all duration-150 select-none ${
              isNegative
                ? "border-primary bg-primary/15 text-primary"
                : "border-input bg-input text-muted-foreground hover:border-primary/50"
            }`}
          >
            −
          </button>
          <motion.input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                onEnter()
              }
            }}
            animate={feedback === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.35 }}
            className={`w-full rounded-xl border-2 bg-input px-3 py-3 text-center font-mono text-2xl font-black outline-none transition-all duration-150 placeholder:text-muted-foreground/30 ${borderClass}`}
            placeholder="0"
            autoComplete="off"
          />
        </div>
      </div>
    )
  }
)
CoordInput.displayName = "CoordInput"
