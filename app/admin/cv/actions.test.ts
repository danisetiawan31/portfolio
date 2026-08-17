import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadCVAction, deleteCVAction } from './actions'

// Mock dependencies
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

describe('Backend Server Actions: CV Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('uploadCVAction', () => {
    it('throws error when user is unauthenticated', async () => {
      vi.mocked(requireAuth).mockRejectedValueOnce(new Error('Unauthorized'))

      const formData = new FormData()
      const result = await uploadCVAction(null, formData)

      expect(result.errors?.root).toBe('Unauthorized')
    })

    it('rejects upload when no file is selected or file is empty', async () => {
      vi.mocked(requireAuth).mockResolvedValueOnce()

      const formData = new FormData()
      const result = await uploadCVAction(null, formData)

      expect(result.errors?.cv_file).toBe('Please select a PDF file to upload.')
    })

    it('rejects files exceeding 10MB limit', async () => {
      vi.mocked(requireAuth).mockResolvedValueOnce()

      const largeContent = new Uint8Array(11 * 1024 * 1024) // 11MB
      const largeFile = new File([largeContent], 'large.pdf', {
        type: 'application/pdf',
      })

      const formData = new FormData()
      formData.append('cv_file', largeFile)

      const result = await uploadCVAction(null, formData)
      expect(result.errors?.cv_file).toBe('CV file must be under 10 MB.')
    })

    it('rejects non-PDF files (e.g. PNG, DOCX, TXT)', async () => {
      vi.mocked(requireAuth).mockResolvedValueOnce()

      const pngFile = new File(['fake-png-content'], 'resume.png', {
        type: 'image/png',
      })

      const formData = new FormData()
      formData.append('cv_file', pngFile)

      const result = await uploadCVAction(null, formData)
      expect(result.errors?.cv_file).toBe('Only PDF files (.pdf) are allowed.')
    })

    it('successfully uploads valid PDF, cleans up old file, and upserts to database', async () => {
      vi.mocked(requireAuth).mockResolvedValueOnce()

      const mockStorageRemove = vi.fn().mockResolvedValue({ error: null })
      const mockStorageUpload = vi.fn().mockResolvedValue({ error: null })
      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: {
          publicUrl:
            'https://supabase.co/storage/v1/object/public/documents/cv-123.pdf',
        },
      })
      const mockUpsert = vi.fn().mockResolvedValue({ error: null })
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: {
          cv_url:
            'https://supabase.co/storage/v1/object/public/documents/cv-old.pdf',
        },
      })

      const mockSupabaseAdmin = {
        storage: {
          from: vi.fn().mockReturnValue({
            remove: mockStorageRemove,
            upload: mockStorageUpload,
            getPublicUrl: mockGetPublicUrl,
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: mockMaybeSingle,
            }),
          }),
          upsert: mockUpsert,
        }),
      }

      vi.mocked(createServiceRoleClient).mockReturnValue(
        mockSupabaseAdmin as unknown as ReturnType<
          typeof createServiceRoleClient
        >,
      )

      const validFile = new File(['%PDF-1.4...'], 'My_Custom_Resume.pdf', {
        type: 'application/pdf',
      })

      const formData = new FormData()
      formData.append('cv_file', validFile)

      const result = await uploadCVAction(null, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('CV uploaded successfully.')
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'singleton',
          cv_file_name: 'My_Custom_Resume.pdf',
          cv_url:
            'https://supabase.co/storage/v1/object/public/documents/cv-123.pdf',
        }),
      )
    })
  })

  describe('deleteCVAction', () => {
    it('deletes CV from storage and sets cv_url to null in database', async () => {
      vi.mocked(requireAuth).mockResolvedValueOnce()

      const mockStorageRemove = vi.fn().mockResolvedValue({ error: null })
      const mockUpsert = vi.fn().mockResolvedValue({ error: null })
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: {
          cv_url:
            'https://supabase.co/storage/v1/object/public/documents/cv-to-delete.pdf',
        },
      })

      const mockSupabaseAdmin = {
        storage: {
          from: vi.fn().mockReturnValue({
            remove: mockStorageRemove,
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: mockMaybeSingle,
            }),
          }),
          upsert: mockUpsert,
        }),
      }

      vi.mocked(createServiceRoleClient).mockReturnValue(
        mockSupabaseAdmin as unknown as ReturnType<
          typeof createServiceRoleClient
        >,
      )

      const result = await deleteCVAction()

      expect(result.success).toBe(true)
      expect(result.message).toBe('CV deleted successfully.')
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'singleton',
          cv_url: null,
          cv_file_name: null,
        }),
      )
    })
  })
})
