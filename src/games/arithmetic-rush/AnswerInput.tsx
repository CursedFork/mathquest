"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnswerInputProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  feedback: "correct" | "incorrect" | null
  disabled?: boolean
}

export const AnswerInput = forwardRef<HTMLInputElement, AnswerInputProps>(
  ({ value, onChange, onSubmit, feedback, disabled }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        onSubmit()
      }
    }

    const borderClass =
      feedback === "correct"
        ? "border-success ring-success/30 ring-2"
        : feedback === "incorrect"
          ? "border-destructive ring-destructive/30 ring-2"
          : "border-input focus-within:border-primary focus-within:ring-primary/30 focus-within:ring-2"

    return (
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <motion.input
          ref={ref}
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Answer"
          className={cn(
            "w-full rounded-xl bg-input px-6 py-4 text-center font-mono text-3xl font-black",
            "placeholder:text-muted-foreground/40 text-foreground",
            "border-2 outline-none transition-all duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            borderClass
          )}
          animate={feedback === "incorrect" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.35 }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <button
          onClick={onSubmit}
          disabled={disabled || !value}
          className="rounded-lg bg-primary/15 border border-primary/30 px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit <span className="text-xs text-primary/60 ml-1">(Enter)</span>
        </button>
      </div>
    )
  }
)
AnswerInput.displayName = "AnswerInput"
