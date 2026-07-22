'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'

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
  // Convert defaultValue strings to Tag objects.
  // If the tag exists in `tags`, use it. If not, create it on-the-fly to support legacy data.
  const initialTags = defaultValue.map((val) => {
    const existing = tags.find(
      (t) =>
        t.id === val ||
        t.id === val.toLowerCase() ||
        t.label.toLowerCase() === val.toLowerCase(),
    )
    if (existing) return existing
    // legacy entry handling
    return { id: val, label: val }
  })

  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags)
  const selectedsContainerRef = useRef<HTMLDivElement>(null)

  const removeSelectedTag = (id: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== id))
  }

  const addSelectedTag = (tag: Tag) => {
    setSelectedTags((prev) => [...prev, tag])
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
    <div className="flex w-full flex-col">
      <input
        type="hidden"
        name={name}
        readOnly
        value={selectedTags.map((t) => t.label).join(', ')}
      />
      <motion.div
        className="no-scrollbar border-border bg-background mt-1 mb-2 flex h-12 w-full items-center justify-start gap-1.5 overflow-x-auto rounded-2xl border p-1.5"
        ref={selectedsContainerRef}
        layout
      >
        {selectedTags.map((tag) => (
          <motion.div
            key={tag.id}
            className="border-border bg-background flex h-full shrink-0 items-center gap-1 rounded-xl border py-1 pr-1 pl-3 shadow-sm"
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
              className="hover:bg-muted rounded-full p-0.5"
            >
              <X className="text-muted-foreground size-4" />
            </button>
          </motion.div>
        ))}
        {selectedTags.length === 0 && (
          <span className="text-muted-foreground px-2 text-sm italic">
            Select tags...
          </span>
        )}
      </motion.div>
      {tags.length > selectedTags.length && (
        <motion.div
          className="border-border bg-background w-full rounded-2xl border p-3 shadow-sm"
          layout
        >
          <motion.div className="flex flex-wrap gap-2">
            {tags
              .filter(
                (tag) =>
                  !selectedTags.some((selected) => selected.id === tag.id),
              )
              .map((tag) => (
                <motion.button
                  type="button"
                  key={tag.id}
                  layoutId={`tag-${tag.id}`}
                  className="bg-muted/60 hover:bg-muted flex shrink-0 items-center gap-1 rounded-full px-3 py-2 transition-colors"
                  onClick={() => addSelectedTag(tag)}
                >
                  <motion.span
                    layoutId={`tag-${tag.id}-label`}
                    className="text-foreground text-sm font-medium"
                  >
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
