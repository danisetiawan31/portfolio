// app/admin/skills/_components/skill-form.tsx

'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TechBadge } from '@/components/common/tech-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createSkill, updateSkill } from '../actions'
import {
  VALID_CATEGORIES,
  CATEGORY_LABELS,
  inferSkillCategory,
} from '../constants'
import type { Database } from '@/types/database'

type Skill = Database['public']['Tables']['skills']['Row']

interface SkillFormProps {
  skill?: Skill
}

const POPULAR_PRESETS = [
  'Angular',
  'React',
  'Next.js',
  'Vue.js',
  'TypeScript',
  'Tailwind CSS',
  'NestJS',
  'Go',
  'Laravel',
  'FastAPI',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Redis',
  'Prisma',
  'MySQL',
  'Supabase',
  'Playwright',
  'Vitest',
  'Docker',
  'Git',
  'GraphQL',
  'WebSocket',
]

function buildAction(skill?: Skill) {
  if (skill) {
    return updateSkill.bind(null, skill.id)
  }
  return createSkill
}

export function SkillForm({ skill }: SkillFormProps) {
  const action = buildAction(skill)
  const [state, formAction, isPending] = useActionState(action, null)
  const [name, setName] = useState(skill?.name || '')
  const [category, setCategory] = useState<string>(
    skill?.category || VALID_CATEGORIES[0],
  )

  function handleNameChange(val: string) {
    setName(val)
    if (!skill && val.trim().length > 1) {
      setCategory(inferSkillCategory(val))
    }
  }

  function handleSelectPreset(presetName: string) {
    setName(presetName)
    setCategory(inferSkillCategory(presetName))
  }

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
    <form action={formAction} className="space-y-6">
      {/* Form-level error */}
      {state?.errors._form && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.errors._form}</AlertDescription>
        </Alert>
      )}

      {/* Quick-Pick Presets (Only show for new skills) */}
      {!skill && (
        <div className="border-border/70 bg-muted/30 space-y-2 rounded-xl border p-3.5">
          <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="text-primary size-3.5" />
            <span>Quick Presets (1-Click Fill & Auto-Category):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                  name.toLowerCase() === preset.toLowerCase()
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border/80 bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                <TechBadge label={preset} size="sm" />
                <span>{preset}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Name Input & Live Icon Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="name">Skill Name *</Label>
          {name.trim() && (
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span>Preview Icon:</span>
              <TechBadge label={name} size="sm" />
            </div>
          )}
        </div>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Angular, Go, Redis, Playwright"
          disabled={isPending}
          aria-invalid={!!state?.errors.name}
        />
        {state?.errors.name && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.name}
          </p>
        )}
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          name="category"
          value={category}
          onValueChange={setCategory}
          disabled={isPending}
        >
          <SelectTrigger aria-invalid={!!state?.errors.category}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {VALID_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_LABELS[c] || c}
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
        <Label
          htmlFor="is_visible"
          className="cursor-pointer text-sm font-normal"
        >
          Visible on Public Portfolio
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
