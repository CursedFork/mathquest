"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useStreak } from "@/hooks/useStreak"

export function StreakBanner() {
  const { streakLabel, streak } = useStreak()

  return (
    <AnimatePresence>
      {streakLabel && (
        <motion.div
          key={streak}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center"
        >
          <span className="rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-xs font-bold text-accent">
            {streakLabel}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
