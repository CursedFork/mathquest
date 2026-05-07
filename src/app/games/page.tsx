"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getAllGames } from "@/lib/gameRegistry"

export default function GamesPage() {
  const games = getAllGames()
  const available = games.filter((g) => !g.comingSoon)
  const coming = games.filter((g) => g.comingSoon)

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">🎮 Game Library</Badge>
        <h1 className="text-4xl sm:text-5xl font-black mb-3">
          All <span className="text-gradient">Games</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg">
          Each game is a math concept from your classroom — turned into something students actually
          want to replay.
        </p>
      </motion.div>

      {/* Available games */}
      <section className="mb-14">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">
          Play Now
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {available.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={game.path} className="group block h-full">
                <div className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:border-primary/50 group-hover:-translate-y-1 group-hover:shadow-glow-primary">
                  {/* Banner */}
                  <div
                    className="h-32 flex items-center justify-center text-5xl relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${game.gradientFrom}30, ${game.gradientTo}30)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `linear-gradient(135deg, ${game.gradientFrom}, ${game.gradientTo})`,
                      }}
                    />
                    <span className="relative z-10">{game.icon}</span>
                    {game.isNew && (
                      <div className="absolute top-3 right-3 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                        NEW
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-xl">{game.title}</h3>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-0.5 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                      {game.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="muted" className="text-xs">{game.gradeRange}</Badge>
                      {game.subjects.slice(0, 3).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      {coming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Coming Soon
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {coming.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + i * 0.08 }}
              >
                <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-55">
                  <div
                    className="h-32 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${game.gradientFrom}15, ${game.gradientTo}15)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                      <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-semibold text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        Coming Soon
                      </div>
                    </div>
                    <span className="text-5xl">{game.icon}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2">{game.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {game.description}
                    </p>
                    <Badge variant="muted" className="text-xs">{game.gradeRange}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
