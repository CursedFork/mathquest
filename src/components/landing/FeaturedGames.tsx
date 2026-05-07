"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllGames } from "@/lib/gameRegistry"

export function FeaturedGames() {
  const games = getAllGames()

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
            🎮 Game Library
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Pick your <span className="text-gradient">challenge</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every game is a worksheet concept turned into a replayable experience. New games added
            regularly.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div
                className={`group relative rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col transition-all duration-300 ${
                  game.comingSoon ? "opacity-60" : "hover:border-primary/50 hover:-translate-y-1 hover:shadow-glow-primary"
                }`}
              >
                {/* Gradient thumbnail */}
                <div
                  className="h-36 flex items-center justify-center text-5xl relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${game.gradientFrom}25, ${game.gradientTo}25)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `linear-gradient(135deg, ${game.gradientFrom}, ${game.gradientTo})`,
                    }}
                  />
                  <span className="relative z-10 drop-shadow-lg text-6xl">{game.icon}</span>
                  {game.isNew && (
                    <div className="absolute top-3 right-3 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                      NEW
                    </div>
                  )}
                  {game.comingSoon && (
                    <div className="absolute inset-0 flex items-end justify-center pb-3 bg-background/30 backdrop-blur-sm">
                      <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex-1 leading-relaxed">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge variant="muted" className="text-xs">
                      {game.gradeRange}
                    </Badge>
                    {Array.isArray(game.difficulty)
                      ? game.difficulty.slice(0, 2).map((d) => (
                          <Badge key={d} variant="outline" className="text-xs capitalize">
                            {d}
                          </Badge>
                        ))
                      : (
                        <Badge variant="outline" className="text-xs capitalize">
                          {game.difficulty}
                        </Badge>
                      )}
                  </div>

                  {!game.comingSoon ? (
                    <Button className="w-full" asChild size="sm">
                      <Link href={game.path}>
                        Play Now <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" size="sm" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
