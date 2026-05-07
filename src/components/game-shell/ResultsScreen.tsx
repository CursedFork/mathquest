"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { RotateCcw, LayoutGrid, Zap, Target, Flame, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameResult } from "@/types/game"
import { formatScore, formatTime, getScoreGrade } from "@/utils/formatters"

interface ResultsScreenProps {
  result: GameResult
  onPlayAgain: () => void
}

export function ResultsScreen({ result, onPlayAgain }: ResultsScreenProps) {
  const grade = getScoreGrade(result.accuracy)

  const stats = [
    { icon: <Zap className="h-4 w-4 text-accent" />, label: "Score", value: formatScore(result.score) },
    { icon: <Target className="h-4 w-4 text-primary" />, label: "Accuracy", value: `${result.accuracy}%` },
    { icon: <LayoutGrid className="h-4 w-4 text-secondary" />, label: "Problems", value: `${result.correctAnswers} / ${result.totalProblems}` },
    { icon: <Flame className="h-4 w-4 text-orange-400" />, label: "Best Streak", value: `×${result.longestStreak}` },
    { icon: <Clock className="h-4 w-4 text-muted-foreground" />, label: "Time Used", value: formatTime(result.timeTaken) },
    { icon: <span className="text-yellow-400 text-sm font-bold">XP</span>, label: "XP Earned", value: `+${formatScore(result.xpEarned)}` },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
          {/* Grade */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex"
          >
            <div
              className={`text-8xl font-black mb-2 ${grade.color}`}
              style={{ textShadow: "0 0 30px currentColor" }}
            >
              {grade.grade}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-2xl font-black mb-1">{grade.label}</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Keep playing to improve your score!
            </p>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="rounded-xl bg-muted/40 border border-border/50 p-3 text-left"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {s.icon}
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <div className="font-bold text-lg font-mono">{s.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3"
          >
            <Button variant="outline" className="flex-1" onClick={onPlayAgain}>
              <RotateCcw className="h-4 w-4" />
              Play Again
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/games">
                <LayoutGrid className="h-4 w-4" />
                All Games
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
