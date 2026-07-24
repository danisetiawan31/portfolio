// app/admin/certificates/new/page.tsx

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CertificateForm } from '../_components/certificate-form'

export default function NewCertificatePage() {
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
        <h1 className="text-2xl font-bold tracking-tight">New Certificate</h1>
      </div>
      <CertificateForm />
    </div>
  )
}
