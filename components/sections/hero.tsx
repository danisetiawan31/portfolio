// components/sections/hero.tsx
import { getPublicProjects } from '@/lib/supabase/queries/projects'
import { getPublicSkills } from '@/lib/supabase/queries/skills'
import { getProfileSettings } from '@/lib/supabase/queries/profile'
import HeroClient from './hero-client'

export default async function HeroSection() {
  const [projects, skills, profileSettings] = await Promise.all([
    getPublicProjects(),
    getPublicSkills(),
    getProfileSettings(),
  ])

  return (
    <HeroClient
      projects={projects}
      skills={skills}
      cvUrl={profileSettings?.cv_url}
      cvFileName={profileSettings?.cv_file_name}
    />
  )
}
