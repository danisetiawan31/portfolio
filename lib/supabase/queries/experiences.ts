// lib/supabase/queries/experiences.ts

import { createClient } from '@/lib/supabase/server'
import { type Tables } from '@/types/database'

export type Experience = Tables<'experiences'>

export async function getPublicExperiences(): Promise<Experience[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[getPublicExperiences]', error.message)
    return []
  }

  return data ?? []
}
