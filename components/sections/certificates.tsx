// components/sections/certificates.tsx

import { createClient } from '@/lib/supabase/server'
import { SectionContainer } from '@/components/common/section-container'
import { SectionHeader } from '@/components/common/section-header'
import { CertificateCard } from '@/components/sections/certificate-card'
import Link from 'next/link'

export default async function CertificatesSection() {
  const supabase = await createClient()
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })

  // Specification: "Kalau tidak ada satupun yang featured, section (termasuk heading-nya) tidak dirender sama sekali — bukan ditampilkan kosong."
  if (!certificates || certificates.length === 0) {
    return null
  }

  return (
    <SectionContainer id="certificates">
      <SectionHeader
        title="Featured Certificates"
        subtitle="Professional credentials and certifications."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/certificates"
          className="group text-muted-foreground hover:text-primary flex items-center gap-2 text-base font-medium transition-colors"
        >
          <span className="decoration-muted-foreground/30 group-hover:decoration-primary underline underline-offset-4 transition-colors">
            View all certificates
          </span>
        </Link>
      </div>
    </SectionContainer>
  )
}
