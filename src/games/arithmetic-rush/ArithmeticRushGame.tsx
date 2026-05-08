"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { useScore } from "@/hooks/useScore"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import { ProblemDisplay } from "./ProblemDisplay"
import { AnswerInput } from "./AnswerInput"
import { nextProblem, checkAnswer, getDifficultyName, type MathProblem, type ArithOp } from "./logic"
import { getDifficultyLevel } from "@/utils/mathUtils"

type Feedback = "correct" | "incorrect" | null

interface ArithmeticRushGameProps {
  ops?: ArithOp[]
}

export function ArithmeticRushGame({ ops }: ArithmeticRushGameProps) {
  const status = useGameStore((s) => s.status)
  const { recordCorrect, recordIncorrect, correctAnswers, streak } = useScore()
  const { playSound } = useSoundToggle()

  const [problem, setProblem] = useState<MathProblem>(() => nextProblem(0, ops))
  const [input, setInput] = useState("")
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [scorePopup, setScorePopup] = useState<{ pts: number; id: number } | null>(null)
  const [prevDifficulty, setPrevDifficulty] = useState(1)

  const inputRef = useRef<HTMLInputElement>(null)
  const problemStartRef = useRef<number>(Date.now())
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupCounter = useRef(0)

  const currentLevel = getDifficultyLevel(correctAnswers)

  // Auto-focus input when game is playing
  useEffect(() => {
    if (status === "playing") {
      inputRef.current?.focus()
      spawnProblem(correctAnswers)
    }
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Detect level-up
  useEffect(() => {
    if (currentLevel > prevDifficulty && status === "playing") {
      playSound("levelup")
      setPrevDifficulty(currentLevel)
    }
  }, [currentLevel, prevDifficulty, status, playSound])

  const spawnProblem = useCallback(
    (count: number) => {
      setProblem(nextProblem(count, ops))
      setInput("")
      setFeedback(null)
      problemStartRef.current = Date.now()
      requestAnimationFrame(() => inputRef.current?.focus())
    },
    [ops]
  )

  const handleSubmit = useCallback(() => {
    if (!input.trim() || feedback === "correct") return

    const elapsed = Date.now() - problemStartRef.current
    const isCorrect = checkAnswer(problem, input)

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)

    if (isCorrect) {
      const pts = recordCorrect(elapsed)
      if (streak >= 4) playSound("streak")
      else playSound("correct")

      setFeedback("correct")
      setScorePopup({ pts, id: ++popupCounter.current })

      feedbackTimerRef.current = setTimeout(() => {
        spawnProblem(correctAnswers + 1)
      }, 280)
    } else {
      recordIncorrect()
      playSound("incorrect")
      setFeedback("incorrect")
      setInput("")
      feedbackTimerRef.current = setTimeout(() => {
        setFeedback(null)
        inputRef.current?.focus()
      }, 450)
    }
  }, [input, feedback, problem, streak, recordCorrect, recordIncorrect, playSound, spawnProblem, correctAnswers])

  if (status !== "playing") return null

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      {/* Level badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Level</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentLevel}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full bg-primary/15 border border-primary/30 px-3 py-0.5 text-xs font-bold text-primary"
          >
            {currentLevel} — {getDifficultyName(currentLevel as 1 | 2 | 3 | 4 | 5)}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Score pop-up */}
      <div className="relative h-6">
        <AnimatePresence>
          {scorePopup && (
            <motion.div
              key={scorePopup.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -28 }}
              exit={{}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationComplete={() => setScorePopup(null)}
              className="absolute left-1/2 -translate-x-1/2 text-success font-bold text-lg whitespace-nowrap"
            >
              +{scorePopup.pts}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Problem */}
      <ProblemDisplay problem={problem} feedback={feedback} />

      {/* Input */}
      <AnswerInput
        ref={inputRef}
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        feedback={feedback}
        disabled={feedback === "correct"}
      />

      {/* Streak ring indicator */}
      {streak > 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <span>Streak:</span>
          <div className="flex gap-1">
            {[...Array(Math.min(streak, 10))].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-accent"
                style={{ opacity: 0.4 + i * 0.06 }}
              />
            ))}
            {streak > 10 && <span className="text-xs text-accent font-bold">+{streak - 10}</span>}
          </div>
        </motion.div>
      )}
    </div>
  )
}
