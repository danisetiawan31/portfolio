// app/admin/skills/page.tsx

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
import { DeleteSkillButton } from './_components/delete-skill-button'
import { VALID_CATEGORIES } from './constants'

export default async function AdminSkillsPage() {
  const supabase = createServiceRoleClient()

  const { data: skills, error } = await supabase
    .from('skills')
    .select('id, name, category, icon, context')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive text-sm">
          Failed to load skills: {error.message}
        </p>
      </div>
    )
  }

  // Group by category using VALID_CATEGORIES to enforce order
  const groupedSkills = VALID_CATEGORIES.map((category) => ({
    category,
    items: skills?.filter((skill) => skill.category === category) || [],
  })).filter((group) => group.items.length > 0)

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {skills?.length ?? 0} total
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/skills/new">+ New Skill</Link>
        </Button>
      </div>

      {groupedSkills.length > 0 ? (
        <div className="space-y-8">
          {groupedSkills.map(({ category, items }) => (
            <div key={category} className="space-y-3">
              <h2 className="text-foreground text-lg font-semibold capitalize">
                {category}
              </h2>
              <div className="border-border overflow-x-auto rounded-lg border px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead>Context</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((skill) => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium">
                          {skill.name}
                        </TableCell>
                        <TableCell>
                          {skill.icon ? (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground font-normal"
                            >
                              {skill.icon}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {skill.context}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/skills/${skill.id}/edit`}>
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit
                              </Link>
                            </Button>

                            {/* Delete */}
                            <DeleteSkillButton
                              id={skill.id}
                              name={skill.name}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No skills yet.</p>
      )}
    </div>
  )
}
