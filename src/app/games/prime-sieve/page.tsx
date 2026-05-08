"use client"

import { GameShell } from "@/components/game-shell/GameShell"
import { PrimeSieveGame } from "@/games/prime-sieve/PrimeSieveGame"
import { Zap, Keyboard, TrendingUp } from "lucide-react"

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Zap className="h-4 w-4 text-primary" />, text: "A number appears — decide if it's Prime or Composite" },
        { icon: <Keyboard className="h-4 w-4 text-accent" />, text: "Click the buttons or press P / C on your keyboard" },
        { icon: <TrendingUp className="h-4 w-4 text-secondary" />, text: "Numbers get larger as your score increases" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function PrimeSievePage() {
  return (
    <GameShell gameId="prime-sieve" title="Prime Sieve" icon="π"
      description="Prime or composite? Sort numbers as fast as you can — the clock is ticking!"
      instructions={<Instructions />}>
      <PrimeSieveGame />
    </GameShell>
  )
}
