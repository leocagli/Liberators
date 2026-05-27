import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import { AuthSessionProvider } from '@/components/auth/session-provider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  title: 'Liberators - Self-Evolving Agents on Arkiv',
  description: 'Autonomous agent evolution with decentralized Soul backups on Arkiv',
  icons: {
    icon: '/liberators-mark.svg',
    apple: '/liberators-logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased`}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  )
}
