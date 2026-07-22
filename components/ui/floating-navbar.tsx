'use client'

// components/ui/floating-navbar.tsx

import React, { useState } from 'react'
import { useMounted } from '@/lib/hooks/use-mounted'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

export type NavItem = {
  name: string
  link: string
  icon?: React.ReactElement
}

// ── Theme toggle button ───────────────────────────────────────────────────────

function ThemeButton() {
  const mounted = useMounted()
  const { resolvedTheme, setTheme } = useTheme()
  const [hovered, setHovered] = useState(false)
  if (!mounted) return <div className="h-8 w-8" />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-foreground/60 hover:text-primary dark:hover:text-primary relative cursor-pointer rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
    >
      <motion.div
        animate={{ scale: hovered ? 1.15 : 1, rotate: isDark ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {isDark ? (
          <Sun size={17} strokeWidth={2} />
        ) : (
          <Moon size={17} strokeWidth={2} />
        )}
      </motion.div>
    </button>
  )
}

// ── Floating nav ──────────────────────────────────────────────────────────────

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[]
  className?: string
}) => {
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(true)
  const [activeTab, setActiveTab] = useState(navItems[0]?.name ?? '')

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current !== 'number') return
    const prev = scrollYProgress.getPrevious() ?? 0
    const dir = current - prev

    if (current < 0.05) {
      setVisible(true)
    } else {
      setVisible(dir < 0)
    }
  })

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ y: visible ? 0 : -120, opacity: visible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      className={cn(
        'fixed inset-x-0 top-0 z-[5000] flex justify-center pt-5',
        className,
      )}
    >
      {/* Pill container */}
      <div
        className="flex items-center gap-1 rounded-full border border-black/[0.06] bg-white/70 px-1.5 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-950/70"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.link}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                'relative cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-foreground/60 hover:text-foreground',
              )}
            >
              {/* Lamp glow indicator */}
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="bg-primary/8 dark:bg-primary/10 absolute inset-0 -z-10 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {/* Top bar */}
                  <div className="bg-primary absolute -top-[9px] left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t-full">
                    {/* Glow spread */}
                    <div className="bg-primary/20 absolute -top-1 -left-2 h-5 w-12 rounded-full blur-md" />
                    <div className="bg-primary/20 absolute -top-0.5 h-4 w-8 rounded-full blur-md" />
                    <div className="bg-primary/30 absolute top-0 left-2 h-3 w-4 rounded-full blur-sm" />
                  </div>
                </motion.div>
              )}

              {/* Label: text on md+, icon on mobile */}
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sm:hidden" aria-hidden>
                {item.icon}
              </span>
            </Link>
          )
        })}

        {/* Separator */}
        <div className="bg-border/60 mx-1 h-5 w-px" />

        {/* Theme toggle */}
        <ThemeButton />
      </div>
    </motion.div>
  )
}
