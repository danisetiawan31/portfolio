'use client'

import { usePathname } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      {/* Offset content for fixed sidebar on desktop */}
      <div className="flex-1 md:ml-60">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
