// app/admin/skills/_components/skill-form.tsx

'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createSkill, updateSkill } from '../actions'
import { VALID_CATEGORIES } from '../constants'
import type { Database } from '@/types/database'

type Skill = Database['public']['Tables']['skills']['Row']

interface SkillFormProps {
  skill?: Skill
}

function buildAction(skill?: Skill) {
  if (skill) {
    return updateSkill.bind(null, skill.id)
  }
  return createSkill
}

export function SkillForm({ skill }: SkillFormProps) {
  const action = buildAction(skill)
  const [state, formAction, isPending] = useActionState(action, null)

  // Detect successful redirect by checking if component unmounts while pending
  useEffect(() => {
    return () => {
      if (isPending) {
        toast.success(
          skill ? 'Skill updated successfully' : 'Skill created successfully',
        )
      }
    }
  }, [isPending, skill])

  return (
    <form action={formAction} className="space-y-5">
      {/* Form-level error */}
      {state?.errors._form && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.errors._form}</AlertDescription>
        </Alert>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={skill?.name}
          disabled={isPending}
          aria-invalid={!!state?.errors.name}
        />
        {state?.errors.name && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.name}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category">Category *</Label>
        <Select
          name="category"
          defaultValue={skill?.category || VALID_CATEGORIES[0]}
          disabled={isPending}
        >
          <SelectTrigger aria-invalid={!!state?.errors.category}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {VALID_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c.replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.errors.category && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.category}
          </p>
        )}
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="is_visible"
          name="is_visible"
          defaultChecked={skill ? skill.is_visible : true}
          disabled={isPending}
        />
        <Label htmlFor="is_visible" className="cursor-pointer">
          Visible on Portfolio
        </Label>
      </div>

      {/* Actions */}
      <div className="border-border/70 flex flex-col-reverse gap-2.5 border-t pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
        <Button
          asChild
          variant="outline"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          <Link href="/admin/skills">Cancel</Link>
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full min-w-[130px] sm:w-auto"
        >
          {isPending ? 'Saving…' : skill ? 'Save Changes' : 'Create Skill'}
        </Button>
      </div>
    </form>
  )
}
