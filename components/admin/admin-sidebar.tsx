// components/admin/admin-sidebar.tsx

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Wrench,
  Award,
  FileText,
  Bot,
  Command,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavUser } from './nav-user'

interface NavItem {
  title: string
  url: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Projects', url: '/admin/projects', icon: FolderKanban },
  { title: 'Experiences', url: '/admin/experiences', icon: Briefcase },
  { title: 'Skills', url: '/admin/skills', icon: Wrench },
  { title: 'Certificates', url: '/admin/certificates', icon: Award },
  { title: 'CV / Resume', url: '/admin/cv', icon: FileText },
  { title: 'AI Assistant', url: '/admin/ai', icon: Bot },
]

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const isActive = (url: string) =>
    url === '/admin' ? pathname === '/admin' : pathname.startsWith(url)

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Brand Header (sidebar-07 style) ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Dhani Admin</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Portfolio Control Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Flat Menu Navigation (sidebar-07 flat tier, no collapsible sub-menu) ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const active = isActive(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={
                      active
                        ? 'border-primary/20 bg-primary/10 text-primary border font-semibold'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    }
                  >
                    <Link href={item.url}>
                      <item.icon className={active ? 'text-primary' : ''} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer NavUser ── */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
