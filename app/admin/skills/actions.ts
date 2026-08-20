// app/admin/skills/actions.ts

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth-guard'
import {
  VALID_CATEGORIES,
  type CategoryType,
  inferSkillCategory,
} from './constants'

export type ActionResult = { errors: Record<string, string> }

// ---------------------------------------------------------------------------
// Shared validation
// ---------------------------------------------------------------------------

function validateSkillForm(formData: FormData): ActionResult | null {
  const errors: Record<string, string> = {}

  if (!formData.get('name')?.toString().trim()) {
    errors.name = 'Name is required.'
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

  const isVisible = formData.get('is_visible') === 'on'

  const { error } = await supabase.from('skills').insert({
    name: (formData.get('name') as string).trim(),
    category: (formData.get('category') as string).trim(),
    is_visible: isVisible,
    display_order: 0,
  })

  if (error) return { errors: { _form: error.message } }

  revalidatePath('/admin/skills')
  revalidatePath('/')

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

  const isVisible = formData.get('is_visible') === 'on'

  const { error } = await supabase
    .from('skills')
    .update({
      name: (formData.get('name') as string).trim(),
      category: (formData.get('category') as string).trim(),
      is_visible: isVisible,
    })
    .eq('id', id)

  if (error) return { errors: { _form: error.message } }

  revalidatePath('/admin/skills')
  revalidatePath('/')

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

  revalidatePath('/admin/skills')
  revalidatePath('/')

  redirect('/admin/skills')
}

export type SyncSkillsResult = {
  success: boolean
  count: number
  added: string[]
  error?: string
}

export async function syncSkillsFromProjects(): Promise<SyncSkillsResult> {
  try {
    await requireAuth()
  } catch (error) {
    return {
      success: false,
      count: 0,
      added: [],
      error: error instanceof Error ? error.message : 'Unauthorized',
    }
  }

  const supabase = createServiceRoleClient()

  // 1. Get all projects with tech_stack
  const { data: projects, error: pError } = await supabase
    .from('projects')
    .select('tech_stack')

  if (pError) {
    return { success: false, count: 0, added: [], error: pError.message }
  }

  // 2. Extract unique tech stacks
  const allProjectTechs = new Set<string>()
  for (const p of projects || []) {
    if (Array.isArray(p.tech_stack)) {
      for (const t of p.tech_stack) {
        if (typeof t === 'string' && t.trim()) {
          allProjectTechs.add(t.trim())
        }
      }
    }
  }

  if (allProjectTechs.size === 0) {
    return { success: true, count: 0, added: [] }
  }

  // 3. Get existing skills
  const { data: existingSkills, error: sError } = await supabase
    .from('skills')
    .select('name')

  if (sError) {
    return { success: false, count: 0, added: [], error: sError.message }
  }

  const existingNorms = new Set(
    (existingSkills || []).map((s) =>
      s.name.toLowerCase().replace(/[\s\-_.]+/g, ''),
    ),
  )

  // 4. Filter missing techs
  const missingTechs: string[] = []
  for (const tech of allProjectTechs) {
    const norm = tech.toLowerCase().replace(/[\s\-_.]+/g, '')
    if (!existingNorms.has(norm)) {
      missingTechs.push(tech)
    }
  }

  if (missingTechs.length === 0) {
    return { success: true, count: 0, added: [] }
  }

  // 5. Build insert payload
  const newSkills = missingTechs.map((name) => ({
    name,
    category: inferSkillCategory(name),
    is_visible: true,
    display_order: 0,
  }))

  const { error: insertError } = await supabase.from('skills').insert(newSkills)

  if (insertError) {
    return { success: false, count: 0, added: [], error: insertError.message }
  }

  revalidatePath('/admin/skills')
  revalidatePath('/')

  return {
    success: true,
    count: newSkills.length,
    added: newSkills.map((s) => s.name),
  }
}
