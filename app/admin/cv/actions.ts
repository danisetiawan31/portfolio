// app/admin/cv/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth-guard'
import { CV_BUCKET, CV_ALLOWED_MIME, CV_MAX_BYTES } from './constants'

export type ActionResult = {
  errors?: Record<string, string>
  success?: boolean
  message?: string
}

/** Deletes a stored CV file given its full public URL. */
async function deleteCVByUrl(url: string): Promise<void> {
  try {
    const supabaseAdmin = createServiceRoleClient()
    const marker = `/object/public/${CV_BUCKET}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return
    const path = url.slice(idx + marker.length)
    await supabaseAdmin.storage.from(CV_BUCKET).remove([path])
  } catch {
    // Non-fatal — log silently
  }
}

/** Server Action: Upload a new CV PDF and auto-replace the existing one. */
export async function uploadCVAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    // 1. Defense-in-depth auth guard
    await requireAuth()

    const file = formData.get('cv_file') as File | null

    if (!file || file.size === 0) {
      return { errors: { cv_file: 'Please select a PDF file to upload.' } }
    }

    if (file.size > CV_MAX_BYTES) {
      return { errors: { cv_file: 'CV file must be under 10 MB.' } }
    }

    if (!CV_ALLOWED_MIME.includes(file.type)) {
      return { errors: { cv_file: 'Only PDF files (.pdf) are allowed.' } }
    }

    const supabaseAdmin = createServiceRoleClient()

    // 2. Fetch existing profile settings to clean up old CV if present
    const { data: existingSettings } = await supabaseAdmin
      .from('profile_settings')
      .select('cv_url')
      .eq('id', 'singleton')
      .maybeSingle()

    if (existingSettings?.cv_url) {
      await deleteCVByUrl(existingSettings.cv_url)
    }

    // 3. Upload new CV file to storage
    const path = `cv-${Date.now()}.pdf`
    const { error: uploadError } = await supabaseAdmin.storage
      .from(CV_BUCKET)
      .upload(path, file, { contentType: 'application/pdf', upsert: true })

    if (uploadError) {
      return { errors: { root: uploadError.message } }
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(CV_BUCKET)
      .getPublicUrl(path)
    const newCvUrl = publicUrlData.publicUrl

    // 4. Upsert singleton profile_settings row
    const { error: dbError } = await supabaseAdmin
      .from('profile_settings')
      .upsert({
        id: 'singleton',
        cv_url: newCvUrl,
        cv_file_name: file.name,
        updated_at: new Date().toISOString(),
      })

    if (dbError) {
      return { errors: { root: dbError.message } }
    }

    // 5. Revalidate cache for admin and public pages
    revalidatePath('/admin')
    revalidatePath('/')

    return {
      success: true,
      message: 'CV uploaded successfully.',
    }
  } catch (err) {
    return {
      errors: {
        root: err instanceof Error ? err.message : 'Unexpected error.',
      },
    }
  }
}

/** Server Action: Delete the current CV file. */
export async function deleteCVAction(): Promise<ActionResult> {
  try {
    await requireAuth()

    const supabaseAdmin = createServiceRoleClient()

    const { data: existingSettings } = await supabaseAdmin
      .from('profile_settings')
      .select('cv_url')
      .eq('id', 'singleton')
      .maybeSingle()

    if (existingSettings?.cv_url) {
      await deleteCVByUrl(existingSettings.cv_url)
    }

    const { error: dbError } = await supabaseAdmin
      .from('profile_settings')
      .upsert({
        id: 'singleton',
        cv_url: null,
        cv_file_name: null,
        updated_at: new Date().toISOString(),
      })

    if (dbError) {
      return { errors: { root: dbError.message } }
    }

    revalidatePath('/admin')
    revalidatePath('/')

    return {
      success: true,
      message: 'CV deleted successfully.',
    }
  } catch (err) {
    return {
      errors: {
        root: err instanceof Error ? err.message : 'Unexpected error.',
      },
    }
  }
}
