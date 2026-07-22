// app/admin/skills/actions.ts

'use server'

import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth-guard'
import { VALID_CATEGORIES, type CategoryType } from './constants'

export type ActionResult = { errors: Record<string, string> }

// ---------------------------------------------------------------------------
// Shared validation
// ---------------------------------------------------------------------------

function validateSkillForm(formData: FormData): ActionResult | null {
  const errors: Record<string, string> = {}

  if (!formData.get('name')?.toString().trim()) {
    errors.name = 'Name is required.'
  }

  if (!formData.get('context')?.toString().trim()) {
    errors.context = 'Context is required.'
  }

  const category = formData.get('category')?.toString().trim() as CategoryType
  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.category = 'Valid category is required.'
  }

  return Object.keys(errors).length ? { errors } : null
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function createSkill(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  const validation = validateSkillForm(formData)
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

  const iconRaw = formData.get('icon')?.toString().trim()
  const icon = iconRaw || null

  const { error } = await supabase.from('skills').insert({
    name: (formData.get('name') as string).trim(),
    category: (formData.get('category') as string).trim(),
    context: (formData.get('context') as string).trim(),
    icon,
    display_order: 0,
  })

  if (error) return { errors: { _form: error.message } }

  try {
    redirect('/admin/skills')
  } catch (err) {
    if (isRedirectError(err)) throw err
    return { errors: { _form: 'Failed to redirect.' } }
  }
}

export async function updateSkill(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  const validation = validateSkillForm(formData)
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

  const iconRaw = formData.get('icon')?.toString().trim()
  const icon = iconRaw || null

  const { error } = await supabase
    .from('skills')
    .update({
      name: (formData.get('name') as string).trim(),
      category: (formData.get('category') as string).trim(),
      context: (formData.get('context') as string).trim(),
      icon,
    })
    .eq('id', id)

  if (error) return { errors: { _form: error.message } }

  try {
    redirect('/admin/skills')
  } catch (err) {
    if (isRedirectError(err)) throw err
    return { errors: { _form: 'Failed to redirect.' } }
  }
}

export async function deleteSkill(id: string): Promise<void> {
  await requireAuth()

  const supabase = createServiceRoleClient()

  await supabase.from('skills').delete().eq('id', id)

  redirect('/admin/skills')
}
