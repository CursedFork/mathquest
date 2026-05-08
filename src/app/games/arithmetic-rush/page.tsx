"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { ArithmeticRushGame } from "@/games/arithmetic-rush/ArithmeticRushGame"
import { Clock, Zap, TrendingUp } from "lucide-react"
import type { ArithOp } from "@/games/arithmetic-rush/logic"

const ALL_OPS: ArithOp[] = ["add", "sub", "mul", "div"]

const OP_META: { value: ArithOp; label: string; symbol: string }[] = [
  { value: "add", label: "Addition", symbol: "+" },
  { value: "sub", label: "Subtraction", symbol: "−" },
  { value: "mul", label: "Multiply", symbol: "×" },
  { value: "div", label: "Division", symbol: "÷" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Clock className="h-4 w-4 text-primary" />, text: "60 seconds — answer as many problems as you can" },
        { icon: <Zap className="h-4 w-4 text-accent" />, text: "Build a streak for score multipliers: ×1.5, ×2, ×3" },
        { icon: <TrendingUp className="h-4 w-4 text-secondary" />, text: "Difficulty increases every few correct answers" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function ArithmeticRushPage() {
  // null = mixed (all ops, original behavior); ArithOp[] = filtered set
  const [selectedOps, setSelectedOps] = useState<ArithOp[] | null>(null)

  const toggle = (op: ArithOp) => {
    if (selectedOps === null) {
      // switching from Mixed → single op
      setSelectedOps([op])
    } else if (selectedOps.includes(op)) {
      const next = selectedOps.filter((o) => o !== op)
      // if removing last one, go back to mixed
      setSelectedOps(next.length === 0 ? null : next)
    } else {
      setSelectedOps([...selectedOps, op])
    }
  }

  const isMixed = selectedOps === null
  const isOpActive = (op: ArithOp) => selectedOps?.includes(op) ?? false

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Operations
      </p>
      <div className="flex flex-wrap gap-2">
        {/* Mixed pill */}
        <button
          type="button"
          onClick={() => setSelectedOps(null)}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition-all ${
            isMixed
              ? "bg-primary/20 border-primary text-primary"
              : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          Mixed
        </button>
        {OP_META.map(({ value, label, symbol }) => (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-all ${
              isOpActive(value)
                ? "bg-primary/20 border-primary text-primary"
                : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            <span className="font-mono mr-1">{symbol}</span>{label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <GameShell
      gameId="arithmetic-rush"
      title="Arithmetic Rush"
      description="Solve as many problems as you can in 60 seconds. Build combo streaks for massive bonus points!"
      icon="⚡"
      instructions={<Instructions />}
      configSlot={configSlot}
    >
      <ArithmeticRushGame ops={selectedOps ?? ALL_OPS} />
    </GameShell>
  )
}
