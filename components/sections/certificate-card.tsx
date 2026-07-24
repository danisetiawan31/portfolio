// components/sections/certificate-card.tsx

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageLightbox } from '@/components/common/image-lightbox'
import { ExternalLink, Award, Check, Building2, Calendar } from 'lucide-react'
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
    <Card className="cert-card flex h-full flex-col overflow-hidden rounded-xl">
      {/* Image area — inset dengan margin kecil dari tepi card */}
      <div className="px-(--card-spacing)">
        <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
          {image_url ? (
            <ImageLightbox
              src={image_url}
              alt={title}
              width={800}
              height={450}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Award
                className="text-muted-foreground/30 h-12 w-12"
                aria-hidden="true"
              />
            </div>
          )}

          {/* Badge Verified — icon-only, lingkaran kecil */}
          {credential_url && (
            <div
              className="bg-background/90 border-border absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm"
              style={{ pointerEvents: 'none' }}
              aria-hidden="true"
            >
              <Check className="text-success h-3.5 w-3.5" strokeWidth={2.75} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col">
        <h3
          className="line-clamp-2 text-base leading-snug font-semibold tracking-tight"
          title={title}
        >
          {title}
        </h3>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm font-medium">
          <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {issuer}
        </p>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
          <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {formattedDate}
        </p>
      </CardContent>

      {/* Footer — hanya dirender kalau credential_url ada */}
      {credential_url && (
        <CardFooter className="pt-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={credential_url} target="_blank" rel="noopener noreferrer">
              Verifikasi
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
