// app/admin/projects/actions.ts

'use server'

import { redirect } from 'next/navigation'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth-guard'
import { parseTechStack } from '@/lib/utils/parse-tech-stack'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BUCKET = 'thumbnails'
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

/** Validates and normalises a slug input. Returns an error string or null. */
function validateSlug(raw: string): { slug: string } | { error: string } {
  const slug = raw.trim().toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      error:
        'Slug must be lowercase letters, numbers, and hyphens only (no leading/trailing hyphens).',
    }
  }
  return { slug }
}

type ActionResult = { errors: Record<string, string> }

// ---------------------------------------------------------------------------
// Shared validation
// ---------------------------------------------------------------------------

function validateProjectForm(formData: FormData): ActionResult | null {
  const errors: Record<string, string> = {}

  if (!formData.get('title')?.toString().trim()) {
    errors.title = 'Title is required.'
  }
  if (!formData.get('slug')?.toString().trim()) {
    errors.slug = 'Slug is required.'
  } else {
    const result = validateSlug(formData.get('slug') as string)
    if ('error' in result) errors.slug = result.error
  }
  if (!formData.get('description')?.toString().trim()) {
    errors.description = 'Description is required.'
  }
  if (!formData.get('tech_stack')?.toString().trim()) {
    errors.tech_stack = 'At least one technology is required.'
  }

  return Object.keys(errors).length ? { errors } : null
}

// ---------------------------------------------------------------------------
// Thumbnail upload
// ---------------------------------------------------------------------------

async function uploadThumbnail(
  file: File,
  pathPrefix: string,
): Promise<{ url: string } | { error: string }> {
  if (file.size === 0) return { error: '' } // treated as "no file"
  if (file.size > MAX_BYTES) return { error: 'Thumbnail must be under 10 MB.' }
  if (!ALLOWED_MIME.includes(file.type)) {
    return { error: 'Thumbnail must be a JPEG, PNG, or WebP image.' }
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

/** Deletes a stored thumbnail given its full public URL. */
async function deleteThumbnailByUrl(url: string): Promise<void> {
  try {
    const supabaseStorage = createServiceRoleClient()
    // Extract the storage path from the public URL
    const marker = `/object/public/${BUCKET}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return
    const path = url.slice(idx + marker.length)
    await supabaseStorage.storage.from(BUCKET).remove([path])
  } catch {
    // Non-fatal — log silently in production
  }
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function createProject(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  const validation = validateProjectForm(formData)
  if (validation) return validation

  try {
    await requireAuth()
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Unauthorized',
      },
    }
  }

  const supabase = createServiceRoleClient()

  const slugRaw = formData.get('slug') as string
  const slugResult = validateSlug(slugRaw)
  if ('error' in slugResult) return { errors: { slug: slugResult.error } }

  let thumbnail_url: string | null = null
  const thumbFile = formData.get('thumbnail') as File | null
  if (thumbFile && thumbFile.size > 0) {
    const result = await uploadThumbnail(thumbFile, slugResult.slug)
    if ('error' in result && result.error) {
      return { errors: { thumbnail: result.error } }
    }
    if ('url' in result) thumbnail_url = result.url
  }

  const { error } = await supabase.from('projects').insert({
    title: (formData.get('title') as string).trim(),
    slug: slugResult.slug,
    description: (formData.get('description') as string).trim(),
    tech_stack: parseTechStack(formData.get('tech_stack') as string),
    thumbnail_url,
    live_url: (formData.get('live_url') as string)?.trim() || null,
    github_url: (formData.get('github_url') as string)?.trim() || null,
    is_featured: formData.get('is_featured') === 'on',
    display_order: parseInt(
      (formData.get('display_order') as string) || '0',
      10,
    ),
  })

  if (error) return { errors: { _form: error.message } }

  redirect('/admin/projects')
}

export async function updateProject(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  const validation = validateProjectForm(formData)
  if (validation) return validation

  try {
    await requireAuth()
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Unauthorized',
      },
    }
  }

  const supabase = createServiceRoleClient()

  const slugRaw = formData.get('slug') as string
  const slugResult = validateSlug(slugRaw)
  if ('error' in slugResult) return { errors: { slug: slugResult.error } }

  // Fetch existing row to handle thumbnail replacement
  const { data: existing } = await supabase
    .from('projects')
    .select('thumbnail_url')
    .eq('id', id)
    .single()

  let thumbnail_url: string | null = existing?.thumbnail_url ?? null
  const thumbFile = formData.get('thumbnail') as File | null
  if (thumbFile && thumbFile.size > 0) {
    // Delete old thumbnail if present
    if (existing?.thumbnail_url) {
      await deleteThumbnailByUrl(existing.thumbnail_url)
    }
    const result = await uploadThumbnail(thumbFile, slugResult.slug)
    if ('error' in result && result.error) {
      return { errors: { thumbnail: result.error } }
    }
    if ('url' in result) thumbnail_url = result.url
  }

  const { error } = await supabase
    .from('projects')
    .update({
      title: (formData.get('title') as string).trim(),
      slug: slugResult.slug,
      description: (formData.get('description') as string).trim(),
      tech_stack: parseTechStack(formData.get('tech_stack') as string),
      thumbnail_url,
      live_url: (formData.get('live_url') as string)?.trim() || null,
      github_url: (formData.get('github_url') as string)?.trim() || null,
      is_featured: formData.get('is_featured') === 'on',
      display_order: parseInt(
        (formData.get('display_order') as string) || '0',
        10,
      ),
    })
    .eq('id', id)

  if (error) return { errors: { _form: error.message } }

  redirect('/admin/projects')
}

export async function deleteProject(id: string): Promise<void> {
  await requireAuth()

  const supabase = createServiceRoleClient()

  // Fetch thumbnail URL before deleting the row
  const { data } = await supabase
    .from('projects')
    .select('thumbnail_url')
    .eq('id', id)
    .single()

  if (data?.thumbnail_url) {
    await deleteThumbnailByUrl(data.thumbnail_url)
  }

  await supabase.from('projects').delete().eq('id', id)

  redirect('/admin/projects')
}
