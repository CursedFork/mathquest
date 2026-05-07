/**
 * Coordinate Blast — pure game logic.
 */
import { generateCoordinatePoint } from "@/utils/mathUtils"

export interface CoordPoint {
  x: number
  y: number
}

export function newTarget(max = 8): CoordPoint {
  return generateCoordinatePoint(max)
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
