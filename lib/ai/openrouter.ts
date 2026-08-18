// lib/ai/openrouter.ts

import { createOpenAI } from '@ai-sdk/openai'
import { getAISettings } from '@/lib/supabase/queries/ai'
import { DEFAULT_AI_MODEL } from '@/app/admin/ai/constants'

export type OpenRouterConfig = {
  model: ReturnType<ReturnType<typeof createOpenAI>> | null
  apiKey: string | null
  modelId: string
}

/**
 * Resolves dynamic OpenRouter configuration:
 * 1. Checks Supabase database (profile_settings.openrouter_api_key & ai_model)
 * 2. Falls back to environment variables (.env.local: OPENROUTER_API_KEY)
 */
export async function getOpenRouterModel(): Promise<OpenRouterConfig> {
  const settings = await getAISettings().catch(() => null)

  const apiKey =
    settings?.openrouter_api_key?.trim() ||
    process.env.OPENROUTER_API_KEY?.trim() ||
    null

  const modelId =
    settings?.ai_model?.trim() ||
    process.env.AI_MODEL?.trim() ||
    DEFAULT_AI_MODEL

  if (!apiKey) {
    return {
      model: null,
      apiKey: null,
      modelId,
    }
  }

  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    headers: {
      'HTTP-Referer': 'https://dhanisetiawan.my.id',
      'X-Title': 'Dhani Setiawan Portfolio AI Assistant',
    },
  })

  return {
    model: openrouter(modelId),
    apiKey,
    modelId,
  }
}
