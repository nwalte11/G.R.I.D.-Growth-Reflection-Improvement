import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'G.R.I.D. - Growth Reflection Improvement',
  description: 'A full-stack interactive dashboard for tracking and improving cognitive, professional, physical, psychological, writing, and appearance skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
