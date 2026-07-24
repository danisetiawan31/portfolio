// app/admin/experiences/[id]/edit/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { ExperienceForm } from '../../_components/experience-form'

interface EditExperiencePageProps {
  params: Promise<{ id: string }>
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const { id } = await params
  const supabase = createServiceRoleClient()

  const { data: experience, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !experience) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <div>
        <Link
          href="/admin/experiences"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Experiences
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Experience</h1>
      </div>
      <ExperienceForm experience={experience} />
    </div>
  )
}
