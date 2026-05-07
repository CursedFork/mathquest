"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { CoordPoint } from "./logic"

// SVG uses centered coordinate system:
// viewBox="-200 -200 400 400" — origin at center
// Each math unit = UNIT pixels
const UNIT = 18
const RANGE = 10
const LABEL_EVERY = 2 // label every 2nd gridline to avoid crowding

interface CoordinatePlaneProps {
  target: CoordPoint | null
  feedback: "correct" | "wrong" | null
  showAnswer?: CoordPoint | null
}

function toSvg(mathX: number, mathY: number): [number, number] {
  return [mathX * UNIT, -mathY * UNIT]
}

const HALF = RANGE * UNIT // 180

export function CoordinatePlane({ target, feedback, showAnswer }: CoordinatePlaneProps) {
  const gridLines = Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE)

  return (
    <svg
      viewBox={`${-HALF - 22} ${-HALF - 22} ${(HALF + 22) * 2} ${(HALF + 22) * 2}`}
      className="w-full max-w-[360px] select-none"
      aria-label="Coordinate plane"
    >
      {/* Grid lines */}
      {gridLines.map((k) => (
        <g key={k}>
          {/* Vertical */}
          <line
            x1={k * UNIT}
            y1={-HALF}
            x2={k * UNIT}
            y2={HALF}
            stroke="rgb(50 50 90)"
            strokeWidth={k === 0 ? 1.5 : 0.5}
          />
          {/* Horizontal */}
          <line
            x1={-HALF}
            y1={k * UNIT}
            x2={HALF}
            y2={k * UNIT}
            stroke="rgb(50 50 90)"
            strokeWidth={k === 0 ? 1.5 : 0.5}
          />
        </g>
      ))}

      {/* Axes arrows */}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgb(80 80 120)" />
        </marker>
      </defs>
      <line
        x1={-HALF - 8}
        y1={0}
        x2={HALF + 12}
        y2={0}
        stroke="rgb(80 80 120)"
        strokeWidth={1}
        markerEnd="url(#arrow)"
      />
      <line
        x1={0}
        y1={HALF + 8}
        x2={0}
        y2={-HALF - 12}
        stroke="rgb(80 80 120)"
        strokeWidth={1}
        markerEnd="url(#arrow)"
      />

      {/* Axis labels */}
      {gridLines
        .filter((k) => k !== 0 && k % LABEL_EVERY === 0)
        .map((k) => (
          <g key={`label-${k}`}>
            {/* X-axis numbers */}
            <text
              x={k * UNIT}
              y={HALF + 14}
              textAnchor="middle"
              fontSize="9"
              fill="rgb(100 100 150)"
              fontFamily="monospace"
            >
              {k}
            </text>
            {/* Y-axis numbers */}
            <text
              x={-HALF - 14}
              y={-k * UNIT + 3}
              textAnchor="middle"
              fontSize="9"
              fill="rgb(100 100 150)"
              fontFamily="monospace"
            >
              {k}
            </text>
          </g>
        ))}

      {/* Axis name labels */}
      <text x={HALF + 16} y={4} fontSize="10" fill="rgb(130 130 180)" fontFamily="monospace">
        x
      </text>
      <text x={4} y={-HALF - 14} fontSize="10" fill="rgb(130 130 180)" fontFamily="monospace">
        y
      </text>

      {/* Correct answer reveal */}
      {showAnswer && (() => {
        const [sx, sy] = toSvg(showAnswer.x, showAnswer.y)
        return (
          <g>
            <circle cx={sx} cy={sy} r={14} fill="rgba(239,68,68,0.15)" stroke="rgb(239,68,68)" strokeWidth={1.5} strokeDasharray="3 2" />
            <text x={sx} y={sy - 18} textAnchor="middle" fontSize="9" fill="rgb(239,68,68)" fontFamily="monospace">
              ({showAnswer.x},{showAnswer.y})
            </text>
          </g>
        )
      })()}

      {/* Target point */}
      <AnimatePresence>
        {target && (() => {
          const [tx, ty] = toSvg(target.x, target.y)
          const isCorrect = feedback === "correct"
          const isWrong = feedback === "wrong"
          const color = isCorrect ? "rgb(16,185,129)" : isWrong ? "rgb(239,68,68)" : "rgb(99,102,241)"
          const glowColor = isCorrect
            ? "rgba(16,185,129,0.3)"
            : isWrong
              ? "rgba(239,68,68,0.3)"
              : "rgba(99,102,241,0.25)"

          return (
            <g key={`${target.x}-${target.y}`}>
              {/* Pulse ring */}
              <motion.circle
                cx={tx}
                cy={ty}
                r={10}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                initial={{ r: 8, opacity: 0.8 }}
                animate={{ r: 22, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
              {/* Glow */}
              <circle cx={tx} cy={ty} r={12} fill={glowColor} />
              {/* Core dot */}
              <motion.circle
                cx={tx}
                cy={ty}
                r={7}
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: isCorrect ? [1, 1.4, 0] : 1 }}
                transition={isCorrect ? { duration: 0.4 } : { duration: 0.3 }}
              />
              {/* Cross-hairs */}
              <line x1={tx - 14} y1={ty} x2={tx - 9} y2={ty} stroke={color} strokeWidth={1.5} opacity={0.6} />
              <line x1={tx + 9} y1={ty} x2={tx + 14} y2={ty} stroke={color} strokeWidth={1.5} opacity={0.6} />
              <line x1={tx} y1={ty - 14} x2={tx} y2={ty - 9} stroke={color} strokeWidth={1.5} opacity={0.6} />
              <line x1={tx} y1={ty + 9} x2={tx} y2={ty + 14} stroke={color} strokeWidth={1.5} opacity={0.6} />
            </g>
          )
        })()}
      </AnimatePresence>
    </svg>
  )
}
