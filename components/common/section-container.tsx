// components/common/section-container.tsx

import type { ElementType } from 'react'
import { cn } from '@/lib/utils'

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
  as?: ElementType
}

export function SectionContainer({
  children,
  className,
  id,
  as: Tag = 'section',
}: SectionContainerProps) {
  return (
    <Tag id={id} className={cn('py-20 md:py-28', className)}>
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">{children}</div>
    </Tag>
  )
}
