"use client"

import { motion, AnimatePresence } from "framer-motion"

interface FractionDisplayProps {
  numerator: number
  denominator: number
}

/** Read-only fraction rendered as a proper typeset fraction (num over bar over den). */
export function FractionDisplay({ numerator, denominator }: FractionDisplayProps) {
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
        <span className="text-6xl sm:text-7xl font-black font-mono leading-none text-foreground">
          {numerator}
        </span>
        <div className="w-full h-1 rounded-full bg-foreground" />
        <span className="text-6xl sm:text-7xl font-black font-mono leading-none text-foreground">
          {denominator}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}
