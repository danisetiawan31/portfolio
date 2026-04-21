// app/admin/experiences/_components/delete-experience-button.tsx

'use client'

import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import { deleteExperience } from '../actions'

interface DeleteExperienceButtonProps {
  id: string
  company: string
}

export function DeleteExperienceButton({
  id,
  company,
}: DeleteExperienceButtonProps) {
  return (
    <DeleteConfirmButton
      onDelete={() => deleteExperience(id)}
      label={company}
    />
  )
}
