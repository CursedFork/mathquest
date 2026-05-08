"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { EquationSolverGame } from "@/games/equation-solver/EquationSolverGame"
import { Clock, TrendingUp, Variable } from "lucide-react"
import type { EquationFocus } from "@/games/equation-solver/logic"

const FOCUS_OPTIONS: { value: EquationFocus; label: string; example: string }[] = [
  { value: "mixed",  label: "Mixed",         example: "auto-scaling difficulty" },
  { value: 1,        label: "One-Step +/−",  example: "x + 5 = 12" },
  { value: 2,        label: "One-Step ×",    example: "3x = 24" },
  { value: 3,        label: "Two-Step +",    example: "2x + 4 = 10" },
  { value: 4,        label: "Two-Step −",    example: "4x − 3 = 9" },
  { value: 5,        label: "Both Sides",    example: "5x + 1 = 2x + 7" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Clock className="h-4 w-4 text-primary" />, text: "60 seconds — find the value of x in each equation" },
        { icon: <Variable className="h-4 w-4 text-accent" />, text: "Equations progress from one-step to both-sides algebra" },
        { icon: <TrendingUp className="h-4 w-4 text-secondary" />, text: "Build a streak to earn score multipliers up to ×3" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function EquationSolverPage() {
  const [focus, setFocus] = useState<EquationFocus>("mixed")

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Equation Type
      </p>
      <div className="flex flex-col gap-2">
        {FOCUS_OPTIONS.map(({ value, label, example }) => (
          <button
            key={String(value)}
            type="button"
            onClick={() => setFocus(value)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all ${
              focus === value
                ? "bg-primary/15 border-primary text-primary"
                : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            <span className="font-medium">{label}</span>
            <span className="font-mono text-xs opacity-70">{example}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <GameShell
      gameId="equation-solver"
      title="Equation Solver"
      description="Solve for x in increasingly complex equations. From simple one-step to full algebraic expressions!"
      icon="𝑥"
      instructions={<Instructions />}
      configSlot={configSlot}
    >
      <EquationSolverGame focus={focus} />
    </GameShell>
  )
}
