"use client"

import { AnimatePresence, motion } from "framer-motion"
import type { MathProblem } from "./logic"
import { formatOperation } from "@/utils/mathUtils"

interface ProblemDisplayProps {
  problem: MathProblem
  feedback: "correct" | "incorrect" | null
}

export function ProblemDisplay({ problem, feedback }: ProblemDisplayProps) {
  const borderColor =
    feedback === "correct"
      ? "border-success shadow-glow-success"
      : feedback === "incorrect"
        ? "border-destructive shadow-glow-destructive"
        : "border-border"

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${problem.num1}-${problem.operation}-${problem.num2}`}
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: feedback === "incorrect" ? [0, -8, 8, -6, 6, 0] : 0,
        }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={
          feedback === "incorrect"
            ? { x: { duration: 0.35, ease: "easeInOut" } }
            : { duration: 0.2, ease: "easeOut" }
        }
        className={`rounded-2xl border-2 bg-card px-10 py-8 text-center transition-colors duration-200 ${borderColor}`}
      >
        <div className="flex items-center justify-center gap-3 font-mono">
          <span className="text-5xl sm:text-6xl font-black text-foreground">
            {problem.num1}
          </span>
          <span className="text-4xl sm:text-5xl font-bold text-primary">
            {formatOperation(problem.operation)}
          </span>
          <span className="text-5xl sm:text-6xl font-black text-foreground">
            {problem.num2}
          </span>
          <span className="text-4xl sm:text-5xl font-bold text-muted-foreground">=</span>
          <span className="text-5xl sm:text-6xl font-black text-muted-foreground/40">?</span>
        </div>

        {/* Feedback flash */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-sm font-bold ${
              feedback === "correct" ? "text-success" : "text-destructive"
            }`}
          >
            {feedback === "correct" ? "✓ Correct!" : "✗ Try again"}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
