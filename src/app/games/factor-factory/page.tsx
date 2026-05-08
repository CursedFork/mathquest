"use client"

import { GameShell } from "@/components/game-shell/GameShell"
import { FactorFactoryGame } from "@/games/factor-factory/FactorFactoryGame"
import { Hash, CheckSquare, TrendingUp } from "lucide-react"

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Hash className="h-4 w-4 text-primary" />, text: "Type each factor of the number and press Add" },
        { icon: <CheckSquare className="h-4 w-4 text-accent" />, text: "Press Done when you think you have found all of them" },
        { icon: <TrendingUp className="h-4 w-4 text-secondary" />, text: "Partial credit awarded — find as many as you can!" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function FactorFactoryPage() {
  return (
    <GameShell gameId="factor-factory" title="Factor Factory" icon="⚙"
      description="List every factor of the given number. Find them all for maximum points!"
      instructions={<Instructions />}>
      <FactorFactoryGame />
    </GameShell>
  )
}
