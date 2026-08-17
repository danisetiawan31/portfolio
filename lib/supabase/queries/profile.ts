// lib/supabase/queries/profile.ts

import { createClient } from '@/lib/supabase/server'
import { type Tables } from '@/types/database'

export type ProfileSettings = Tables<'profile_settings'>

export async function getProfileSettings(): Promise<ProfileSettings | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profile_settings')
    .select('*')
    .eq('id', 'singleton')
    .maybeSingle()

  if (error) {
    console.error('[getProfileSettings]', error.message)
    return null
  }

  return data
}
