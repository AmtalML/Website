import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import type React from "react"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AmtalML - AI Inference at Scale",
  description: "Accelerate AI inference and innovation with AmtalML",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  )
}

