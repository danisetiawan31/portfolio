// app/admin/projects/new/page.tsx

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProjectForm } from '../_components/project-form'

export default function NewProjectPage() {
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
        <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
      </div>
      <ProjectForm />
    </div>
  )
}
