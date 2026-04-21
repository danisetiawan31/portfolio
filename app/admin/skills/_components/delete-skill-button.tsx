// app/admin/skills/_components/delete-skill-button.tsx

'use client'

import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import { deleteSkill } from '../actions'

interface DeleteSkillButtonProps {
  id: string
  name: string
}

export function DeleteSkillButton({ id, name }: DeleteSkillButtonProps) {
  return <DeleteConfirmButton onDelete={() => deleteSkill(id)} label={name} />
}
