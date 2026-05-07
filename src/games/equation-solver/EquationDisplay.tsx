"use client"

import { motion, AnimatePresence } from "framer-motion"

interface EquationDisplayProps {
  display: string
  feedback: "correct" | "wrong" | null
}

export function EquationDisplay({ display, feedback }: EquationDisplayProps) {
  const borderColor =
    feedback === "correct"
      ? "border-success shadow-glow-success"
      : feedback === "wrong"
        ? "border-destructive shadow-glow-destructive"
        : "border-border"

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={display}
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: feedback === "wrong" ? [0, -8, 8, -5, 5, 0] : 0,
        }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={
          feedback === "wrong"
            ? { x: { duration: 0.35 } }
            : { duration: 0.22, ease: "easeOut" }
        }
        className={`rounded-2xl border-2 bg-card px-10 py-8 text-center transition-colors duration-200 ${borderColor}`}
      >
        <div className="font-mono text-4xl sm:text-5xl font-black text-foreground tracking-wide">
          {display}
        </div>
        {feedback === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm font-bold text-success"
          >
            ✓ Correct!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
