"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Clock, Keyboard, Volume2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StartScreenProps {
  title: string
  description: string
  icon: string
  instructions?: React.ReactNode
  configSlot?: React.ReactNode
  onStart: () => void
}

export function StartScreen({ title, description, icon, instructions, configSlot, onStart }: StartScreenProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Back */}
        <Link
          href="/games"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All Games
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          {/* Icon */}
          <div className="text-6xl mb-5 text-center">{icon}</div>

          <h1 className="text-3xl font-black text-center mb-2">{title}</h1>
          <p className="text-muted-foreground text-center text-sm mb-6 leading-relaxed">
            {description}
          </p>

          {/* Default tips */}
          {!instructions && (
            <div className="space-y-2 mb-6">
              <Tip icon={<Clock className="h-4 w-4 text-primary" />} text="60 second rounds — answer as many as you can" />
              <Tip icon={<Keyboard className="h-4 w-4 text-primary" />} text="Type your answer and press Enter to submit" />
              <Tip icon={<Volume2 className="h-4 w-4 text-primary" />} text="Sound effects play for correct and wrong answers" />
            </div>
          )}

          {/* Custom instructions from the game */}
          {instructions && <div className="mb-6">{instructions}</div>}

          {/* Per-game config (ops filter, mode selector, etc.) */}
          {configSlot && (
            <div className="mb-6 rounded-xl border border-border/60 bg-muted/20 p-4">
              {configSlot}
            </div>
          )}

          <Button size="xl" className="w-full" onClick={onStart}>
            Start Game
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function Tip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
      {icon}
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}
