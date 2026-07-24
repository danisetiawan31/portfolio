// app/certificates/page.tsx

import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CertificateCard } from '@/components/sections/certificate-card'
import { FadeUpOnScroll } from '@/components/common/fade-up-on-scroll'
import { SectionContainer } from '@/components/common/section-container'
import { SectionHeader } from '@/components/common/section-header'
import { Navbar } from '@/components/layout/navbar'

export const metadata: Metadata = {
  title: 'Certificates | Portfolio',
  description:
    'A collection of my professional certifications and credentials.',
}

export default async function CertificatesPage() {
  const supabase = await createClient()
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .order('display_order', { ascending: true })

  const count = certificates?.length ?? 0

  return (
    <>
      <Navbar />
      <div className="pt-12">
        <SectionContainer id="all-certificates" className="!pt-0">
          <div className="mb-8">
            <Link
              href="/#certificates"
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <SectionHeader
              title="Certificates &amp; Credentials"
              subtitle="A comprehensive list of my professional certifications and achievements."
              className="mb-0"
            />
            {count > 0 && (
              <div className="bg-primary/8 border-primary/20 text-primary flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium">
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
                {count} {count === 1 ? 'certificate' : 'certificates'}
              </div>
            )}
          </div>

          {count === 0 ? (
            <div className="border-border bg-card/50 mt-12 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed text-center">
              <div className="bg-muted mb-4 rounded-full p-4">
                <Award
                  className="text-muted-foreground h-8 w-8"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-lg font-semibold">No certificates yet</h2>
              <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
                I haven&apos;t added any certificates to my portfolio yet. Check
                back later!
              </p>
            </div>
          ) : (
            <div className="cert-grid mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates!.map((cert, index) => (
                <FadeUpOnScroll key={cert.id} delay={index * 0.05}>
                  <CertificateCard certificate={cert} />
                </FadeUpOnScroll>
              ))}
            </div>
          )}
        </SectionContainer>
      </div>
    </>
  )
}
