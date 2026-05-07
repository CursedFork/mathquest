"use client"

import { useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { useGameStore } from "@/store/gameStore"
import { useGameTimer } from "@/hooks/useGameTimer"
import { useSoundToggle } from "@/hooks/useSoundToggle"
import { StartScreen } from "./StartScreen"
import { ResultsScreen } from "./ResultsScreen"
import { Timer } from "./Timer"
import { ScoreDisplay } from "./ScoreDisplay"
import { StreakBanner } from "./StreakBanner"

interface GameShellProps {
  gameId: string
  title: string
  description: string
  icon: string
  instructions?: React.ReactNode
  children: React.ReactNode
}

/**
 * GameShell is the stateful wrapper every game lives inside.
 *
 * Rendering contract:
 *   idle     → StartScreen
 *   playing  → HUD + children (the game UI)
 *   finished → ResultsScreen
 *
 * Games only need to render their core interaction UI. All state
 * management (timer, score, streak) flows through the game store.
 */
export function GameShell({
  gameId,
  title,
  description,
  icon,
  instructions,
  children,
}: GameShellProps) {
  const status = useGameStore((s) => s.status)
  const result = useGameStore((s) => s.result)
  const startGame = useGameStore((s) => s.startGame)
  const resetGame = useGameStore((s) => s.resetGame)

  // Manages countdown interval; must live at shell level (not inside game children)
  useGameTimer()

  const { soundEnabled, toggleSound } = useSoundToggle()

  // Clean state on mount/unmount so navigating between games never leaks state
  useEffect(() => {
    resetGame()
    return () => {
      resetGame()
    }
  }, [gameId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "idle") {
    return (
      <StartScreen
        title={title}
        description={description}
        icon={icon}
        instructions={instructions}
        onStart={() => startGame()}
      />
    )
  }

  if (status === "finished" && result) {
    return (
      <ResultsScreen
        result={result}
        onPlayAgain={() => {
          resetGame()
          setTimeout(() => startGame(), 50)
        }}
      />
    )
  }

  // Playing state
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* HUD */}
      <div className="border-b border-border/40 bg-card/60 backdrop-blur-sm px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4 max-w-3xl">
          <Timer />
          <StreakBanner />
          <div className="flex items-center gap-4">
            <ScoreDisplay />
            <button
              onClick={toggleSound}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center p-4">{children}</div>
    </div>
  )
}
