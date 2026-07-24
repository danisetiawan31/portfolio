// app/admin/certificates/actions.ts

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth-guard'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BUCKET = 'thumbnails'
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

type ActionResult = { errors?: Record<string, string>; success?: boolean }

// ---------------------------------------------------------------------------
// Shared validation
// ---------------------------------------------------------------------------

function validateCertificateForm(formData: FormData): ActionResult | null {
  const errors: Record<string, string> = {}

  if (!formData.get('title')?.toString().trim()) {
    errors.title = 'Title is required.'
  }
  if (!formData.get('issuer')?.toString().trim()) {
    errors.issuer = 'Issuer is required.'
  }
  if (!formData.get('issue_date')?.toString().trim()) {
    errors.issue_date = 'Issue date is required.'
  }

  return Object.keys(errors).length ? { errors } : null
}

// ---------------------------------------------------------------------------
// Thumbnail upload
// ---------------------------------------------------------------------------

async function uploadImage(
  file: File,
  pathPrefix: string,
): Promise<{ url: string } | { error: string }> {
  if (file.size === 0) return { error: '' } // treated as "no file"
  if (file.size > MAX_BYTES) return { error: 'Image must be under 10 MB.' }
  if (!ALLOWED_MIME.includes(file.type)) {
    return { error: 'Image must be a JPEG, PNG, or WebP.' }
  }

  const supabaseStorage = createServiceRoleClient()
  const ext = file.type.split('/')[1]
  const path = `${pathPrefix}-${Date.now()}.${ext}`

  const { error } = await supabaseStorage.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true })

  if (error) return { error: error.message }

  const { data } = supabaseStorage.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl }
}

/** Deletes a stored image given its full public URL. */
async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const supabaseStorage = createServiceRoleClient()
    const marker = `/object/public/${BUCKET}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return
    const path = url.slice(idx + marker.length)
    await supabaseStorage.storage.from(BUCKET).remove([path])
  } catch {
    // Non-fatal
  }
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function createCertificate(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  try {
    await requireAuth()
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Unauthorized',
      },
    }
  }

  const validation = validateCertificateForm(formData)
  if (validation) return validation

  const supabase = createServiceRoleClient()

  // Generate a safe prefix for the image
  const titleRaw = formData.get('title') as string
  const filePrefix =
    titleRaw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'cert'

  let image_url: string | null = null
  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, filePrefix)
    if ('error' in result && result.error) {
      return { errors: { image: result.error } }
    }
    if ('url' in result) image_url = result.url
  }

  const { error } = await supabase.from('certificates').insert({
    title: titleRaw.trim(),
    issuer: (formData.get('issuer') as string).trim(),
    issue_date: formData.get('issue_date') as string,
    image_url,
    credential_url: (formData.get('credential_url') as string)?.trim() || null,
    is_featured: formData.get('is_featured') === 'on',
    display_order: parseInt(
      (formData.get('display_order') as string) || '0',
      10,
    ),
  })

  if (error) return { errors: { _form: error.message } }

  revalidatePath('/admin/certificates')
  revalidatePath('/')
  return { success: true }
}

export async function updateCertificate(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  try {
    await requireAuth()
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Unauthorized',
      },
    }
  }

  const validation = validateCertificateForm(formData)
  if (validation) return validation

  const supabase = createServiceRoleClient()

  const { data: existing } = await supabase
    .from('certificates')
    .select('image_url')
    .eq('id', id)
    .single()

  let image_url: string | null = existing?.image_url ?? null
  const imageFile = formData.get('image') as File | null

  const titleRaw = formData.get('title') as string
  const filePrefix =
    titleRaw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'cert'

  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, filePrefix)
    if ('error' in result && result.error) {
      return { errors: { image: result.error } }
    }
    if ('url' in result) {
      image_url = result.url
      // Delete old image only after new upload succeeds
      if (existing?.image_url) {
        await deleteImageByUrl(existing.image_url)
      }
    }
  }

  const { error } = await supabase
    .from('certificates')
    .update({
      title: titleRaw.trim(),
      issuer: (formData.get('issuer') as string).trim(),
      issue_date: formData.get('issue_date') as string,
      image_url,
      credential_url:
        (formData.get('credential_url') as string)?.trim() || null,
      is_featured: formData.get('is_featured') === 'on',
      display_order: parseInt(
        (formData.get('display_order') as string) || '0',
        10,
      ),
    })
    .eq('id', id)

  if (error) return { errors: { _form: error.message } }

  revalidatePath('/admin/certificates')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCertificate(id: string): Promise<void> {
  await requireAuth()

  const supabase = createServiceRoleClient()

  const { data } = await supabase
    .from('certificates')
    .select('image_url')
    .eq('id', id)
    .single()

  if (data?.image_url) {
    await deleteImageByUrl(data.image_url)
  }

  await supabase.from('certificates').delete().eq('id', id)

  redirect('/admin/certificates')
}
