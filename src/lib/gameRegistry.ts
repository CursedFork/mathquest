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
    comingSoon: true,
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
