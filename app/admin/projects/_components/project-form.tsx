// app/admin/projects/_components/project-form.tsx

'use client'

import { useActionState, useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createProject, updateProject } from '../actions'
import type { Database } from '@/types/database'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectFormProps {
  project?: Project
}

// Bind updateProject to the specific project ID when editing
function buildAction(project?: Project) {
  if (project) {
    return updateProject.bind(null, project.id)
  }
  return createProject
}

const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

export function ProjectForm({ project }: ProjectFormProps) {
  const action = buildAction(project)
  const [state, formAction, isPending] = useActionState(action, null)
  const [thumbError, setThumbError] = useState<string | null>(null)

  // Auto-generate slug from title when creating a new project
  const titleRef = useRef<HTMLInputElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)

  function handleTitleBlur() {
    if (project) return // don't overwrite existing slug on edit
    const slug = slugRef.current
    const title = titleRef.current
    if (slug && !slug.value && title?.value) {
      slug.value = title.value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setThumbError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_MIME.includes(file.type)) {
      setThumbError('File must be a JPEG, PNG, or WebP image.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setThumbError('File must be under 10 MB.')
      e.target.value = ''
    }
  }

  // Detect successful redirect by checking if component unmounts while pending
  useEffect(() => {
    return () => {
      if (isPending) {
        toast.success(
          project
            ? 'Project updated successfully'
            : 'Project created successfully',
        )
      }
    }
  }, [isPending, project])

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

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          ref={titleRef}
          onBlur={handleTitleBlur}
          defaultValue={project?.title}
          disabled={isPending}
          aria-invalid={!!state?.errors.title}
        />
        {state?.errors.title && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.title}
          </p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          name="slug"
          ref={slugRef}
          defaultValue={project?.slug}
          placeholder="my-project-name"
          disabled={isPending}
          aria-invalid={!!state?.errors.slug}
        />
        {state?.errors.slug && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.slug}
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
          defaultValue={project?.description}
          disabled={isPending}
          aria-invalid={!!state?.errors.description}
        />
        {state?.errors.description && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.description}
          </p>
        )}
      </div>

      {/* Tech Stack */}
      <div className="space-y-1.5">
        <Label htmlFor="tech_stack">Tech Stack * (comma-separated)</Label>
        <Input
          id="tech_stack"
          name="tech_stack"
          placeholder="typescript, react, nextjs"
          defaultValue={project?.tech_stack.join(', ')}
          disabled={isPending}
          aria-invalid={!!state?.errors.tech_stack}
        />
        {state?.errors.tech_stack && (
          <p role="alert" className="text-destructive text-xs">
            {state.errors.tech_stack}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      <div className="space-y-1.5">
        <Label htmlFor="thumbnail">
          Thumbnail{' '}
          {project?.thumbnail_url
            ? '(leave empty to keep current)'
            : '(optional)'}
        </Label>
        {project?.thumbnail_url && (
          <p className="text-muted-foreground text-xs">
            Current:{' '}
            <a
              href={project.thumbnail_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              view
            </a>
          </p>
        )}
        <Input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isPending}
          aria-invalid={!!(thumbError ?? state?.errors.thumbnail)}
          onChange={handleThumbnailChange}
        />
        {(thumbError ?? state?.errors.thumbnail) && (
          <p role="alert" className="text-destructive text-xs">
            {thumbError ?? state?.errors.thumbnail}
          </p>
        )}
      </div>

      {/* Live URL */}
      <div className="space-y-1.5">
        <Label htmlFor="live_url">Live URL (optional)</Label>
        <Input
          id="live_url"
          name="live_url"
          type="url"
          placeholder="https://example.com"
          defaultValue={project?.live_url ?? ''}
          disabled={isPending}
        />
      </div>

      {/* GitHub URL */}
      <div className="space-y-1.5">
        <Label htmlFor="github_url">GitHub URL (optional)</Label>
        <Input
          id="github_url"
          name="github_url"
          type="url"
          placeholder="https://github.com/user/repo"
          defaultValue={project?.github_url ?? ''}
          disabled={isPending}
        />
      </div>

      {/* Display Order */}
      <div className="space-y-1.5">
        <Label htmlFor="display_order">Display Order</Label>
        <Input
          id="display_order"
          name="display_order"
          type="number"
          defaultValue={project?.display_order ?? 0}
          disabled={isPending}
        />
      </div>

      {/* Is Featured */}
      <div className="flex items-center gap-2">
        <Input
          type="checkbox"
          id="is_featured"
          name="is_featured"
          title="Featured project"
          defaultChecked={project?.is_featured ?? false}
          disabled={isPending}
          className="border-border h-4 w-4 rounded"
        />
        <Label htmlFor="is_featured">Featured project</Label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : project ? 'Save Changes' : 'Create Project'}
        </Button>
        <Button asChild variant="outline" disabled={isPending}>
          <Link href="/admin/projects">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
