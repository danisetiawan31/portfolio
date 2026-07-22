'use client'

// components/layout/navbar.tsx

import { FloatingNav } from '@/components/ui/floating-navbar'
import { NAV_ITEMS } from '@/components/layout/constants'

export const Navbar = () => {
  return <FloatingNav navItems={NAV_ITEMS} />
}
