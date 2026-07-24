// app/admin/certificates/_components/certificate-form.tsx

'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createCertificate, updateCertificate } from '../actions'
import type { Database } from '@/types/database'

type Certificate = Database['public']['Tables']['certificates']['Row']

interface CertificateFormProps {
  certificate?: Certificate
}

function buildAction(certificate?: Certificate) {
  if (certificate) {
    return updateCertificate.bind(null, certificate.id)
  }
  return createCertificate
}

const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

export function CertificateForm({ certificate }: CertificateFormProps) {
  const action = buildAction(certificate)
  const [state, formAction, isPending] = useActionState(action, null)
  const [imageError, setImageError] = useState<string | null>(null)
  const router = useRouter()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_MIME.includes(file.type)) {
      setImageError('File must be a JPEG, PNG, or WebP image.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setImageError('File must be under 10 MB.')
      e.target.value = ''
    }
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(
        certificate
          ? 'Certificate updated successfully'
          : 'Certificate created successfully',
      )
      router.push('/admin/certificates')
    }
  }, [state, certificate, router])

  return (
    <form action={formAction} className="space-y-5">
      {state?.errors?._form && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state?.errors?._form}</AlertDescription>
        </Alert>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={certificate?.title}
          disabled={isPending}
          aria-invalid={!!state?.errors?.title}
        />
        {state?.errors?.title && (
          <p role="alert" className="text-destructive text-xs">
            {state?.errors?.title}
          </p>
        )}
      </div>

      {/* Issuer */}
      <div className="space-y-1.5">
        <Label htmlFor="issuer">Issuer *</Label>
        <Input
          id="issuer"
          name="issuer"
          defaultValue={certificate?.issuer}
          disabled={isPending}
          aria-invalid={!!state?.errors?.issuer}
        />
        {state?.errors?.issuer && (
          <p role="alert" className="text-destructive text-xs">
            {state?.errors?.issuer}
          </p>
        )}
      </div>

      {/* Issue Date */}
      <div className="space-y-1.5">
        <Label htmlFor="issue_date">Issue Date *</Label>
        <Input
          id="issue_date"
          name="issue_date"
          type="date"
          defaultValue={certificate?.issue_date}
          disabled={isPending}
          aria-invalid={!!state?.errors?.issue_date}
        />
        {state?.errors?.issue_date && (
          <p role="alert" className="text-destructive text-xs">
            {state?.errors?.issue_date}
          </p>
        )}
      </div>

      {/* Credential URL */}
      <div className="space-y-1.5">
        <Label htmlFor="credential_url">Credential URL (optional)</Label>
        <Input
          id="credential_url"
          name="credential_url"
          type="url"
          placeholder="https://example.com/verify/..."
          defaultValue={certificate?.credential_url ?? ''}
          disabled={isPending}
        />
      </div>

      {/* Image */}
      <div className="space-y-1.5">
        <Label htmlFor="image">
          Image{' '}
          {certificate?.image_url
            ? '(leave empty to keep current)'
            : '(optional)'}
        </Label>
        {certificate?.image_url && (
          <p className="text-muted-foreground text-xs">
            Current:{' '}
            <a
              href={certificate.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              view
            </a>
          </p>
        )}
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isPending}
          aria-invalid={!!(imageError ?? state?.errors?.image)}
          onChange={handleImageChange}
        />
        {(imageError ?? state?.errors?.image) && (
          <p role="alert" className="text-destructive text-xs">
            {imageError ?? state?.errors?.image}
          </p>
        )}
      </div>

      {/* Display Order */}
      <div className="space-y-1.5">
        <Label htmlFor="display_order">Display Order</Label>
        <Input
          id="display_order"
          name="display_order"
          type="number"
          defaultValue={certificate?.display_order ?? 0}
          disabled={isPending}
        />
      </div>

      {/* Is Featured */}
      <div className="flex items-center gap-2">
        <Input
          type="checkbox"
          id="is_featured"
          name="is_featured"
          title="Featured certificate"
          defaultChecked={certificate?.is_featured ?? false}
          disabled={isPending}
          className="border-border h-4 w-4 rounded"
        />
        <Label htmlFor="is_featured">Featured certificate</Label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? 'Saving…'
            : certificate
              ? 'Save Changes'
              : 'Create Certificate'}
        </Button>
        <Button asChild variant="outline" disabled={isPending}>
          <Link href="/admin/certificates">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
