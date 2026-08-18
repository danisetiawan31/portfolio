// app/api/ai/route.ts

import { streamText } from 'ai'
import { getOpenRouterModel } from '@/lib/ai/openrouter'
import { buildSystemPrompt } from '@/lib/ai/context'
import { checkAIRateLimit } from '@/lib/ai/ratelimit'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // 1. Extract IP for rate limiting
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      'anonymous-ip'

    // 2. Enforce rate limiting
    const rateLimit = await checkAIRateLimit(ip)
    if (!rateLimit.success) {
      return new Response(
        JSON.stringify({
          error:
            'You have reached the maximum message limit for now. Please wait a few minutes before trying again.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.reset),
          },
        },
      )
    }

    // 3. Parse chat messages
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Invalid or missing messages in request body.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // 4. Resolve OpenRouter Model & API Key
    const { model, apiKey, modelId } = await getOpenRouterModel()

    if (!model || !apiKey) {
      return new Response(
        JSON.stringify({
          error:
            'AI Assistant is currently offline (API key not configured in Admin CMS or .env). Please contact Dhani directly via the Contact section.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // 5. Build dynamic system context
    const systemPrompt = await buildSystemPrompt()

    // 6. Stream AI response
    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      temperature: 0.7,
    })

    return result.toTextStreamResponse({
      headers: {
        'X-AI-Model': modelId,
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    })
  } catch (error) {
    console.error('[AI Route Error]:', error)
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while communicating with the AI assistant.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
