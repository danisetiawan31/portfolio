// components/common/section-header.tsx

import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <div className={cn('mb-12', isCenter && 'text-center', className)}>
      {/* Decorative accent line */}
      <div
        className={cn(
          'bg-primary mb-4 h-[3px] w-10 rounded-full',
          isCenter && 'mx-auto',
        )}
      />

      {/* Title */}
      <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            'text-muted-foreground mt-3 max-w-2xl text-base md:text-lg',
            isCenter && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
