// lib/supabase/queries/projects.ts

import { createClient } from '@/lib/supabase/server'
import { type Tables } from '@/types/database'

export type Project = Tables<'projects'>

export async function getPublicProjects(): Promise<Project[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[getPublicProjects]', error.message)
    return []
  }

  return data ?? []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(`[getProjectBySlug] ${slug}:`, error.message)
    return null
  }

  return data
}

export async function getAdjacentProjects(currentSlug: string): Promise<{
  prev: Project | null
  next: Project | null
}> {
  const projects = await getPublicProjects()
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null
  const next =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  return { prev, next }
}
