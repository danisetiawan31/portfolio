// app/admin/experiences/new/page.tsx

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ExperienceForm } from '../_components/experience-form'

export default function NewExperiencePage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <div>
        <Link
          href="/admin/experiences"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Experiences
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">New Experience</h1>
      </div>
      <ExperienceForm />
    </main>
  )
}
