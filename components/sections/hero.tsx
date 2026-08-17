// components/sections/hero.tsx
import { getPublicProjects } from '@/lib/supabase/queries/projects'
import { getProfileSettings } from '@/lib/supabase/queries/profile'
import HeroClient from './hero-client'

export default async function HeroSection() {
  const [projects, profileSettings] = await Promise.all([
    getPublicProjects(),
    getProfileSettings(),
  ])

  return (
    <HeroClient
      projects={projects}
      cvUrl={profileSettings?.cv_url}
      cvFileName={profileSettings?.cv_file_name}
    />
  )
}
