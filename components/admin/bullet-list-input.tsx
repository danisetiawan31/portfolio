'use client'

import { useState, useRef, useId } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface BulletListInputProps {
  /** Field name — each bullet submits as a separate hidden input with this name */
  name: string
  /** Pre-populated bullets for edit mode */
  defaultValue?: string[]
  /** Whether the field has a validation error (red border) */
  error?: boolean
}

export function BulletListInput({
  name,
  defaultValue = [],
  error = false,
}: BulletListInputProps) {
  const [bullets, setBullets] = useState<string[]>(defaultValue)
  const [draft, setDraft] = useState('')
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  function addBullet() {
    const trimmed = draft.trim()
    if (!trimmed) return
    setBullets((prev) => [...prev, trimmed])
    setDraft('')
    inputRef.current?.focus()
  }

  function removeBullet(index: number) {
    setBullets((prev) => prev.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addBullet()
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Hidden inputs — one per bullet, all sharing the same name */}
      {bullets.map((bullet, i) => (
        <input key={i} type="hidden" name={name} value={bullet} />
      ))}

      {/* Bullet list */}
      {bullets.length > 0 && (
        <ul
          className={cn(
            'border-border bg-background rounded-2xl border p-3',
            error && bullets.length === 0 && 'border-destructive',
          )}
        >
          {bullets.map((bullet, i) => (
            <li
              key={i}
              className="group flex items-start gap-2 py-1.5 first:pt-0 last:pb-0"
            >
              <span className="text-muted-foreground mt-[3px] shrink-0 select-none">
                •
              </span>
              <span className="text-foreground flex-1 text-sm leading-relaxed">
                {bullet}
              </span>
              <button
                type="button"
                onClick={() => removeBullet(i)}
                className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0 rounded p-0.5 opacity-0 transition-all group-hover:opacity-100"
                aria-label={`Remove bullet: ${bullet}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new bullet row */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          id={inputId}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a bullet point and press Enter…"
          aria-label="New bullet point"
          className={cn(
            'flex-1',
            error && bullets.length === 0 && 'border-destructive',
          )}
        />
        <button
          type="button"
          onClick={addBullet}
          disabled={!draft.trim()}
          aria-label="Add bullet"
          className="border-border bg-background hover:bg-muted inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
