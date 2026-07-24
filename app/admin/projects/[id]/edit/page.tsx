// app/(admin)/admin/projects/[id]/edit/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { ProjectForm } from '../../_components/project-form'

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params
  const supabase = createServiceRoleClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <div>
        <Link
          href="/admin/projects"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
