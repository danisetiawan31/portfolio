// lib/supabase/queries/skills.ts

import { createClient } from '@/lib/supabase/server'
import { type Tables } from '@/types/database'

export type Skill = Tables<'skills'>

export async function getPublicSkills(): Promise<Skill[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[getPublicSkills]', error.message)
    return []
  }

  return data ?? []
}
