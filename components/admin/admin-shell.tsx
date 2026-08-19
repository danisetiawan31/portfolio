// components/admin/admin-shell.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { AdminSidebar } from './admin-sidebar'

const ROUTE_LABELS: Record<string, string> = {
  admin: 'Dashboard',
  projects: 'Projects',
  experiences: 'Experiences',
  skills: 'Skills',
  certificates: 'Certificates',
  cv: 'CV / Resume',
  ai: 'AI Assistant',
  new: 'Create New',
  edit: 'Edit Item',
}

function AdminBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin">Admin</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.slice(1).map((segment, index) => {
          const isLast = index === segments.length - 2
          const href = `/${segments.slice(0, index + 2).join('/')}`
          const label =
            ROUTE_LABELS[segment] ||
            (segment.length > 15 ? `${segment.slice(0, 8)}...` : segment)

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-foreground font-semibold">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        {/* ── Sticky Top Bar (sidebar-07 style) ── */}
        <header className="border-border/80 bg-card/85 sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 backdrop-blur-md transition-[width,height] ease-linear">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AdminBreadcrumbs />
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 gap-1.5 text-xs"
            >
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <span className="hidden sm:inline">Lihat Website</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
