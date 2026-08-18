import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateAISettingsAction } from './actions'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/supabase/auth-guard', () => ({
  requireAuth: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: vi.fn(),
}))

import { requireAuth } from '@/lib/supabase/auth-guard'
import { createServiceRoleClient } from '@/lib/supabase/server'

describe('Admin AI Settings: updateAISettingsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests', async () => {
    vi.mocked(requireAuth).mockRejectedValueOnce(new Error('Unauthorized'))

    const formData = new FormData()
    const result = await updateAISettingsAction(null, formData)

    expect(result.errors?.root).toBe('Unauthorized')
  })

  it('updates AI settings with provided form data', async () => {
    vi.mocked(requireAuth).mockResolvedValueOnce()

    const upsertMock = vi.fn().mockResolvedValueOnce({ error: null })
    vi.mocked(createServiceRoleClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        upsert: upsertMock,
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>)

    const formData = new FormData()
    formData.append('openrouter_api_key', 'sk-or-v1-testkey123')
    formData.append('ai_model', 'nvidia/nemotron-3.5-lightning:free')
    formData.append('cv_text_content', 'Experienced Fullstack Engineer...')
    formData.append('custom_instructions', 'Always speak professionally.')

    const result = await updateAISettingsAction(null, formData)

    expect(result.success).toBe(true)
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'singleton',
        openrouter_api_key: 'sk-or-v1-testkey123',
        ai_model: 'nvidia/nemotron-3.5-lightning:free',
        cv_text_content: 'Experienced Fullstack Engineer...',
        custom_instructions: 'Always speak professionally.',
      }),
    )
  })

  it('returns database error if upsert fails', async () => {
    vi.mocked(requireAuth).mockResolvedValueOnce()

    const upsertMock = vi.fn().mockResolvedValueOnce({
      error: { message: 'Database connection failed' },
    })
    vi.mocked(createServiceRoleClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        upsert: upsertMock,
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>)

    const formData = new FormData()
    formData.append('ai_model', 'nvidia/nemotron-3.5-lightning:free')

    const result = await updateAISettingsAction(null, formData)

    expect(result.errors?.root).toBe('Database connection failed')
  })
})
