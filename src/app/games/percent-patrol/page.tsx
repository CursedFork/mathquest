"use client"

import { useState } from "react"
import { GameShell } from "@/components/game-shell/GameShell"
import { PercentPatrolGame } from "@/games/percent-patrol/PercentPatrolGame"
import { RefreshCw, Hash, Calculator } from "lucide-react"
import type { PercentMode } from "@/games/percent-patrol/logic"

const MODE_OPTIONS: { value: PercentMode; label: string; description: string }[] = [
  { value: "to-decimal",    label: "% → Decimal",  description: "Convert a percent to a decimal" },
  { value: "to-percent",    label: "Decimal → %",  description: "Convert a decimal to a percent" },
  { value: "find-percent",  label: "Find the Amount", description: "Calculate X% of a number" },
]

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <RefreshCw className="h-4 w-4 text-primary" />, text: "Convert between percents, decimals, and amounts" },
        { icon: <Hash className="h-4 w-4 text-accent" />, text: "Type just the number — no % symbol needed" },
        { icon: <Calculator className="h-4 w-4 text-secondary" />, text: "Starts with common percents, gets trickier over time" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function PercentPatrolPage() {
  const [mode, setMode] = useState<PercentMode>("to-decimal")

  const configSlot = (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Problem Type</p>
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
    <GameShell gameId="percent-patrol" title="Percent Patrol" icon="%"
      description="Convert between percents, decimals, and calculated amounts against the clock!"
      instructions={<Instructions />} configSlot={configSlot}>
      <PercentPatrolGame mode={mode} />
    </GameShell>
  )
}
