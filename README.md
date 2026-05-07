# MathQuest 🎮

> Arcade-style math practice for elementary and middle school students.

MathQuest transforms ordinary math worksheet drills into replayable, scoring-driven mini-games. Built on Next.js 15, TypeScript, TailwindCSS, Framer Motion, and Zustand.

---

## Quick Start

```bash
cd mathquest
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
  app/                      # Next.js App Router pages
    page.tsx                # Landing page
    games/
      page.tsx              # Game library
      arithmetic-rush/      # Game routes
      coordinate-blast/
  components/
    ui/                     # shadcn-style base components
    layout/                 # Navbar, Footer
    landing/                # Hero, FeaturedGames, HowItWorks
    game-shell/             # GameShell, Timer, ScoreDisplay, etc.
  games/
    arithmetic-rush/        # Game logic + UI components
    coordinate-blast/
    shared/                 # Shared game types (future)
  hooks/                    # useGameTimer, useScore, useStreak, etc.
  lib/                      # utils.ts, gameRegistry.ts
  store/                    # Zustand stores (gameStore, userStore)
  types/                    # TypeScript interfaces
  utils/                    # mathUtils, formatters
```

---

## Adding a New Game

1. **Register** it in `src/lib/gameRegistry.ts`
2. **Create** `src/games/your-game/` with:
   - `logic.ts` — pure functions, no React
   - `YourGame.tsx` — the game UI
3. **Add a page** at `src/app/games/your-game/page.tsx`:
   ```tsx
   export default function YourGamePage() {
     return (
       <GameShell gameId="your-game" title="..." description="..." icon="🎯">
         <YourGame />
       </GameShell>
     )
   }
   ```
4. Done — it auto-appears in the game library and featured sections.

### Game Contract

Your game component gets a clean slate every session. It should:
- Read `status` from `useGameStore` to know when gameplay is active
- Call `useScore().recordCorrect(timeMs)` on correct answers
- Call `useScore().recordIncorrect()` on wrong answers
- Use `useSoundToggle().playSound(type)` for audio feedback
- Render `null` when `status !== "playing"`

The `GameShell` handles: timer, start screen, results screen, HUD, and game state lifecycle.

---

## Deploy to Vercel

```bash
# One-time
npm install -g vercel

# Deploy
vercel --prod
```

Or connect the repo to Vercel — it auto-detects Next.js.

---

## Future: Supabase Integration

The codebase is structured for a clean Supabase drop-in:

1. Install: `npm install @supabase/supabase-js`
2. Add env vars to `.env.local` (see `.env.local.example`)
3. Replace stubs in `src/store/userStore.ts` with real Supabase auth calls
4. Add leaderboard tables and wire them into `ResultsScreen`

The `UserProfile`, `GameHighScore`, and `UserStats` types in `src/types/user.ts` already match the intended Supabase schema.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS + CSS variables |
| Components | shadcn/ui-compatible |
| Animation | Framer Motion |
| State | Zustand |
| Audio | Web Audio API (synthesized) |
| Deployment | Vercel |

---

## Roadmap

- [ ] Supabase auth + user profiles
- [ ] Leaderboards (global + classroom)
- [ ] Fraction Frenzy game
- [ ] Equation Solver game
- [ ] Teacher dashboard + classroom codes
- [ ] Daily challenges
- [ ] Achievements + badges
- [ ] Adaptive difficulty via AI
- [ ] Multiplayer race mode
