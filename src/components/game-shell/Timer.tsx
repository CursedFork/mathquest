"use client"

import { motion } from "framer-motion"
import { useGameStore } from "@/store/gameStore"
import { cn } from "@/lib/utils"

export function Timer() {
  const timeRemaining = useGameStore((s) => s.timeRemaining)
  const config = useGameStore((s) => s.config)
  const pct = (timeRemaining / config.duration) * 100

  const isUrgent = timeRemaining <= 10
  const isCritical = timeRemaining <= 5

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        key={timeRemaining}
        initial={isUrgent ? { scale: 1.2 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "font-mono text-3xl font-black tabular-nums leading-none",
          isCritical
            ? "text-destructive"
            : isUrgent
              ? "text-warning"
              : "text-foreground"
        )}
      >
        {timeRemaining}
      </motion.div>

      {/* Progress arc / bar */}
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full origin-left",
            isCritical ? "bg-destructive" : isUrgent ? "bg-warning" : "bg-primary"
          )}
          style={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Time</div>
    </div>
  )
}
