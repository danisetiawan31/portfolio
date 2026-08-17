// app/admin/cv/page.tsx

import { getProfileSettings } from '@/lib/supabase/queries/profile'
import { CVForm } from './_components/cv-form'

export default async function AdminCVPage() {
  const profileSettings = await getProfileSettings()

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          CV / Resume Management
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage the public CV document available for recruiters and visitors on
          your portfolio.
        </p>
      </div>

      <CVForm initialSettings={profileSettings} />
    </div>
  )
}
