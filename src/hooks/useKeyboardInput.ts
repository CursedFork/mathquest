"use client"

import { useEffect } from "react"

interface UseKeyboardInputOptions {
  onEnter?: () => void
  onEscape?: () => void
  onArrow?: (direction: "up" | "down" | "left" | "right") => void
  enabled?: boolean
}

/**
 * Global keyboard listener for game input.
 * Attach to game root to handle hotkeys without focusing a specific element.
 */
export function useKeyboardInput({
  onEnter,
  onEscape,
  onArrow,
  enabled = true,
}: UseKeyboardInputOptions) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault()
          onEnter?.()
          break
        case "Escape":
          onEscape?.()
          break
        case "ArrowUp":
          e.preventDefault()
          onArrow?.("up")
          break
        case "ArrowDown":
          e.preventDefault()
          onArrow?.("down")
          break
        case "ArrowLeft":
          onArrow?.("left")
          break
        case "ArrowRight":
          onArrow?.("right")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onEnter, onEscape, onArrow, enabled])
}
