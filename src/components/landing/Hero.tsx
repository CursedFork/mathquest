"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Gamepad2, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const FLOAT_SYMBOLS = [
  { symbol: "+", x: "8%", y: "20%", delay: 0, size: "text-3xl" },
  { symbol: "×", x: "88%", y: "15%", delay: 0.4, size: "text-4xl" },
  { symbol: "÷", x: "75%", y: "70%", delay: 0.8, size: "text-3xl" },
  { symbol: "=", x: "15%", y: "72%", delay: 1.2, size: "text-4xl" },
  { symbol: "π", x: "50%", y: "10%", delay: 0.6, size: "text-2xl" },
  { symbol: "√", x: "93%", y: "50%", delay: 1.0, size: "text-3xl" },
  { symbol: "−", x: "3%", y: "50%", delay: 0.2, size: "text-4xl" },
  { symbol: "%", x: "60%", y: "82%", delay: 1.4, size: "text-2xl" },
]

const PREVIEW_PROBLEMS = [
  { problem: "7 × 8 =", answer: "56", correct: true },
  { problem: "144 ÷ 12 =", answer: "12", correct: true },
  { problem: "23 + 49 =", answer: "72", correct: true },
]

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(99,102,241) 0%, transparent 70%)" }}
      />

      {/* Floating math symbols */}
      {FLOAT_SYMBOLS.map(({ symbol, x, y, delay, size }) => (
        <motion.div
          key={`${symbol}-${x}`}
          className={`absolute font-mono font-bold text-primary/20 select-none pointer-events-none ${size}`}
          style={{ left: x, top: y }}
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 3 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {symbol}
        </motion.div>
      ))}

      <div className="container mx-auto px-4 sm:px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — headline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6"
            >
              <Zap className="h-3.5 w-3.5" />
              Now in beta — free for students &amp; teachers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              Math practice that{" "}
              <span className="text-gradient">doesn&apos;t feel</span>{" "}
              like work.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
            >
              Turn ordinary worksheets into addictive arcade-style games. Build streaks, earn XP,
              and actually enjoy practicing math — for students grades 2 through 8.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button size="xl" asChild>
                <Link href="/games">
                  <Gamepad2 className="h-5 w-5" />
                  Play Now — It&apos;s Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/games">Browse Games</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <span>Loved by students &amp; teachers</span>
              <span className="text-border">·</span>
              <span>No account required</span>
            </motion.div>
          </div>

          {/* Right — game preview card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Glow behind card */}
              <div className="absolute inset-0 rounded-2xl blur-2xl bg-primary/20 scale-95" />

              {/* Preview card */}
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
                {/* HUD bar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-mono text-muted-foreground">LIVE</span>
                  </div>
                  <div className="rounded-lg bg-destructive/15 px-3 py-1 text-sm font-bold font-mono text-destructive">
                    0:32
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">SCORE</div>
                    <div className="text-sm font-bold text-accent">1,840</div>
                  </div>
                </div>

                {/* Streak badge */}
                <div className="mb-4 flex justify-center">
                  <span className="rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-xs font-bold text-accent">
                    🔥 COMBO ×8 — 3× multiplier!
                  </span>
                </div>

                {/* Current problem */}
                <div className="rounded-xl bg-muted/40 p-5 text-center mb-4">
                  <div className="text-4xl font-black font-mono mb-1 text-foreground">
                    9 × 7 = ?
                  </div>
                  <div className="text-xs text-muted-foreground">Type your answer</div>
                </div>

                {/* Answer input mock */}
                <div className="rounded-lg border-2 border-primary bg-input px-4 py-3 text-center font-mono text-xl font-bold text-primary">
                  63<span className="animate-pulse">|</span>
                </div>

                {/* Recent problems */}
                <div className="mt-4 space-y-1.5">
                  {PREVIEW_PROBLEMS.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-success/10 border border-success/20"
                    >
                      <span className="text-sm font-mono text-muted-foreground">{p.problem}</span>
                      <span className="text-sm font-bold text-success">✓ {p.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
