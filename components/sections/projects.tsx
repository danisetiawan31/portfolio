// components/sections/projects.tsx
// Server Component ringan — hanya menyediakan data + render ProjectCard
// untuk proyek ke-4 dan seterusnya (index >= 3) di luar area transisi Hero.
// Untuk 3 card pertama, rendering sudah diurus oleh HeroProjectsTransition.

import {
  getPublicProjects,
  type Project,
} from '@/lib/supabase/queries/projects'
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
// Digunakan sebagai fallback / standalone jika HeroProjectsTransition tidak ada.
// Dalam setup normal, section ini tidak dirender di page.tsx karena
// seluruh projects sudah diurus oleh HeroProjectsTransition.

export default async function ProjectsSection() {
  const projects = await getPublicProjects()
  const isEmpty = projects.length === 0

  return (
    <SectionContainer id="projects">
      <SectionHeader
        title="Latest Projects"
        subtitle="A selection of things I've built."
      />

      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}

      {!isEmpty && (
        <div className="mt-16 flex justify-center">
          <a
            href="#"
            className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-base font-medium transition-colors"
          >
            <span className="decoration-muted-foreground/30 group-hover:decoration-foreground underline underline-offset-4 transition-colors">
              View all my projects
            </span>
          </a>
        </div>
      )}
    </SectionContainer>
  )
}
