// components/sections/projects.tsx

import Link from 'next/link'
import { getPublicProjects } from '@/lib/supabase/queries/projects'
import { ProjectCard } from './project-card'
import { SectionContainer } from '@/components/common/section-container'
import { SectionHeader } from '@/components/common/section-header'

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
      <p className="text-muted-foreground text-sm">
        No projects yet. Check back soon!
      </p>
    </div>
  )
}

// ─── ProjectsSection ──────────────────────────────────────────────────────────

export default async function ProjectsSection() {
  const projects = await getPublicProjects()
  const isEmpty = projects.length === 0

  const displayProjects = projects
  const sectionTitle = 'Featured Case Studies'
  const sectionSubtitle =
    "In-depth breakdown of production-grade applications and systems I've engineered."

  return (
    <SectionContainer id="projects">
      <SectionHeader title={sectionTitle} subtitle={sectionSubtitle} />

      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
          {displayProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}

      {!isEmpty && (
        <div className="mt-16 flex justify-center">
          <Link
            href="/projects"
            className="group text-muted-foreground hover:text-primary flex items-center gap-2 text-base font-medium transition-colors"
          >
            <span className="decoration-muted-foreground/30 group-hover:decoration-primary underline underline-offset-4 transition-colors">
              View all my projects
            </span>
          </Link>
        </div>
      )}
    </SectionContainer>
  )
}
