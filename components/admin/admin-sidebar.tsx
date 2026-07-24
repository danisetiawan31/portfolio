// app/admin/_components/admin-sidebar.tsx

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Wrench,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Award,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Experiences', href: '/admin/experiences', icon: Briefcase },
  { label: 'Skills', href: '/admin/skills', icon: Wrench },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  function isActive(href: string): boolean {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const sidebarContent = (
    <aside className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-slate-700/60 px-6">
        <Link
          href="/admin"
          className="text-lg font-semibold tracking-tight text-white"
          onClick={() => setMobileOpen(false)}
        >
          Admin Panel
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={[
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 opacity-70" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-slate-700/60 p-3">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 opacity-70" />
          ) : (
            <Moon className="h-4 w-4 opacity-70" />
          )}
          Toggle theme
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-red-900/40 hover:text-red-300 disabled:opacity-50"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4 opacity-70" />
          {loggingOut ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-60 md:block">
        {sidebarContent}
      </div>

      {/* Mobile: top bar + drawer */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-slate-700/60 bg-slate-900 px-4 md:hidden">
        <Link href="/admin" className="text-sm font-semibold text-white">
          Admin Panel
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-60 md:hidden">
            {sidebarContent}
          </div>
        </>
      )}

      {/* Mobile top-bar offset */}
      <div className="h-14 md:hidden" />
    </>
  )
}
