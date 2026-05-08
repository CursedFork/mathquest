"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { CoordinateBlastGame } from "@/games/coordinate-blast/CoordinateBlastGame"
import { Target, RefreshCw, Map } from "lucide-react"
import type { CoordMode } from "@/games/coordinate-blast/logic"

const MODE_OPTIONS: { value: CoordMode; label: string; description: string }[] = [
  { value: "all",   label: "All Quadrants", description: "Full grid — positive & negative" },
  { value: "q1",    label: "Q1 — Positive", description: "x > 0 and y > 0 only" },
  { value: "right", label: "Right Half",    description: "x > 0, any y  (Q1 + Q4)" },
  { value: "top",   label: "Top Half",      description: "y > 0, any x  (Q1 + Q2)" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Target className="h-4 w-4 text-primary" />, text: "A glowing point appears on the coordinate plane" },
        { icon: <Map className="h-4 w-4 text-accent" />, text: "Type the X and Y coordinates, then press Blast!" },
        { icon: <RefreshCw className="h-4 w-4 text-secondary" />, text: "3 attempts per point — fewer tries = higher score" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function CoordinateBlastPage() {
  const [mode, setMode] = useState<CoordMode>("all")

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Quadrant Mode
      </p>
      <div className="flex flex-col gap-2">
        {MODE_OPTIONS.map(({ value, label, description }) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all ${
              mode === value
                ? "bg-primary/15 border-primary text-primary"
                : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
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
      gameId="coordinate-blast"
      title="Coordinate Blast"
      description="A point lights up on the coordinate plane. Identify its (x, y) location before time runs out!"
      icon="🎯"
      instructions={<Instructions />}
      configSlot={configSlot}
    >
      <CoordinateBlastGame mode={mode} />
    </GameShell>
  )
}
