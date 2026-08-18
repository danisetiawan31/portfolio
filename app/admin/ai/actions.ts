// app/admin/ai/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth-guard'
import { DEFAULT_AI_MODEL } from './constants'

export type AIActionResult = {
  errors?: Record<string, string>
  success?: boolean
  message?: string
}

/**
 * Server Action: Updates AI assistant configuration, API key, model, and CV text knowledge.
 */
export async function updateAISettingsAction(
  _prevState: AIActionResult | null,
  formData: FormData,
): Promise<AIActionResult> {
  try {
    // 1. Auth Guard
    await requireAuth()

    const apiKey =
      (formData.get('openrouter_api_key') as string)?.trim() || null
    const model =
      (formData.get('ai_model') as string)?.trim() || DEFAULT_AI_MODEL
    const cvTextContent =
      (formData.get('cv_text_content') as string)?.trim() || null
    const customInstructions =
      (formData.get('custom_instructions') as string)?.trim() || null

    const supabaseAdmin = createServiceRoleClient()

    const { error: dbError } = await supabaseAdmin
      .from('profile_settings')
      .upsert({
        id: 'singleton',
        openrouter_api_key: apiKey,
        ai_model: model,
        cv_text_content: cvTextContent,
        custom_instructions: customInstructions,
        updated_at: new Date().toISOString(),
      })

    if (dbError) {
      return { errors: { root: dbError.message } }
    }

    // Revalidate paths
    revalidatePath('/admin')
    revalidatePath('/admin/ai')
    revalidatePath('/')

    return {
      success: true,
      message: 'AI Assistant settings updated successfully.',
    }
  } catch (err) {
    return {
      errors: {
        root: err instanceof Error ? err.message : 'Unexpected error.',
      },
    }
  }
}
