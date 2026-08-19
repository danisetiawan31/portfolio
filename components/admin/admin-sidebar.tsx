// components/admin/admin-sidebar.tsx

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
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
  FileText,
  Bot,
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
  { label: 'CV / Resume', href: '/admin/cv', icon: FileText },
  { label: 'AI Assistant', href: '/admin/ai', icon: Bot },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const sidebarContent = (
    <aside className="border-border bg-card text-card-foreground flex h-full flex-col border-r shadow-xs">
      {/* Brand */}
      <div className="border-border/80 flex h-16 items-center border-b px-6">
        <Link
          href="/admin"
          className="text-foreground text-base font-bold tracking-tight transition-opacity hover:opacity-80"
          onClick={() => setMobileOpen(false)}
        >
          Dhani <span className="text-primary">Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-primary/20 bg-primary/10 text-primary border font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  active ? 'text-primary' : 'opacity-70',
                )}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-border/80 space-y-1.5 border-t p-3">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="text-muted-foreground hover:bg-muted/70 hover:text-foreground flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="hidden h-4 w-4 opacity-80 dark:block" />
          <Moon className="block h-4 w-4 opacity-80 dark:hidden" />
          Ganti Tema
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4 opacity-80" />
          {loggingOut ? 'Keluar…' : 'Keluar'}
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
      <div className="border-border/80 bg-card/95 fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b px-4 backdrop-blur-md md:hidden">
        <Link
          href="/admin"
          className="text-foreground text-sm font-bold tracking-tight"
        >
          Dhani <span className="text-primary">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            {sidebarContent}
          </div>
        </>
      )}

      {/* Mobile top-bar offset */}
      <div className="h-14 md:hidden" />
    </>
  )
}
