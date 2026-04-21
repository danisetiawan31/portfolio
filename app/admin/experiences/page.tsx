// app/admin/experiences/page.tsx

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteExperienceButton } from './_components/delete-experience-button'

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function AdminExperiencesPage() {
  const supabase = createServiceRoleClient()

  const { data: experiences, error } = await supabase
    .from('experiences')
    .select('id, company, role, type, start_date, end_date, is_current')
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: false })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive text-sm">
          Failed to load experiences: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Experiences</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {experiences?.length ?? 0} total
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/experiences/new">+ New Experience</Link>
        </Button>
      </div>

      {experiences && experiences.length > 0 ? (
        <div className="border-border overflow-x-auto rounded-lg border px-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-medium">{exp.company}</TableCell>
                  <TableCell>{exp.role}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {exp.type.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {formatDate(exp.start_date)} ~{' '}
                    {exp.is_current
                      ? 'Present'
                      : exp.end_date
                        ? formatDate(exp.end_date)
                        : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/experiences/${exp.id}/edit`}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>

                      {/* Delete */}
                      <DeleteExperienceButton
                        id={exp.id}
                        company={exp.company}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-muted-foreground">No experiences yet.</p>
      )}
    </div>
  )
}
