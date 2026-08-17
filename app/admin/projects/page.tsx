// app/admin/projects/page.tsx

import Link from 'next/link'
import { CheckCircle2, Minus, Pencil } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { TechBadge } from '@/components/common/tech-badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import { deleteProject } from './actions'

export default async function AdminProjectsPage() {
  const supabase = createServiceRoleClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, tech_stack, is_featured, display_order')
    .order('display_order', { ascending: true })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive text-sm">
          Failed to load projects: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Projects
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
            {projects?.length ?? 0} total
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/projects/new">+ New Project</Link>
        </Button>
      </div>

      {projects && projects.length > 0 ? (
        <>
          {/* Mobile Card List View (< md) */}
          <div className="space-y-3 md:hidden">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate text-base font-semibold">
                      {project.title}
                    </h3>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      <span>Order: {project.display_order}</span>
                      <span>•</span>
                      {project.is_featured ? (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Featured
                        </span>
                      ) : (
                        <span>Standard</span>
                      )}
                    </div>
                  </div>
                </div>

                {project.tech_stack?.length > 0 && (
                  <div className="border-border/60 flex flex-wrap gap-1.5 border-t pt-2">
                    {project.tech_stack.map((tech: string) => (
                      <TechBadge key={tech} label={tech} size="sm" />
                    ))}
                  </div>
                )}

                <div className="border-border/60 flex items-center justify-end gap-2 border-t pt-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                  >
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteConfirmButton
                    action={deleteProject.bind(null, project.id)}
                    label={project.title}
                    description={`This action cannot be undone. This will permanently delete the project "${project.title}" and remove its thumbnail from storage.`}
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
                  <TableHead>Title</TableHead>
                  <TableHead>Tech Stack</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-center">Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack.length > 0 ? (
                          <>
                            {project.tech_stack
                              .slice(0, 3)
                              .map((tech: string) => (
                                <TechBadge
                                  key={tech}
                                  label={tech}
                                  size="sm"
                                  showLabel={false}
                                />
                              ))}
                            {project.tech_stack.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="font-normal opacity-60"
                              >
                                +{project.tech_stack.length - 3}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {project.is_featured ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                      ) : (
                        <Minus className="text-muted-foreground mx-auto h-4 w-4 opacity-50" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {project.display_order}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/projects/${project.id}/edit`}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>

                        {/* Delete */}
                        <DeleteConfirmButton
                          action={deleteProject.bind(null, project.id)}
                          label={project.title}
                          description={`This action cannot be undone. This will permanently delete the project "${project.title}" and remove its thumbnail from storage.`}
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
        <p className="text-muted-foreground">No projects yet.</p>
      )}
    </div>
  )
}
