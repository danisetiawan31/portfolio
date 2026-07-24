// components/certificates/certificate-card.tsx

import { ImageLightbox } from '@/components/common/image-lightbox'
import { ExternalLink, Award } from 'lucide-react'
import type { Database } from '@/types/database'

type Certificate = Database['public']['Tables']['certificates']['Row']

interface CertificateCardProps {
  certificate: Certificate
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const { title, issuer, issue_date, image_url, credential_url } = certificate

  const formattedDate = new Date(issue_date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-card border-border flex h-full flex-col overflow-hidden rounded-xl border">
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        {image_url ? (
          <ImageLightbox
            src={image_url}
            alt={title}
            width={800}
            height={450}
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Award className="text-muted-foreground/30 h-12 w-12" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm font-medium">
          {issuer}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{formattedDate}</p>

        <div className="mt-auto pt-5">
          {credential_url && (
            <a
              href={credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium transition-colors"
            >
              Verifikasi
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
