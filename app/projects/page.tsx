import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPublicProjects } from '@/lib/supabase/queries/projects'
import { ProjectCard } from '@/components/sections/project-card'
import { SectionContainer } from '@/components/common/section-container'
import { SectionHeader } from '@/components/common/section-header'
import { EmptyState } from '@/components/sections/projects'

export const metadata: Metadata = {
  title: 'All Projects - Dhani Setiawan',
  description: 'A comprehensive list of all my selected projects and works.',
}

export default async function ProjectsPage() {
  const projects = await getPublicProjects()
  const isEmpty = projects.length === 0

  return (
    <div className="pt-12">
      <SectionContainer id="all-projects" className="!pt-0">
        <div className="mb-8">
          <Link
            href="/#projects"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <SectionHeader
          title="All Projects"
          subtitle="A comprehensive list of everything I've built."
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
      </SectionContainer>
    </div>
  )
}
