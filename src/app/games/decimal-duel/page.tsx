"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { DecimalDuelGame } from "@/games/decimal-duel/DecimalDuelGame"
import { ArrowLeftRight, Plus, Minus } from "lucide-react"
import type { DecimalMode } from "@/games/decimal-duel/logic"

const MODE_OPTIONS: { value: DecimalMode; label: string; description: string }[] = [
  { value: "compare",  label: "Compare",  description: "Pick the greater decimal" },
  { value: "add",      label: "Add",      description: "Add two decimals" },
  { value: "subtract", label: "Subtract", description: "Subtract two decimals" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <ArrowLeftRight className="h-4 w-4 text-primary" />, text: "Compare mode: click the greater of two decimals" },
        { icon: <Plus className="h-4 w-4 text-accent" />, text: "Compute modes: type the exact decimal answer" },
        { icon: <Minus className="h-4 w-4 text-secondary" />, text: "Difficulty increases as you answer correctly" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function DecimalDuelPage() {
  const [mode, setMode] = useState<DecimalMode>("compare")

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Mode</p>
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
    <GameShell gameId="decimal-duel" title="Decimal Duel" icon="·"
      description="Race the clock comparing and computing with decimals!"
      instructions={<Instructions />} configSlot={configSlot}>
      <DecimalDuelGame mode={mode} />
    </GameShell>
  )
}
