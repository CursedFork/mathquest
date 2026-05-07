import type { Metadata } from "next"
import { GameShell } from "@/components/game-shell/GameShell"
import { CoordinateBlastGame } from "@/games/coordinate-blast/CoordinateBlastGame"
import { Target, RefreshCw, Map } from "lucide-react"

export const metadata: Metadata = {
  title: "Coordinate Blast",
  description: "Identify points on a coordinate plane before time runs out!",
}

function Instructions() {
  const tips = [
    { icon: <Target className="h-4 w-4 text-primary" />, text: "A glowing point appears on the coordinate plane" },
    { icon: <Map className="h-4 w-4 text-accent" />, text: "Type the X and Y coordinates, then press Blast!" },
    { icon: <RefreshCw className="h-4 w-4 text-secondary" />, text: "3 attempts per point — fewer tries = higher score" },
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

export default function CoordinateBlastPage() {
  return (
    <GameShell
      gameId="coordinate-blast"
      title="Coordinate Blast"
      description="A point lights up on the coordinate plane. Identify its (x, y) location before time runs out!"
      icon="🎯"
      instructions={<Instructions />}
    >
      <CoordinateBlastGame />
    </GameShell>
  )
}
