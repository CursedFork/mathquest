"use client"

import { GameShell } from "@/components/game-shell/GameShell"
import { ProportionPuzzleGame } from "@/games/proportion-puzzle/ProportionPuzzleGame"
import { Equal, TrendingUp, Hash } from "lucide-react"

function Instructions() {
  return (
    <div className="space-y-2">
      {[
        { icon: <Equal className="h-4 w-4 text-primary" />, text: "Two equivalent fractions are shown with one missing value" },
        { icon: <Hash className="h-4 w-4 text-accent" />, text: "Find the missing number to make the proportion true" },
        { icon: <TrendingUp className="h-4 w-4 text-secondary" />, text: "Hint: cross-multiply to solve (a × d = b × c)" },
      ].map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function ProportionPuzzlePage() {
  return (
    <GameShell gameId="proportion-puzzle" title="Proportion Puzzle" icon="∝"
      description="Solve for the missing value in each equivalent fraction pair!"
      instructions={<Instructions />}>
      <ProportionPuzzleGame />
    </GameShell>
  )
}
