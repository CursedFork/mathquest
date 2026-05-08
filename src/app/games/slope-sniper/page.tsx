"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { SlopeSniperGame } from "@/games/slope-sniper/SlopeSniperGame"
import { TrendingUp, Minus, TrendingDown } from "lucide-react"
import type { SlopeMode } from "@/games/slope-sniper/logic"

const MODE_OPTIONS: { value: SlopeMode; label: string; description: string }[] = [
  { value: "all",      label: "All Slopes",     description: "Positive, negative, and zero" },
  { value: "positive", label: "Positive Only",  description: "Slope is always > 0" },
  { value: "negative", label: "Negative Only",  description: "Slope is always < 0" },
  { value: "zero",     label: "Zero Slope",     description: "Horizontal lines only" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <TrendingUp className="h-4 w-4 text-primary" />, text: "Two points are shown — calculate the slope between them" },
        { icon: <Minus className="h-4 w-4 text-accent" />, text: "Enter slope as a fraction (3/2) or decimal (1.5)" },
        { icon: <TrendingDown className="h-4 w-4 text-secondary" />, text: "Negative slopes: use a minus sign, e.g. -2/3" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function SlopeSniperPage() {
  const [mode, setMode] = useState<SlopeMode>("all")

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Slope Type</p>
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
    <GameShell gameId="slope-sniper" title="Slope Sniper" icon="∕"
      description="Two points appear — calculate the slope between them as fast as you can!"
      instructions={<Instructions />} configSlot={configSlot}>
      <SlopeSniperGame mode={mode} />
    </GameShell>
  )
}
