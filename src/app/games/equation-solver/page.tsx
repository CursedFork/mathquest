import type { Metadata } from "next"
import { GameShell } from "@/components/game-shell/GameShell"
import { EquationSolverGame } from "@/games/equation-solver/EquationSolverGame"
import { Clock, TrendingUp, Variable } from "lucide-react"

export const metadata: Metadata = {
  title: "Equation Solver",
  description: "Solve linear equations for x, from one-step to both-sides algebra!",
}

function Instructions() {
  const tips = [
    { icon: <Clock className="h-4 w-4 text-primary" />, text: "60 seconds — find the value of x in each equation" },
    { icon: <Variable className="h-4 w-4 text-accent" />, text: "Equations progress from one-step to both-sides algebra" },
    { icon: <TrendingUp className="h-4 w-4 text-secondary" />, text: "Build a streak to earn score multipliers up to ×3" },
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

export default function EquationSolverPage() {
  return (
    <GameShell
      gameId="equation-solver"
      title="Equation Solver"
      description="Solve for x in increasingly complex equations. From simple one-step to full algebraic expressions!"
      icon="𝑥"
      instructions={<Instructions />}
    >
      <EquationSolverGame />
    </GameShell>
  )
}
