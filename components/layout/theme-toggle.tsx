'use client'

// components/layout/theme-toggle.tsx

import { useMounted } from '@/lib/hooks/use-mounted'
import { useTheme } from 'next-themes'
import { IconMoon, IconSun } from '@tabler/icons-react'

export const ThemeToggle = () => {
  const mounted = useMounted()
  const { resolvedTheme, setTheme } = useTheme()

  if (!mounted) return null

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed right-6 bottom-6 z-[5000] rounded-full border border-neutral-200 bg-white p-2.5 shadow-sm transition-colors hover:bg-neutral-50 sm:top-6 sm:right-6 sm:bottom-auto dark:border-white/[0.2] dark:bg-neutral-900 dark:hover:bg-neutral-800"
    >
      {resolvedTheme === 'dark' ? (
        <IconSun size={18} className="text-neutral-700 dark:text-neutral-200" />
      ) : (
        <IconMoon
          size={18}
          className="text-neutral-700 dark:text-neutral-200"
        />
      )}
    </button>
  )
}
