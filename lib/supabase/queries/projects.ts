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
