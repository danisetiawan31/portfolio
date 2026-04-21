// app/admin/projects/_components/delete-project-button.tsx

'use client'

import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import { deleteProject } from '../actions'

interface DeleteProjectButtonProps {
  id: string
  title: string
}

export function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  return (
    <DeleteConfirmButton
      onDelete={() => deleteProject(id)}
      label={title}
      description={`This action cannot be undone. This will permanently delete the project "${title}" and remove its thumbnail from storage.`}
    />
  )
}
