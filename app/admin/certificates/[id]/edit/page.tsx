// app/admin/certificates/[id]/edit/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { CertificateForm } from '../../_components/certificate-form'

interface EditCertificatePageProps {
  params: Promise<{ id: string }>
}

export default async function EditCertificatePage({
  params,
}: EditCertificatePageProps) {
  const { id } = await params
  const supabase = createServiceRoleClient()

  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !certificate) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <div>
        <Link
          href="/admin/certificates"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certificates
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Certificate</h1>
      </div>
      <CertificateForm certificate={certificate} />
    </div>
  )
}
