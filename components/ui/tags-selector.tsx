'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Tag = {
  id: string
  label: string
}

type TagsSelectorProps = {
  tags: Tag[]
  name: string
  defaultValue?: string[]
}

export function TagsSelector({
  tags,
  name,
  defaultValue = [],
}: TagsSelectorProps) {
  const initialTags = defaultValue.map((val) => {
    const existing = tags.find(
      (t) =>
        t.id === val ||
        t.id === val.toLowerCase() ||
        t.label.toLowerCase() === val.toLowerCase(),
    )
    if (existing) return existing
    return { id: val.toLowerCase().replace(/\s+/g, '-'), label: val }
  })

  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags)
  const [customInput, setCustomInput] = useState('')
  const selectedsContainerRef = useRef<HTMLDivElement>(null)

  const removeSelectedTag = (id: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== id))
  }

  const addSelectedTag = (tag: Tag) => {
    if (
      selectedTags.some(
        (t) =>
          t.id === tag.id || t.label.toLowerCase() === tag.label.toLowerCase(),
      )
    ) {
      return
    }
    setSelectedTags((prev) => [...prev, tag])
  }

  const handleAddCustomTag = () => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    const id = trimmed.toLowerCase().replace(/\s+/g, '-')
    const existing = tags.find(
      (t) => t.id === id || t.label.toLowerCase() === trimmed.toLowerCase(),
    ) || { id, label: trimmed }

    addSelectedTag(existing)
    setCustomInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCustomTag()
    }
  }

  useEffect(() => {
    if (selectedsContainerRef.current) {
      selectedsContainerRef.current.scrollTo({
        left: selectedsContainerRef.current.scrollWidth,
        behavior: 'smooth',
      })
    }
  }, [selectedTags])

  return (
    <div className="flex w-full flex-col gap-2">
      <input
        type="hidden"
        name={name}
        readOnly
        value={selectedTags.map((t) => t.label).join(', ')}
      />

      {/* Selected Tags Pills Container */}
      <motion.div
        className="no-scrollbar border-border bg-background mt-1 flex min-h-12 w-full flex-wrap items-center justify-start gap-1.5 rounded-2xl border p-1.5"
        ref={selectedsContainerRef}
        layout
      >
        {selectedTags.map((tag) => (
          <motion.div
            key={tag.id}
            className="border-border bg-background flex h-8 shrink-0 items-center gap-1 rounded-xl border py-1 pr-1 pl-3 shadow-2xs"
            layoutId={`tag-${tag.id}`}
          >
            <motion.span
              layoutId={`tag-${tag.id}-label`}
              className="text-foreground text-sm font-medium"
            >
              {tag.label}
            </motion.span>
            <button
              type="button"
              onClick={() => removeSelectedTag(tag.id)}
              className="hover:bg-muted rounded-full p-0.5 transition-colors"
            >
              <X className="text-muted-foreground size-3.5" />
            </button>
          </motion.div>
        ))}
        {selectedTags.length === 0 && (
          <span className="text-muted-foreground px-2 text-sm italic">
            Select or type tags below...
          </span>
        )}
      </motion.div>

      {/* Custom Tag Input */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a custom tech stack & press Enter (e.g. Spartan UI)"
          className="h-9 text-xs sm:text-sm"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddCustomTag}
          disabled={!customInput.trim()}
          className="h-9 px-3 text-xs"
        >
          <Plus className="mr-1 size-3.5" /> Add
        </Button>
      </div>

      {/* Preset Tag Options */}
      {tags.length > selectedTags.length && (
        <motion.div
          className="border-border bg-background/60 w-full rounded-2xl border p-2.5 shadow-2xs"
          layout
        >
          <motion.div className="flex flex-wrap gap-1.5">
            {tags
              .filter(
                (tag) =>
                  !selectedTags.some(
                    (selected) =>
                      selected.id === tag.id ||
                      selected.label.toLowerCase() === tag.label.toLowerCase(),
                  ),
              )
              .map((tag) => (
                <motion.button
                  type="button"
                  key={tag.id}
                  layoutId={`tag-${tag.id}`}
                  className="bg-muted/60 hover:bg-muted text-foreground/80 hover:text-foreground flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
                  onClick={() => addSelectedTag(tag)}
                >
                  <motion.span layoutId={`tag-${tag.id}-label`}>
                    {tag.label}
                  </motion.span>
                </motion.button>
              ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
