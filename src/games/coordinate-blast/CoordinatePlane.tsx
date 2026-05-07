"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { CoordPoint } from "./logic"

// Each math unit = UNIT pixels in SVG space
// Increase UNIT to make the grid physically larger on screen
const UNIT = 26
const RANGE = 10
const LABEL_EVERY = 2

interface CoordinatePlaneProps {
  target: CoordPoint | null
  feedback: "correct" | "wrong" | null
  showAnswer?: CoordPoint | null
}

function toSvg(mathX: number, mathY: number): [number, number] {
  return [mathX * UNIT, -mathY * UNIT]
}

const HALF = RANGE * UNIT // 260

export function CoordinatePlane({ target, feedback, showAnswer }: CoordinatePlaneProps) {
  const gridLines = Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE)

  return (
    <svg
      viewBox={`${-HALF - 30} ${-HALF - 30} ${(HALF + 30) * 2} ${(HALF + 30) * 2}`}
      className="w-full select-none"
      aria-label="Coordinate plane"
    >
      {/* Grid lines */}
      {gridLines.map((k) => (
        <g key={k}>
          <line
            x1={k * UNIT} y1={-HALF}
            x2={k * UNIT} y2={HALF}
            stroke="rgb(68 68 108)"
            strokeWidth={k === 0 ? 2 : 0.7}
          />
          <line
            x1={-HALF} y1={k * UNIT}
            x2={HALF}  y2={k * UNIT}
            stroke="rgb(68 68 108)"
            strokeWidth={k === 0 ? 2 : 0.7}
          />
        </g>
      ))}

      {/* Axes arrows */}
      <defs>
        <marker id="arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="rgb(110 110 160)" />
        </marker>
      </defs>
      <line
        x1={-HALF - 10} y1={0} x2={HALF + 16} y2={0}
        stroke="rgb(110 110 160)" strokeWidth={1.5}
        markerEnd="url(#arrow)"
      />
      <line
        x1={0} y1={HALF + 10} x2={0} y2={-HALF - 16}
        stroke="rgb(110 110 160)" strokeWidth={1.5}
        markerEnd="url(#arrow)"
      />

      {/* Axis number labels */}
      {gridLines
        .filter((k) => k !== 0 && k % LABEL_EVERY === 0)
        .map((k) => (
          <g key={`label-${k}`}>
            {/* X-axis */}
            <text
              x={k * UNIT} y={HALF + 20}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="rgb(190 190 230)"
              fontFamily="monospace"
            >
              {k}
            </text>
            {/* Y-axis */}
            <text
              x={-HALF - 20} y={-k * UNIT + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="rgb(190 190 230)"
              fontFamily="monospace"
            >
              {k}
            </text>
          </g>
        ))}

      {/* Axis name labels */}
      <text x={HALF + 20} y={5} fontSize="14" fontWeight="bold" fill="rgb(200 200 240)" fontFamily="monospace">x</text>
      <text x={6} y={-HALF - 18} fontSize="14" fontWeight="bold" fill="rgb(200 200 240)" fontFamily="monospace">y</text>

      {/* Correct answer reveal */}
      {showAnswer && (() => {
        const [sx, sy] = toSvg(showAnswer.x, showAnswer.y)
        return (
          <g>
            <circle cx={sx} cy={sy} r={16} fill="rgba(239,68,68,0.15)" stroke="rgb(239,68,68)" strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={sx} y={sy - 22} textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgb(239,68,68)" fontFamily="monospace">
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
              {/* Outer pulse ring */}
              <motion.circle
                cx={tx} cy={ty} r={12}
                fill="none" stroke={color} strokeWidth={2}
                initial={{ r: 10, opacity: 0.9 }}
                animate={{ r: 28, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
              {/* Glow fill */}
              <circle cx={tx} cy={ty} r={14} fill={glowColor} />
              {/* Core dot */}
              <motion.circle
                cx={tx} cy={ty} r={9}
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: isCorrect ? [1, 1.5, 0] : 1 }}
                transition={isCorrect ? { duration: 0.4 } : { duration: 0.3 }}
              />
              {/* Crosshairs */}
              <line x1={tx - 18} y1={ty} x2={tx - 12} y2={ty} stroke={color} strokeWidth={2} opacity={0.7} />
              <line x1={tx + 12} y1={ty} x2={tx + 18} y2={ty} stroke={color} strokeWidth={2} opacity={0.7} />
              <line x1={tx} y1={ty - 18} x2={tx} y2={ty - 12} stroke={color} strokeWidth={2} opacity={0.7} />
              <line x1={tx} y1={ty + 12} x2={tx} y2={ty + 18} stroke={color} strokeWidth={2} opacity={0.7} />
            </g>
          )
        })()}
      </AnimatePresence>
    </svg>
  )
}
