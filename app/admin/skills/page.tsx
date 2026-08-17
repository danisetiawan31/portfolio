// app/admin/skills/page.tsx

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase/server'
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
import { deleteSkill } from './actions'
import { VALID_CATEGORIES } from './constants'

export default async function AdminSkillsPage() {
  const supabase = createServiceRoleClient()

  const { data: skills, error } = await supabase
    .from('skills')
    .select('id, name, category, is_visible')
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
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Skills
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
            {skills?.length ?? 0} total
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/skills/new">+ New Skill</Link>
        </Button>
      </div>

      {groupedSkills.length > 0 ? (
        <div className="space-y-6 sm:space-y-8">
          {groupedSkills.map(({ category, items }) => (
            <div key={category} className="space-y-3">
              <h2 className="text-foreground text-base font-semibold capitalize sm:text-lg">
                {category.replace('_', ' & ')}
              </h2>

              {/* Mobile Card List (< md) */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:hidden">
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="border-border bg-card flex items-center justify-between gap-3 rounded-xl border p-3 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {skill.name}
                      </p>
                      <div className="mt-0.5">
                        {skill.is_visible ? (
                          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            ● Visible
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">
                            ○ Hidden
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Link href={`/admin/skills/${skill.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <DeleteConfirmButton
                        action={deleteSkill.bind(null, skill.id)}
                        label={skill.name}
                        description={`This action cannot be undone. This will permanently delete the skill "${skill.name}".`}
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
                      <TableHead>Name</TableHead>
                      <TableHead>Visibility</TableHead>
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
                          {skill.is_visible ? (
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              Visible
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Hidden
                            </span>
                          )}
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
                            <DeleteConfirmButton
                              action={deleteSkill.bind(null, skill.id)}
                              label={skill.name}
                              description={`This action cannot be undone. This will permanently delete the skill "${skill.name}".`}
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
