// app/admin/layout.tsx

import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

import { Toaster } from '@/components/ui/sonner'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen">
        <AdminSidebar />
        {/* Offset content for fixed sidebar on desktop */}
        <div className="flex-1 md:ml-60">
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
      <Toaster />
    </>
  )
}
