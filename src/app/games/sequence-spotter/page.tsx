"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { SequenceSpotterGame } from "@/games/sequence-spotter/SequenceSpotterGame"
import { TrendingUp, X, Shuffle } from "lucide-react"
import type { SequenceMode } from "@/games/sequence-spotter/logic"

const MODE_OPTIONS: { value: SequenceMode; label: string; description: string }[] = [
  { value: "mixed",      label: "Mixed",      description: "Arithmetic and geometric sequences" },
  { value: "arithmetic", label: "Arithmetic", description: "Add or subtract a constant each term" },
  { value: "geometric",  label: "Geometric",  description: "Multiply by a constant each term" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <TrendingUp className="h-4 w-4 text-primary" />, text: "A sequence is shown — type the next term" },
        { icon: <X className="h-4 w-4 text-accent" />, text: "Arithmetic: add/subtract a fixed amount each step" },
        { icon: <Shuffle className="h-4 w-4 text-secondary" />, text: "Geometric: multiply by a fixed ratio each step" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function SequenceSpotterPage() {
  const [mode, setMode] = useState<SequenceMode>("mixed")

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sequence Type</p>
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
    <GameShell gameId="sequence-spotter" title="Sequence Spotter" icon="…"
      description="Spot the pattern in each number sequence and predict the next term!"
      instructions={<Instructions />} configSlot={configSlot}>
      <SequenceSpotterGame mode={mode} />
    </GameShell>
  )
}
