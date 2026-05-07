import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-gradient">MathQuest</span>
          </div>

          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Making math practice engaging for every student, everywhere.
          </p>

          <div className="flex gap-5 text-sm text-muted-foreground">
            <Link href="/games" className="hover:text-primary transition-colors">
              Games
            </Link>
            <span className="text-border">·</span>
            <span className="opacity-40 cursor-not-allowed select-none">For Teachers</span>
            <span className="text-border">·</span>
            <span className="opacity-40 cursor-not-allowed select-none">About</span>
          </div>
        </div>

        <div className="mt-8 border-t border-border/30 pt-6 text-center text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} MathQuest. Built for curious minds.
        </div>
      </div>
    </footer>
  )
}
