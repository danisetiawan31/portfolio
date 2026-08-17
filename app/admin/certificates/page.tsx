// app/admin/certificates/page.tsx

import Link from 'next/link'
import { CheckCircle2, Minus, Pencil, Award } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ImageLightbox } from '@/components/common/image-lightbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import { deleteCertificate } from './actions'

export default async function AdminCertificatesPage() {
  const supabase = createServiceRoleClient()

  const { data: certificates, error } = await supabase
    .from('certificates')
    .select('id, title, issuer, is_featured, display_order, image_url')
    .order('display_order', { ascending: true })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive text-sm">
          Failed to load certificates: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Certificates
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
            {certificates?.length ?? 0} total
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/certificates/new">+ New Certificate</Link>
        </Button>
      </div>

      {certificates && certificates.length > 0 ? (
        <>
          {/* Mobile Card List View (< md) */}
          <div className="space-y-3 md:hidden">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  {cert.image_url ? (
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md border">
                      <ImageLightbox
                        src={cert.image_url}
                        alt={cert.title}
                        width={80}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted flex h-14 w-20 shrink-0 items-center justify-center rounded-md border">
                      <Award className="text-muted-foreground/30 h-6 w-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate text-base font-semibold">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground truncate text-xs">
                      {cert.issuer}
                    </p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      <span>Order: {cert.display_order}</span>
                      <span>•</span>
                      {cert.is_featured ? (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Featured
                        </span>
                      ) : (
                        <span>Standard</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-border/60 flex items-center justify-end gap-2 border-t pt-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                  >
                    <Link href={`/admin/certificates/${cert.id}/edit`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteConfirmButton
                    action={deleteCertificate.bind(null, cert.id)}
                    label={cert.title}
                    description={`This action cannot be undone. This will permanently delete the certificate "${cert.title}" and remove its image from storage.`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="border-border hidden overflow-x-auto rounded-lg border px-2 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-center">Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      {cert.image_url ? (
                        <div className="h-12 w-20 overflow-hidden rounded-md border">
                          <ImageLightbox
                            src={cert.image_url}
                            alt={cert.title}
                            width={80}
                            height={45}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="bg-muted flex h-12 w-20 items-center justify-center rounded-md border">
                          <Award className="text-muted-foreground/30 h-5 w-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{cert.title}</TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell className="text-center">
                      {cert.is_featured ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                      ) : (
                        <Minus className="text-muted-foreground mx-auto h-4 w-4 opacity-50" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {cert.display_order}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/certificates/${cert.id}/edit`}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                        <DeleteConfirmButton
                          action={deleteCertificate.bind(null, cert.id)}
                          label={cert.title}
                          description={`This action cannot be undone. This will permanently delete the certificate "${cert.title}" and remove its image from storage.`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">No certificates yet.</p>
      )}
    </div>
  )
}
