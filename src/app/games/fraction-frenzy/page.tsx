import type { Metadata } from "next"
import { GameShell } from "@/components/game-shell/GameShell"
import { FractionFrenzyGame } from "@/games/fraction-frenzy/FractionFrenzyGame"
import { Target, ArrowRight, Layers } from "lucide-react"

export const metadata: Metadata = {
  title: "Fraction Frenzy",
  description: "Simplify fractions to their lowest terms as fast as you can!",
}

function Instructions() {
  const tips = [
    { icon: <Target className="h-4 w-4 text-secondary" />, text: "60 seconds — simplify each fraction to its lowest terms" },
    { icon: <ArrowRight className="h-4 w-4 text-primary" />, text: "Tab between numerator and denominator · Enter to submit" },
    { icon: <Layers className="h-4 w-4 text-accent" />, text: "Difficulty increases automatically as you get more correct" },
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

export default function FractionFrenzyPage() {
  return (
    <GameShell
      gameId="fraction-frenzy"
      title="Fraction Frenzy"
      description="Reduce each fraction to its simplest form. Build streaks to multiply your score!"
      icon="½"
      instructions={<Instructions />}
    >
      <FractionFrenzyGame />
    </GameShell>
  )
}
