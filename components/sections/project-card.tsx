// components/sections/project-card.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { type Project } from '@/lib/supabase/queries/projects'
import { TechBadge } from '@/components/common/tech-badge'

// ─── CardContent (shared, used by both variants) ──────────────────────────────

function CardContent({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col gap-4">
      {/* Thumbnail */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900"
      >
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No preview</span>
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="flex items-start justify-between gap-4 px-1">
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-foreground text-lg font-bold sm:text-xl">
            {project.title}
          </h3>
          {project.tech_stack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.map((tech) => (
                <TechBadge key={tech} label={tech} size="sm" />
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          View Project
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

// ─── ProjectCard — whileInView reveal, untuk semua project ───────────────────

export function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: '-10% 0px -10% 0px' }}
      transition={{
        duration: 0.6,
        delay: (index % 2) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <CardContent project={project} />
    </motion.div>
  )
}
