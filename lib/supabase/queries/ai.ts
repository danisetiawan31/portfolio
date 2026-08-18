// lib/supabase/queries/ai.ts

import { createServiceRoleClient } from '@/lib/supabase/server'
import { type Tables } from '@/types/database'

export type AISettings = Pick<
  Tables<'profile_settings'>,
  | 'openrouter_api_key'
  | 'ai_model'
  | 'cv_text_content'
  | 'custom_instructions'
  | 'cv_file_name'
  | 'cv_url'
  | 'updated_at'
>

/**
 * Fetches AI settings for server-side operations (Admin CMS and /api/ai route handler).
 * Uses service role to securely access sensitive configuration (API keys).
 */
export async function getAISettings(): Promise<AISettings | null> {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('profile_settings')
    .select(
      'openrouter_api_key, ai_model, cv_text_content, custom_instructions, cv_file_name, cv_url, updated_at',
    )
    .eq('id', 'singleton')
    .maybeSingle()

  if (error) {
    console.error('[getAISettings]', error.message)
    return null
  }

  return data
}
