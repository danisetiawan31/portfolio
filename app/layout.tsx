// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dani Portfolio',
  description: 'Fullstack Developer Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        {/* ── Global ambient background ─────────────────────────────────────── */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          {/* Glow — top left */}
          <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-violet-500/[0.06] blur-[140px] dark:bg-violet-400/[0.09]" />
          {/* Glow — bottom right */}
          <div className="absolute -right-20 -bottom-24 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.05] blur-[120px] dark:bg-indigo-400/[0.08]" />
          {/* Glow — center faint */}
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-400/[0.03] blur-[100px] dark:bg-slate-300/[0.03]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
        </div>

        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
        </Providers>
      </body>
    </html>
  )
}
