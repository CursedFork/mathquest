"use client"

import { motion } from "framer-motion"
import { MousePointerClick, Trophy, TrendingUp } from "lucide-react"

const STEPS = [
  {
    icon: MousePointerClick,
    number: "01",
    title: "Choose a Game",
    description:
      "Pick from our growing library of math mini-games, each built around a real classroom concept.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: Trophy,
    number: "02",
    title: "Practice & Score",
    description:
      "Answer problems, build combo streaks, and earn XP. The faster and more accurate you are, the higher you score.",
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Beat Your Best",
    description:
      "Track accuracy, streaks, and top scores. Replay games to improve — each session adapts to your skill level.",
    color: "text-secondary",
    bg: "bg-secondary/10 border-secondary/20",
  },
]

const TEACHER_PERKS = [
  "No accounts needed — just share a link",
  "Covers 2nd through 8th grade standards",
  "Works on phones, tablets, and laptops",
  "Difficulty scales automatically",
  "Great for sub plans and early finishers",
  "Free — no ads, no paywalls",
]

export function HowItWorks() {
  return (
    <>
      {/* How it Works */}
      <section className="py-24 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              How it <span className="text-gradient">works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              From zero to game in three steps — no sign-up required.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="text-center"
                >
                  <div className="relative inline-flex mb-5">
                    <div
                      className={`rounded-2xl border p-5 ${step.bg}`}
                    >
                      <Icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* For Teachers */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-5">
                🍎 For Teachers &amp; Substitute Teachers
              </div>
              <h2 className="text-4xl font-black mb-4">
                Your worksheets,{" "}
                <span className="text-gradient-accent">gamified</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                MathQuest is built on a simple philosophy: any drill worksheet can become a
                replayable game. Students practice the same skills — they just actually want to do
                it. Perfect for sub plans, early finishers, or math centers.
              </p>
              <p className="text-sm text-muted-foreground/70 italic">
                Classroom management &amp; teacher dashboards coming soon.
              </p>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {TEACHER_PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-success/15 border border-success/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-success text-xs">✓</span>
                  </div>
                  <span className="text-foreground">{perk}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>
    </>
  )
}
