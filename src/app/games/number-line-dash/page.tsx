"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { NumberLineDashGame } from "@/games/number-line-dash/NumberLineDashGame"
import { Minus, Hash, Percent } from "lucide-react"
import type { NumberLineMode } from "@/games/number-line-dash/logic"

const MODE_OPTIONS: { value: NumberLineMode; label: string; description: string }[] = [
  { value: "integers", label: "Integers",  description: "Whole numbers, positive & negative" },
  { value: "decimals", label: "Decimals",  description: "Tenths and hundredths" },
  { value: "fractions", label: "Fractions", description: "Halves, thirds, quarters, and more" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Minus className="h-4 w-4 text-primary" />, text: "A point appears on the number line — type its value" },
        { icon: <Hash className="h-4 w-4 text-accent" />, text: "For fractions, enter as 3/4 or as a decimal" },
        { icon: <Percent className="h-4 w-4 text-secondary" />, text: "Difficulty auto-scales as you get more correct" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function NumberLineDashPage() {
  const [mode, setMode] = useState<NumberLineMode>("integers")

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Number Type</p>
      <div className="flex flex-col gap-2">
        {MODE_OPTIONS.map(({ value, label, description }) => (
          <button key={value} type="button" onClick={() => setMode(value)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all ${
              mode === value ? "bg-primary/15 border-primary text-primary" : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
            }`}>
            <span className="font-medium">{label}</span>
            <span className="text-xs opacity-70">{description}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <GameShell gameId="number-line-dash" title="Number Line Dash" icon="↔"
      description="A point lights up on the number line. Type its value before time runs out!"
      instructions={<Instructions />} configSlot={configSlot}>
      <NumberLineDashGame mode={mode} />
    </GameShell>
  )
}
