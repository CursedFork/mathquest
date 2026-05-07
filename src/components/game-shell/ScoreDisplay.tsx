"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { formatScore, formatAccuracy } from "@/utils/formatters"
import { getStreakMultiplier } from "@/utils/mathUtils"

export function ScoreDisplay() {
  const score = useGameStore((s) => s.score)
  const correctAnswers = useGameStore((s) => s.correctAnswers)
  const totalAttempts = useGameStore((s) => s.totalAttempts)
  const streak = useGameStore((s) => s.streak)
  const multiplier = getStreakMultiplier(streak)

  return (
    <div className="flex items-center gap-6">
      {/* Score */}
      <div className="text-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={score}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-mono text-2xl font-black text-accent tabular-nums leading-none"
          >
            {formatScore(score)}
          </motion.div>
        </AnimatePresence>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
          Score
        </div>
      </div>

      {/* Accuracy */}
      <div className="text-center hidden sm:block">
        <div className="font-mono text-xl font-bold text-foreground leading-none">
          {formatAccuracy(correctAnswers, totalAttempts)}
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
          Accuracy
        </div>
      </div>

      {/* Multiplier pill */}
      {multiplier > 1 && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-full bg-accent/15 border border-accent/30 px-2.5 py-1 text-xs font-bold text-accent"
        >
          ×{multiplier}
        </motion.div>
      )}
    </div>
  )
}
