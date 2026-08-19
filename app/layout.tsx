// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import ClickSpark from '@/components/ui/click-spark'
import { ChatWidget } from '@/components/ai/chat-widget'
import { Toaster } from '@/components/ui/sonner'
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-dhani.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ahmad Dhani Setiawan — Fullstack Developer',
    template: '%s | Ahmad Dhani Setiawan',
  },
  description:
    'Fullstack Developer specializing in high-performance web applications built with Next.js, TypeScript, PostgreSQL, and Supabase.',
  keywords: [
    'Ahmad Dhani Setiawan',
    'Fullstack Developer',
    'Next.js Developer',
    'React Developer',
    'TypeScript',
    'PostgreSQL',
    'Supabase',
    'Web Developer Indonesia',
    'Frontend Developer',
    'Backend Developer',
  ],
  authors: [
    {
      name: 'Ahmad Dhani Setiawan',
      url: 'https://github.com/danisetiawan31',
    },
  ],
  creator: 'Ahmad Dhani Setiawan',
  publisher: 'Ahmad Dhani Setiawan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Ahmad Dhani Setiawan Portfolio',
    title: 'Ahmad Dhani Setiawan — Fullstack Developer',
    description:
      'Explore selected fullstack projects, engineering case studies, and modern web applications built by Ahmad Dhani Setiawan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahmad Dhani Setiawan — Fullstack Developer',
    description:
      'Explore selected fullstack projects, engineering case studies, and modern web applications built by Ahmad Dhani Setiawan.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
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
      <body
        className="flex min-h-full flex-col font-sans antialiased"
        suppressHydrationWarning
      >
        {/* ── Global ambient background ─────────────────────────────────────── */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          {/* Glow — top left (pure radial-gradient, 0 blur GPU overhead) */}
          <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.07)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(167,139,250,0.11)_0%,transparent_70%)]" />
          {/* Glow — bottom right */}
          <div className="absolute -right-20 -bottom-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(129,140,248,0.09)_0%,transparent_70%)]" />
          {/* Glow — center faint */}
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(203,213,225,0.04)_0%,transparent_70%)]" />
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
          <ClickSpark
            sparkColor="primary"
            sparkSize={17}
            sparkRadius={80}
            sparkCount={8}
            duration={800}
          >
            {children}
          </ClickSpark>
          <ChatWidget />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
