import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calendly - Schedule meetings',
  description: 'Schedule meetings efficiently',
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

