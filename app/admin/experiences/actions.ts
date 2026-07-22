// app/admin/experiences/actions.ts

'use server'

import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth-guard'
import { parseTechStack } from '@/lib/utils/parse-tech-stack'

import { VALID_TYPES, type ExperienceType } from './constants'

export type ActionResult = { errors: Record<string, string> }

// ---------------------------------------------------------------------------
// Shared validation
// ---------------------------------------------------------------------------

function validateExperienceForm(formData: FormData): ActionResult | null {
  const errors: Record<string, string> = {}

  if (!formData.get('company')?.toString().trim()) {
    errors.company = 'Company is required.'
  }

  if (!formData.get('role')?.toString().trim()) {
    errors.role = 'Role is required.'
  }

  if (!formData.get('description')?.toString().trim()) {
    errors.description = 'Description is required.'
  }

  const type = formData.get('type')?.toString().trim() as ExperienceType
  if (!type || !VALID_TYPES.includes(type)) {
    errors.type = 'Valid experience type is required.'
  }

  if (!formData.get('start_date')?.toString().trim()) {
    errors.start_date = 'Start date is required.'
  }

  const isCurrent = formData.get('is_current') === 'on'
  const endDateStr = formData.get('end_date')?.toString().trim()
  const endDate = endDateStr ? endDateStr : null

  if (isCurrent && endDate !== null) {
    errors.end_date = 'End date must be empty if this is a current position.'
  }

  return Object.keys(errors).length ? { errors } : null
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function createExperience(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  const validation = validateExperienceForm(formData)
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

  const is_current = formData.get('is_current') === 'on'
  const endDateRaw = formData.get('end_date')?.toString().trim()
  const end_date = is_current ? null : endDateRaw || null

  const { error } = await supabase.from('experiences').insert({
    company: (formData.get('company') as string).trim(),
    role: (formData.get('role') as string).trim(),
    description: (formData.get('description') as string).trim(),
    type: formData.get('type') as string,
    tech_stack: parseTechStack((formData.get('tech_stack') as string) || ''),
    start_date: formData.get('start_date') as string,
    end_date,
    is_current,
    display_order: 0,
  })

  if (error) return { errors: { _form: error.message } }

  try {
    redirect('/admin/experiences')
  } catch (err) {
    if (isRedirectError(err)) throw err
    return { errors: { _form: 'Failed to redirect.' } }
  }
}

export async function updateExperience(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  const validation = validateExperienceForm(formData)
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

  const is_current = formData.get('is_current') === 'on'
  const endDateRaw = formData.get('end_date')?.toString().trim()
  const end_date = is_current ? null : endDateRaw || null

  const { error } = await supabase
    .from('experiences')
    .update({
      company: (formData.get('company') as string).trim(),
      role: (formData.get('role') as string).trim(),
      description: (formData.get('description') as string).trim(),
      type: formData.get('type') as string,
      tech_stack: parseTechStack((formData.get('tech_stack') as string) || ''),
      start_date: formData.get('start_date') as string,
      end_date,
      is_current,
    })
    .eq('id', id)

  if (error) return { errors: { _form: error.message } }

  try {
    redirect('/admin/experiences')
  } catch (err) {
    if (isRedirectError(err)) throw err
    return { errors: { _form: 'Failed to redirect.' } }
  }
}

export async function deleteExperience(id: string): Promise<void> {
  await requireAuth()

  const supabase = createServiceRoleClient()

  await supabase.from('experiences').delete().eq('id', id)

  redirect('/admin/experiences')
}
