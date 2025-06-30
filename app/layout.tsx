import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'COGNIFY',
  description: 'Build on Next.js with Tailwind CSS and Shadcn UI',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
