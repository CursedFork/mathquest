import type { Metadata } from "next"
import { GameShell } from "@/components/game-shell/GameShell"
import { ArithmeticRushGame } from "@/games/arithmetic-rush/ArithmeticRushGame"
import { Clock, Zap, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Arithmetic Rush",
  description: "Solve arithmetic problems as fast as you can. Build streaks and earn XP!",
}

function Instructions() {
  const tips = [
    { icon: <Clock className="h-4 w-4 text-primary" />, text: "60 seconds — answer as many problems as you can" },
    { icon: <Zap className="h-4 w-4 text-accent" />, text: "Build a streak for score multipliers: ×1.5, ×2, ×3" },
    { icon: <TrendingUp className="h-4 w-4 text-secondary" />, text: "Difficulty increases every few correct answers" },
  ]

  return (
    <div className="space-y-2">
      {tips.map((tip, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
          {tip.icon}
          <span className="text-muted-foreground">{tip.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function ArithmeticRushPage() {
  return (
    <GameShell
      gameId="arithmetic-rush"
      title="Arithmetic Rush"
      description="Solve as many problems as you can in 60 seconds. Build combo streaks for massive bonus points!"
      icon="⚡"
      instructions={<Instructions />}
    >
      <ArithmeticRushGame />
    </GameShell>
  )
}
