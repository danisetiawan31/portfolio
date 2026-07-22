// components/ui/tech-badge.tsx
// Reusable tech icon badge — maps tech name to local SVG icon in /public/icons
// Falls back to default.svg if no match found.

import Image from 'next/image'
import { cn } from '@/lib/utils'

// ── Icon map: normalised tech name → public path ─────────────────────────────
// Keys are lowercase, spaces removed for normalisation.
const ICON_MAP: Record<string, string> = {
  // Languages
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

  // Frontend
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

  // Backend
  nodejs: '/icons/nodejs.svg',
  'node.js': '/icons/nodejs.svg',
  node: '/icons/nodejs.svg',
  express: '/icons/express.svg',
  'express.js': '/icons/express.svg',
  expressjs: '/icons/express.svg',
  laravel: '/icons/laravel.svg',
  codeigniter: '/icons/codeigniter.svg',

  // Databases
  mysql: '/icons/mysql.svg',
  postgresql: '/icons/postgree.svg',
  postgres: '/icons/postgree.svg',
  mongodb: '/icons/mongodb.svg',
  firebase: '/icons/firebase.svg',
  supabase: '/icons/supabase.svg',

  // Auth / Utils
  jwt: '/icons/jwt.svg',
  zod: '/icons/zod.svg',
  zustand: '/icons/zustand.svg',
  framermotion: '/icons/fm.svg',
  'framer-motion': '/icons/fm.svg',
  framer: '/icons/fm.svg',

  // Tools
  git: '/icons/github.svg',
  github: '/icons/github.svg',
  postman: '/icons/postman.svg',
  jira: '/icons/Jira.svg',
  vercel: '/icons/vercel.svg',
  tableau: '/icons/tableau.svg',
}

function normalise(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '')
}

function resolveIcon(tech: string): string {
  return ICON_MAP[normalise(tech)] ?? '/icons/default.svg'
}

// ── Component ─────────────────────────────────────────────────────────────────

interface TechBadgeProps {
  label: string
  /** Show label text alongside icon. Defaults to false (icon-only). */
  showLabel?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE = {
  sm: { img: 14, wrapper: 'h-6 w-6', padding: 'p-1' },
  md: { img: 18, wrapper: 'h-8 w-8', padding: 'p-1.5' },
  lg: { img: 22, wrapper: 'h-10 w-10', padding: 'p-2' },
}

export function TechBadge({
  label,
  showLabel = false,
  className,
  size = 'md',
}: TechBadgeProps) {
  const iconPath = resolveIcon(label)
  const s = SIZE[size]

  if (showLabel) {
    return (
      <span
        title={label}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3 py-1 text-[12px] font-medium text-zinc-600 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900 dark:text-zinc-300',
          className,
        )}
      >
        <Image
          src={iconPath}
          alt={label}
          width={s.img}
          height={s.img}
          className="flex-shrink-0"
        />
        {label}
      </span>
    )
  }

  return (
    <span
      title={label}
      aria-label={label}
      className={cn(
        s.wrapper,
        s.padding,
        'inline-flex items-center justify-center rounded-lg border border-zinc-200/80 bg-white shadow-sm transition-transform hover:scale-110 dark:border-zinc-700/60 dark:bg-zinc-900',
        className,
      )}
    >
      <Image
        src={iconPath}
        alt={label}
        width={s.img}
        height={s.img}
        className="flex-shrink-0"
      />
    </span>
  )
}
