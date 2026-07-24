// app/admin/certificates/_components/delete-certificate-button.tsx

'use client'

import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import { deleteCertificate } from '../actions'

interface DeleteCertificateButtonProps {
  id: string
  title: string
}

export function DeleteCertificateButton({
  id,
  title,
}: DeleteCertificateButtonProps) {
  return (
    <DeleteConfirmButton
      onDelete={() => deleteCertificate(id)}
      label={title}
      description={`This action cannot be undone. This will permanently delete the certificate "${title}" and remove its image from storage.`}
    />
  )
}
