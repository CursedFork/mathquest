"use client"

import { GameShell } from "@/components/game-shell/GameShell"
import { ExponentExpeditionGame } from "@/games/exponent-expedition/ExponentExpeditionGame"
import { Zap, TrendingUp, Hash } from "lucide-react"

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Zap className="h-4 w-4 text-primary" />, text: "Level 1: evaluate powers like 2³" },
        { icon: <Hash className="h-4 w-4 text-accent" />, text: "Levels 2–4: apply product, quotient, and power rules" },
        { icon: <TrendingUp className="h-4 w-4 text-secondary" />, text: "Level 5: negative exponents — x^a · x⁻ᵇ = x^?" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function ExponentExpeditionPage() {
  return (
    <GameShell gameId="exponent-expedition" title="Exponent Expedition" icon="ⁿ"
      description="Master exponent rules from basic evaluation to negative exponents — climb all 5 levels!"
      instructions={<Instructions />}>
      <ExponentExpeditionGame />
    </GameShell>
  )
}
