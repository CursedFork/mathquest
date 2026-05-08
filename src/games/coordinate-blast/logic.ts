/**
 * Coordinate Blast — pure game logic.
 */
import { generateCoordinatePoint } from "@/utils/mathUtils"

export interface CoordPoint {
  x: number
  y: number
}

export type CoordMode = "all" | "q1" | "right" | "top"

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function newTarget(mode: CoordMode = "all"): CoordPoint {
  switch (mode) {
    case "q1":
      return { x: randInt(1, 8), y: randInt(1, 8) }
    case "right":
      return { x: randInt(1, 8), y: randInt(-8, 8) }
    case "top":
      return { x: randInt(-8, 8), y: randInt(1, 8) }
    case "all":
    default:
      return generateCoordinatePoint(8)
  }
}

export function checkCoordAnswer(target: CoordPoint, xRaw: string, yRaw: string): boolean {
  const x = parseInt(xRaw.trim(), 10)
  const y = parseInt(yRaw.trim(), 10)
  return !isNaN(x) && !isNaN(y) && x === target.x && y === target.y
}

export function getQuadrant(p: CoordPoint): string {
  if (p.x > 0 && p.y > 0) return "I"
  if (p.x < 0 && p.y > 0) return "II"
  if (p.x < 0 && p.y < 0) return "III"
  if (p.x > 0 && p.y < 0) return "IV"
  return "Axis"
}

export function pointScore(attempts: number): number {
  // Fewer attempts = higher reward
  if (attempts === 1) return 15
  if (attempts === 2) return 8
  return 3
}

export const MAX_ATTEMPTS = 3
