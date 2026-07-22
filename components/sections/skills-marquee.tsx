'use client'

// components/sections/skills-marquee.tsx
// Two-row infinite marquee — top row scrolls left, bottom row scrolls right.
// Pure CSS animation, no JS scroll listener.

import Image from 'next/image'
import { cn } from '@/lib/utils'

// ── Icon map (same as tech-badge.tsx) ────────────────────────────────────────

const ICON_MAP: Record<string, string> = {
  javascript: '/icons/js.svg',
  js: '/icons/js.svg',
  typescript: '/icons/ts.svg',
  ts: '/icons/ts.svg',
  python: '/icons/python.svg',
  php: '/icons/php.svg',
  java: '/icons/java.svg',
  dart: '/icons/dart.svg',
  r: '/icons/R.svg',
  html: '/icons/html.svg',
  css: '/icons/css.svg',
  react: '/icons/react.svg',
  'react.js': '/icons/react.svg',
  reactjs: '/icons/react.svg',
  redux: '/icons/Redux.svg',
  nextjs: '/icons/next.svg',
  'next.js': '/icons/next.svg',
  next: '/icons/next.svg',
  flutter: '/icons/Flutter.svg',
  vite: '/icons/vite.svg',
  tailwind: '/icons/tail.svg',
  tailwindcss: '/icons/tail.svg',
  bootstrap: '/icons/bootstrap.svg',
  figma: '/icons/figma.svg',
  nodejs: '/icons/nodejs.svg',
  'node.js': '/icons/nodejs.svg',
  node: '/icons/nodejs.svg',
  express: '/icons/express.svg',
  'express.js': '/icons/express.svg',
  expressjs: '/icons/express.svg',
  laravel: '/icons/laravel.svg',
  codeigniter: '/icons/codeigniter.svg',
  mysql: '/icons/mysql.svg',
  postgresql: '/icons/postgree.svg',
  postgres: '/icons/postgree.svg',
  mongodb: '/icons/mongodb.svg',
  firebase: '/icons/firebase.svg',
  supabase: '/icons/supabase.svg',
  jwt: '/icons/jwt.svg',
  zod: '/icons/zod.svg',
  zustand: '/icons/zustand.svg',
  framermotion: '/icons/fm.svg',
  'framer-motion': '/icons/fm.svg',
  framer: '/icons/fm.svg',
  git: '/icons/github.svg',
  github: '/icons/github.svg',
  postman: '/icons/postman.svg',
  jira: '/icons/Jira.svg',
  vercel: '/icons/vercel.svg',
  tableau: '/icons/tableau.svg',
}

function resolveIcon(name: string): string {
  return (
    ICON_MAP[name.toLowerCase().replace(/\s+/g, '')] ?? '/icons/default.svg'
  )
}

// ── Single icon pill ──────────────────────────────────────────────────────────

function IconPill({ name }: { name: string }) {
  return (
    <span
      title={name}
      aria-label={name}
      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-transform hover:scale-110 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <Image
        src={resolveIcon(name)}
        alt={name}
        width={36}
        height={36}
        className="flex-shrink-0"
      />
    </span>
  )
}

// ── Marquee row ───────────────────────────────────────────────────────────────

function MarqueeRow({
  items,
  direction = 'left',
  className,
}: {
  items: string[]
  direction?: 'left' | 'right'
  className?: string
}) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className={cn('relative flex overflow-hidden', className)}>
      {/* Fade edges */}
      <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r to-transparent" />
      <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l to-transparent" />

      <div
        className={cn(
          'flex gap-4',
          direction === 'left'
            ? 'animate-marquee-left'
            : 'animate-marquee-right',
        )}
      >
        {doubled.map((name, i) => (
          <IconPill key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function SkillsMarquee({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null

  const mid = Math.ceil(skills.length / 2)
  const row1 = skills.slice(0, mid)
  const row2 = skills.slice(mid)

  return (
    <div className="flex flex-col gap-4">
      <MarqueeRow items={row1} direction="left" />
      <MarqueeRow items={row2} direction="right" />
    </div>
  )
}
