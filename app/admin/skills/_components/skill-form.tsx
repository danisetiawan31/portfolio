// app/admin/skills/_components/skill-form.tsx

'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createSkill, updateSkill } from '../actions'
import { VALID_CATEGORIES, AVAILABLE_ICONS } from '../constants'
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

      {/* Context */}
      <div className="space-y-1.5">
        <Label htmlFor="context">Context *</Label>
        <Textarea
          id="context"
          name="context"
          rows={3}
          defaultValue={skill?.context}
          disabled={isPending}
          aria-invalid={!!state?.errors.context}
        />
        {state?.errors.context && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.context}
          </p>
        )}
      </div>

      {/* Icon */}
      <div className="space-y-1.5">
        <Label htmlFor="icon">Icon (optional)</Label>
        <Input
          id="icon"
          name="icon"
          defaultValue={skill?.icon || ''}
          disabled={isPending}
          aria-invalid={!!state?.errors.icon}
        />
        <p className="text-muted-foreground text-xs leading-relaxed">
          Available: {AVAILABLE_ICONS.join(', ')}
        </p>
        {state?.errors.icon && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.icon}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : skill ? 'Save Changes' : 'Create Skill'}
        </Button>
        <Button asChild variant="outline" disabled={isPending}>
          <Link href="/admin/skills">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
