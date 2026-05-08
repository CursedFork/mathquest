import type { GameDefinition } from "@/types/game"

/**
 * Central game registry — add new games here and they auto-populate
 * the game library, routing metadata, and featured sections.
 */
export const GAME_REGISTRY: GameDefinition[] = [
  {
    id: "arithmetic-rush",
    title: "Arithmetic Rush",
    description:
      "Solve as many math problems as you can in 60 seconds. Build combo streaks for bonus points!",
    difficulty: ["easy", "medium", "hard"],
    subjects: ["Addition", "Subtraction", "Multiplication", "Division"],
    gradeRange: "2nd – 8th Grade",
    tags: ["arithmetic", "speed", "streak", "timed"],
    path: "/games/arithmetic-rush",
    gradientFrom: "#6366f1",
    gradientTo: "#ec4899",
    icon: "⚡",
    isNew: true,
  },
  {
    id: "coordinate-blast",
    title: "Coordinate Blast",
    description:
      "Target points appear on the coordinate plane. Identify their (x, y) coordinates before time runs out!",
    difficulty: ["easy", "medium"],
    subjects: ["Coordinate Plane", "Ordered Pairs", "Graphing"],
    gradeRange: "5th – 8th Grade",
    tags: ["coordinates", "graphing", "geometry"],
    path: "/games/coordinate-blast",
    gradientFrom: "#10b981",
    gradientTo: "#06b6d4",
    icon: "🎯",
  },
  {
    id: "fraction-frenzy",
    title: "Fraction Frenzy",
    description:
      "Simplify fractions, compare values, and solve fraction equations in this fast-paced challenge.",
    difficulty: ["medium", "hard"],
    subjects: ["Fractions", "Simplification", "Comparison"],
    gradeRange: "4th – 7th Grade",
    tags: ["fractions", "comparison", "simplification"],
    path: "/games/fraction-frenzy",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    icon: "½",
  },
  {
    id: "equation-solver",
    title: "Equation Solver",
    description:
      "Solve for x in increasingly complex algebraic equations. From linear to multi-step!",
    difficulty: ["medium", "hard"],
    subjects: ["Algebra", "Linear Equations", "Variables"],
    gradeRange: "6th – 9th Grade",
    tags: ["algebra", "equations", "variables"],
    path: "/games/equation-solver",
    gradientFrom: "#8b5cf6",
    gradientTo: "#3b82f6",
    icon: "𝑥",
  },

  // ── Elementary / Middle School ──────────────────────────────────────────────

  {
    id: "number-line-dash",
    title: "Number Line Dash",
    description:
      "A point appears on the number line — name its value! Covers integers, decimals, and fractions.",
    difficulty: ["easy", "medium"],
    subjects: ["Number Line", "Integers", "Decimals", "Fractions"],
    gradeRange: "3rd – 7th Grade",
    tags: ["number line", "integers", "decimals", "fractions"],
    path: "/games/number-line-dash",
    gradientFrom: "#06b6d4",
    gradientTo: "#3b82f6",
    icon: "↔",
    isNew: true,
  },
  {
    id: "factor-factory",
    title: "Factor Factory",
    description:
      "List every factor of a given number before time runs out. Partial credit keeps things fair!",
    difficulty: ["easy", "medium", "hard"],
    subjects: ["Factors", "Divisibility", "Number Theory"],
    gradeRange: "4th – 7th Grade",
    tags: ["factors", "divisibility", "number theory"],
    path: "/games/factor-factory",
    gradientFrom: "#10b981",
    gradientTo: "#6366f1",
    icon: "⚙",
    isNew: true,
  },
  {
    id: "decimal-duel",
    title: "Decimal Duel",
    description:
      "Compare, add, and subtract decimals at speed. Three modes from simple comparison to computation.",
    difficulty: ["easy", "medium", "hard"],
    subjects: ["Decimals", "Comparison", "Arithmetic"],
    gradeRange: "4th – 7th Grade",
    tags: ["decimals", "comparison", "arithmetic"],
    path: "/games/decimal-duel",
    gradientFrom: "#f59e0b",
    gradientTo: "#10b981",
    icon: "·",
    isNew: true,
  },
  {
    id: "percent-patrol",
    title: "Percent Patrol",
    description:
      "Convert between percents, decimals, and calculated amounts. Essential real-world math skills!",
    difficulty: ["easy", "medium", "hard"],
    subjects: ["Percents", "Decimals", "Conversion"],
    gradeRange: "5th – 8th Grade",
    tags: ["percent", "decimal", "conversion"],
    path: "/games/percent-patrol",
    gradientFrom: "#ec4899",
    gradientTo: "#8b5cf6",
    icon: "%",
    isNew: true,
  },
  {
    id: "prime-sieve",
    title: "Prime Sieve",
    description:
      "Is it prime or composite? Sort numbers as fast as you can. Numbers get bigger as you level up!",
    difficulty: ["easy", "medium", "hard"],
    subjects: ["Prime Numbers", "Composites", "Number Theory"],
    gradeRange: "4th – 8th Grade",
    tags: ["prime", "composite", "number theory"],
    path: "/games/prime-sieve",
    gradientFrom: "#6366f1",
    gradientTo: "#ec4899",
    icon: "π",
    isNew: true,
  },

  // ── Middle / High School ────────────────────────────────────────────────────

  {
    id: "exponent-expedition",
    title: "Exponent Expedition",
    description:
      "Climb 5 levels of exponent rules — from basic evaluation through product, quotient, and power rules.",
    difficulty: ["medium", "hard"],
    subjects: ["Exponents", "Algebra", "Laws of Exponents"],
    gradeRange: "6th – 9th Grade",
    tags: ["exponents", "algebra", "rules"],
    path: "/games/exponent-expedition",
    gradientFrom: "#8b5cf6",
    gradientTo: "#06b6d4",
    icon: "ⁿ",
    isNew: true,
  },
  {
    id: "slope-sniper",
    title: "Slope Sniper",
    description:
      "Two points appear — calculate the slope between them. Enter as a fraction or decimal.",
    difficulty: ["medium", "hard"],
    subjects: ["Slope", "Linear Functions", "Algebra"],
    gradeRange: "7th – 10th Grade",
    tags: ["slope", "linear", "algebra", "graphing"],
    path: "/games/slope-sniper",
    gradientFrom: "#ef4444",
    gradientTo: "#f59e0b",
    icon: "∕",
    isNew: true,
  },

  // ── Harder / Advanced ───────────────────────────────────────────────────────

  {
    id: "sequence-spotter",
    title: "Sequence Spotter",
    description:
      "Spot the pattern in arithmetic and geometric sequences, then predict the next term.",
    difficulty: ["medium", "hard"],
    subjects: ["Sequences", "Patterns", "Algebra"],
    gradeRange: "6th – 10th Grade",
    tags: ["sequences", "patterns", "arithmetic", "geometric"],
    path: "/games/sequence-spotter",
    gradientFrom: "#10b981",
    gradientTo: "#f59e0b",
    icon: "…",
    isNew: true,
  },
  {
    id: "proportion-puzzle",
    title: "Proportion Puzzle",
    description:
      "Solve for the missing value in equivalent fraction pairs. Cross-multiply your way to the top!",
    difficulty: ["medium", "hard"],
    subjects: ["Proportions", "Ratios", "Algebra"],
    gradeRange: "6th – 9th Grade",
    tags: ["proportion", "ratio", "algebra"],
    path: "/games/proportion-puzzle",
    gradientFrom: "#3b82f6",
    gradientTo: "#10b981",
    icon: "∝",
    isNew: true,
  },

  // ── Coming Soon ─────────────────────────────────────────────────────────────

  {
    id: "polygon-perimeter",
    title: "Polygon Perimeter",
    description:
      "A polygon appears with labeled sides — calculate its perimeter, then area at higher levels.",
    difficulty: ["easy", "medium"],
    subjects: ["Geometry", "Perimeter", "Area"],
    gradeRange: "4th – 8th Grade",
    tags: ["geometry", "perimeter", "area"],
    path: "/games/polygon-perimeter",
    gradientFrom: "#10b981",
    gradientTo: "#3b82f6",
    icon: "⬡",
    comingSoon: true,
  },
  {
    id: "inequality-gauntlet",
    title: "Inequality Gauntlet",
    description:
      "Solve inequalities for x and identify the correct solution on a number line.",
    difficulty: ["medium", "hard"],
    subjects: ["Inequalities", "Algebra", "Number Line"],
    gradeRange: "7th – 10th Grade",
    tags: ["inequalities", "algebra", "number line"],
    path: "/games/inequality-gauntlet",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    icon: "<",
    comingSoon: true,
  },
  {
    id: "system-shooter",
    title: "System Shooter",
    description:
      "Two lines are graphed — identify their intersection point to solve the system of equations.",
    difficulty: ["hard"],
    subjects: ["Systems of Equations", "Graphing", "Algebra"],
    gradeRange: "8th – 10th Grade",
    tags: ["systems", "algebra", "graphing"],
    path: "/games/system-shooter",
    gradientFrom: "#3b82f6",
    gradientTo: "#8b5cf6",
    icon: "∩",
    comingSoon: true,
  },
  {
    id: "quadratic-quest",
    title: "Quadratic Quest",
    description:
      "Factor and solve quadratic equations. From perfect-square trinomials to the full quadratic formula.",
    difficulty: ["hard"],
    subjects: ["Quadratics", "Factoring", "Algebra"],
    gradeRange: "8th – 11th Grade",
    tags: ["quadratics", "factoring", "algebra"],
    path: "/games/quadratic-quest",
    gradientFrom: "#8b5cf6",
    gradientTo: "#ef4444",
    icon: "x²",
    comingSoon: true,
  },
  {
    id: "triangle-trig",
    title: "Triangle Trig",
    description:
      "Use sine, cosine, and tangent to find missing sides and angles in right triangles.",
    difficulty: ["hard"],
    subjects: ["Trigonometry", "Right Triangles", "Geometry"],
    gradeRange: "9th – 12th Grade",
    tags: ["trigonometry", "triangles", "geometry"],
    path: "/games/triangle-trig",
    gradientFrom: "#ef4444",
    gradientTo: "#f59e0b",
    icon: "△",
    comingSoon: true,
  },
]

export function getGame(id: string): GameDefinition | undefined {
  return GAME_REGISTRY.find((g) => g.id === id)
}

export function getAvailableGames(): GameDefinition[] {
  return GAME_REGISTRY.filter((g) => !g.comingSoon)
}

export function getAllGames(): GameDefinition[] {
  return GAME_REGISTRY
}
