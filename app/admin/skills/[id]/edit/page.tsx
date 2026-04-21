// app/admin/skills/[id]/edit/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { SkillForm } from '../../_components/skill-form'

interface EditSkillPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params
  const supabase = createServiceRoleClient()

  const { data: skill, error } = await supabase
    .from('skills')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !skill) notFound()

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <div>
        <Link
          href="/admin/skills"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Skills
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Skill</h1>
      </div>
      <SkillForm skill={skill} />
    </main>
  )
}
