import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "MathQuest – Arcade Math Practice",
    template: "%s | MathQuest",
  },
  description:
    "Transform boring math drills into addictive arcade-style games. Practice arithmetic, coordinates, fractions, and more — for free.",
  keywords: [
    "math games",
    "educational games",
    "arithmetic practice",
    "coordinate plane",
    "elementary math",
    "middle school math",
    "math drill",
  ],
  openGraph: {
    title: "MathQuest – Arcade Math Practice",
    description: "Boring math drills → addictive arcade games.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-background text-foreground antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
