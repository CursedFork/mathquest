"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { FractionFrenzyGame } from "@/games/fraction-frenzy/FractionFrenzyGame"
import { Target, ArrowRight, Layers } from "lucide-react"
import type { FractionMode } from "@/games/fraction-frenzy/logic"

const MODE_OPTIONS: { value: FractionMode; label: string; description: string }[] = [
  { value: "simplify", label: "Simplify",  description: "Reduce fractions to lowest terms" },
  { value: "add",      label: "Add",       description: "Add two fractions, then simplify" },
  { value: "subtract", label: "Subtract",  description: "Subtract two fractions, then simplify" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Target className="h-4 w-4 text-secondary" />, text: "60 seconds — answer each fraction problem correctly" },
        { icon: <ArrowRight className="h-4 w-4 text-primary" />, text: "Tab between numerator and denominator · Enter to submit" },
        { icon: <Layers className="h-4 w-4 text-accent" />, text: "Always give the fully simplified answer" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function FractionFrenzyPage() {
  const [mode, setMode] = useState<FractionMode>("simplify")

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Problem Type
      </p>
      <div className="flex flex-col gap-2">
        {MODE_OPTIONS.map(({ value, label, description }) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all ${
              mode === value
                ? "bg-secondary/15 border-secondary text-secondary"
                : "bg-muted/30 border-border text-muted-foreground hover:border-secondary/50"
            }`}
          >
            <span className="font-medium">{label}</span>
            <span className="text-xs opacity-70">{description}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <GameShell
      gameId="fraction-frenzy"
      title="Fraction Frenzy"
      description="Reduce each fraction to its simplest form. Build streaks to multiply your score!"
      icon="½"
      instructions={<Instructions />}
      configSlot={configSlot}
    >
      <FractionFrenzyGame mode={mode} />
    </GameShell>
  )
}
