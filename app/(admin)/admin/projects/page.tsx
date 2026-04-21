// app/(admin)/admin/projects/page.tsx

import Link from 'next/link'
import { CheckCircle2, Minus, Pencil } from 'lucide-react'
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
import { DeleteProjectButton } from './_components/delete-project-button'

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
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {projects?.length ?? 0} total
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/projects/new">+ New Project</Link>
        </Button>
      </div>

      {projects && projects.length > 0 ? (
        <div className="border-border overflow-x-auto rounded-lg border px-2">
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
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.length > 0 ? (
                        <>
                          {project.tech_stack
                            .slice(0, 3)
                            .map((tech: string) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="font-normal"
                              >
                                {tech}
                              </Badge>
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
                      <DeleteProjectButton
                        id={project.id}
                        title={project.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-muted-foreground">No projects yet.</p>
      )}
    </div>
  )
}
