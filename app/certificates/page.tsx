// app/certificates/page.tsx

import { Navbar } from '@/components/layout/navbar'
// import Footer from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'
import { CertificateCard } from '@/components/sections/certificate-card'
import { Award } from 'lucide-react'

export const metadata = {
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Certificates & Credentials
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              A comprehensive list of my professional certifications and
              achievements.
            </p>
          </div>

          {!certificates || certificates.length === 0 ? (
            <div className="border-border bg-card/50 flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed text-center">
              <div className="bg-muted mb-4 rounded-full p-4">
                <Award className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold">No certificates found</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                I havent added any certificates to my portfolio yet. Check back
                later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </>
  )
}
