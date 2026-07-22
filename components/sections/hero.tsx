// components/sections/hero.tsx
import { getPublicProjects } from '@/lib/supabase/queries/projects'
import HeroClient from './hero-client'

export default async function HeroSection() {
  const projects = await getPublicProjects()

  return <HeroClient projects={projects} />
}
