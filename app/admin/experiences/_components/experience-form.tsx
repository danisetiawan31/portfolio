// app/admin/experiences/_components/experience-form.tsx

'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TagsSelector } from '@/components/ui/tags-selector'
import { TECH_STACK_OPTIONS } from '@/lib/constants/tech-stack-options'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createExperience, updateExperience } from '../actions'
import { VALID_TYPES } from '../constants'
import type { Database } from '@/types/database'

type Experience = Database['public']['Tables']['experiences']['Row']

interface ExperienceFormProps {
  experience?: Experience
}

function buildAction(experience?: Experience) {
  if (experience) {
    return updateExperience.bind(null, experience.id)
  }
  return createExperience
}

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const action = buildAction(experience)
  const [state, formAction, isPending] = useActionState(action, null)

  const [isCurrent, setIsCurrent] = useState<boolean>(
    experience?.is_current ?? false,
  )
  const [endDateValue, setEndDateValue] = useState<string>(
    experience?.end_date ?? '',
  )

  function handleIsCurrentChange(checked: boolean) {
    setIsCurrent(checked)
    if (checked) {
      setEndDateValue('')
    }
  }

  // Detect successful redirect by checking if component unmounts while pending
  useEffect(() => {
    return () => {
      if (isPending) {
        toast.success(
          experience
            ? 'Experience updated successfully'
            : 'Experience created successfully',
        )
      }
    }
  }, [isPending, experience])

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

      {/* Company */}
      <div className="space-y-1.5">
        <Label htmlFor="company">Company *</Label>
        <Input
          id="company"
          name="company"
          defaultValue={experience?.company}
          disabled={isPending}
          aria-invalid={!!state?.errors.company}
        />
        {state?.errors.company && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.company}
          </p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <Label htmlFor="role">Role *</Label>
        <Input
          id="role"
          name="role"
          defaultValue={experience?.role}
          disabled={isPending}
          aria-invalid={!!state?.errors.role}
        />
        {state?.errors.role && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.role}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={experience?.description}
          disabled={isPending}
          aria-invalid={!!state?.errors.description}
        />
        {state?.errors.description && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.description}
          </p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <Label htmlFor="type">Type *</Label>
        <Select
          name="type"
          defaultValue={experience?.type || VALID_TYPES[0]}
          disabled={isPending}
        >
          <SelectTrigger aria-invalid={!!state?.errors.type}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {VALID_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t.replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.errors.type && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.type}
          </p>
        )}
      </div>

      {/* Tech Stack */}
      <div className="space-y-1.5">
        <Label htmlFor="tech_stack">Tech Stack</Label>
        <TagsSelector
          name="tech_stack"
          tags={TECH_STACK_OPTIONS}
          defaultValue={experience?.tech_stack ?? undefined}
        />
        {state?.errors.tech_stack && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.tech_stack}
          </p>
        )}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Start Date */}
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={experience?.start_date}
            disabled={isPending}
            aria-invalid={!!state?.errors.start_date}
          />
          {state?.errors.start_date && (
            <p role="alert" className="text-destructive text-xs">
              {state.errors.start_date}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={endDateValue}
            onChange={(e) => setEndDateValue(e.target.value)}
            disabled={isPending || isCurrent}
            aria-invalid={!!state?.errors.end_date}
          />
          {state?.errors.end_date && (
            <p role="alert" className="text-destructive text-xs">
              {state.errors.end_date}
            </p>
          )}
        </div>
      </div>

      {/* Is Current */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="is_current"
          name="is_current"
          checked={isCurrent}
          onCheckedChange={(checked) => handleIsCurrentChange(checked === true)}
          disabled={isPending}
        />
        <Label htmlFor="is_current">I currently work in this role</Label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? 'Saving…'
            : experience
              ? 'Save Changes'
              : 'Create Experience'}
        </Button>
        <Button asChild variant="outline" disabled={isPending}>
          <Link href="/admin/experiences">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
