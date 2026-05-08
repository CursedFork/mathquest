"use client"

import { motion, AnimatePresence } from "framer-motion"

interface FractionDisplayProps {
  numerator: number
  denominator: number
  compact?: boolean
}

/** Read-only fraction rendered as a proper typeset fraction (num over bar over den). */
export function FractionDisplay({ numerator, denominator, compact = false }: FractionDisplayProps) {
  const size = compact ? "text-4xl sm:text-5xl" : "text-6xl sm:text-7xl"
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${numerator}/${denominator}`}
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center gap-1 select-none"
      >
        <span className={`${size} font-black font-mono leading-none text-foreground`}>
          {numerator}
        </span>
        <div className="w-full h-1 rounded-full bg-foreground" />
        <span className={`${size} font-black font-mono leading-none text-foreground`}>
          {denominator}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}
