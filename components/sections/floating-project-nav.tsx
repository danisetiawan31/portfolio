// components/sections/floating-project-nav.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type Project } from '@/lib/supabase/queries/projects'

interface FloatingProjectNavProps {
  prev: Project | null
  next: Project | null
}

export function FloatingProjectNav({ prev, next }: FloatingProjectNavProps) {
  return (
    <>
      {/* ── Floating Left (Previous Project) ── */}
      {prev && (
        <aside
          aria-label="Previous project navigation"
          className="fixed top-1/2 left-3 z-30 hidden -translate-y-1/2 lg:block xl:left-6"
        >
          <Link
            href={`/projects/${prev.slug}`}
            className="group border-border/80 bg-background/80 hover:bg-background/95 flex items-center gap-3 rounded-full border p-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-violet-500/50 hover:pr-4 hover:shadow-violet-500/10"
            title={`Previous: ${prev.title}`}
          >
            <div className="bg-muted/80 text-foreground flex size-9 items-center justify-center rounded-full transition-colors group-hover:bg-violet-500/15 group-hover:text-violet-400">
              <ChevronLeft className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </div>
            <div className="hidden max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-48 group-hover:opacity-100 xl:block">
              <span className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
                Previous Project
              </span>
              <span className="text-foreground block truncate text-xs font-medium">
                {prev.title}
              </span>
            </div>
          </Link>
        </aside>
      )}

      {/* ── Floating Right (Next Project) ── */}
      {next && (
        <aside
          aria-label="Next project navigation"
          className="fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 lg:block xl:right-6"
        >
          <Link
            href={`/projects/${next.slug}`}
            className="group border-border/80 bg-background/80 hover:bg-background/95 flex items-center gap-3 rounded-full border p-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-violet-500/50 hover:pl-4 hover:shadow-violet-500/10"
            title={`Next: ${next.title}`}
          >
            <div className="hidden max-w-0 overflow-hidden text-right whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-48 group-hover:opacity-100 xl:block">
              <span className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
                Next Project
              </span>
              <span className="text-foreground block truncate text-xs font-medium">
                {next.title}
              </span>
            </div>
            <div className="bg-muted/80 text-foreground flex size-9 items-center justify-center rounded-full transition-colors group-hover:bg-violet-500/15 group-hover:text-violet-400">
              <ChevronRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </Link>
        </aside>
      )}
    </>
  )
}
