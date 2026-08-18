import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'

vi.mock('@/lib/ai/ratelimit', () => ({
  checkAIRateLimit: vi.fn(),
}))

vi.mock('@/lib/ai/openrouter', () => ({
  getOpenRouterModel: vi.fn(),
}))

vi.mock('@/lib/ai/context', () => ({
  buildSystemPrompt: vi.fn(),
}))

vi.mock('ai', () => ({
  streamText: vi.fn(),
}))

import { checkAIRateLimit } from '@/lib/ai/ratelimit'
import { getOpenRouterModel } from '@/lib/ai/openrouter'
import { buildSystemPrompt } from '@/lib/ai/context'
import { streamText } from 'ai'

describe('AI Route Handler: POST /api/ai', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 429 when rate limit is exceeded', async () => {
    vi.mocked(checkAIRateLimit).mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 60000,
    })

    const req = new Request('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Halo' }] }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(429)

    const data = await res.json()
    expect(data.error).toContain('maximum message limit')
  })

  it('returns 400 when messages array is missing or empty', async () => {
    vi.mocked(checkAIRateLimit).mockResolvedValueOnce({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60000,
    })

    const req = new Request('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({ messages: [] }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(400)

    const data = await res.json()
    expect(data.error).toContain('Invalid or missing messages')
  })

  it('returns 503 when OpenRouter API key is not configured', async () => {
    vi.mocked(checkAIRateLimit).mockResolvedValueOnce({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60000,
    })

    vi.mocked(getOpenRouterModel).mockResolvedValueOnce({
      model: null,
      apiKey: null,
      modelId: 'nvidia/nemotron-3.5-lightning:free',
    })

    const req = new Request('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Halo' }] }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(503)

    const data = await res.json()
    expect(data.error).toContain('API key not configured')
  })

  it('streams response when request is valid and API key is present', async () => {
    vi.mocked(checkAIRateLimit).mockResolvedValueOnce({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60000,
    })

    vi.mocked(getOpenRouterModel).mockResolvedValueOnce({
      model: { id: 'test-model' },
      apiKey: 'sk-test',
      modelId: 'nvidia/nemotron-3.5-lightning:free',
    })

    vi.mocked(buildSystemPrompt).mockResolvedValueOnce('System prompt')

    const mockToTextStreamResponse = vi.fn().mockReturnValue(
      new Response('streamed text chunk', {
        status: 200,
        headers: { 'X-AI-Model': 'nvidia/nemotron-3.5-lightning:free' },
      }),
    )

    vi.mocked(streamText).mockReturnValue({
      toTextStreamResponse: mockToTextStreamResponse,
    } as unknown as ReturnType<typeof streamText>)

    const req = new Request('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Ceritakan tentang Dhani' }],
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockToTextStreamResponse).toHaveBeenCalled()

    const text = await res.text()
    expect(text).toBe('streamed text chunk')
  })
})
