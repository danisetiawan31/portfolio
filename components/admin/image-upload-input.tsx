'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Upload as IconUpload, X as IconX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ImageLightbox } from '@/components/common/image-lightbox'

interface ImageUploadInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string | number | readonly string[]
  error?: boolean
}

export function ImageUploadInput({
  className,
  defaultValue,
  error,
  onChange,
  disabled,
  id,
  name,
  accept = 'image/jpeg,image/png,image/webp',
  ...props
}: ImageUploadInputProps) {
  const [preview, setPreview] = React.useState<string | null>(
    typeof defaultValue === 'string' && defaultValue !== ''
      ? defaultValue
      : null,
  )
  const [fileDetails, setFileDetails] = React.useState<{
    name: string
    size: string
    type: string
  } | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setFileDetails({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
      })
    } else {
      setPreview(
        typeof defaultValue === 'string' && defaultValue !== ''
          ? defaultValue
          : null,
      )
      setFileDetails(null)
    }

    if (onChange) {
      onChange(e)
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        if (inputRef.current) {
          inputRef.current.files = dataTransfer.files
          const event = new Event('change', { bubbles: true })
          inputRef.current.dispatchEvent(event)
          setPreview(URL.createObjectURL(file))
          setFileDetails({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: file.type,
          })
          if (onChange) {
            onChange({
              target: inputRef.current,
              currentTarget: inputRef.current,
              nativeEvent: event,
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        }
      }
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPreview(null)
    setFileDetails(null)
    if (inputRef.current) {
      inputRef.current.value = ''
      const event = new Event('change', { bubbles: true })
      inputRef.current.dispatchEvent(event)
      if (onChange) {
        onChange({
          target: inputRef.current,
          currentTarget: inputRef.current,
          nativeEvent: event,
        } as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    }
  }

  return (
    <div
      className={cn('w-full', className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={cn(
          'group/file relative block w-full cursor-pointer overflow-hidden rounded-xl border border-dashed p-4 transition-colors sm:p-6 md:p-8',
          error ? 'border-destructive bg-destructive/5' : 'border-border',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'bg-card/40 hover:bg-muted/20',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
          {...props}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] [background-size:16px_16px] dark:bg-[radial-gradient(#262626_1px,transparent_1px)]"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-foreground relative z-10 text-sm font-semibold sm:text-base">
            Upload Image
          </p>
          <p className="text-muted-foreground relative z-10 mt-1 text-xs sm:text-sm">
            Drag and drop your image here or tap to browse
          </p>

          <div className="relative mx-auto mt-4 w-full max-w-xl sm:mt-6">
            {preview ? (
              <motion.div
                layoutId="file-upload"
                className={cn(
                  'border-border bg-card relative z-10 mx-auto flex w-full flex-col items-center justify-start gap-4 overflow-hidden rounded-lg border p-3 shadow-2xs sm:flex-row sm:items-start sm:p-4',
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Lightbox Preview */}
                <div className="bg-muted flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border shadow-inner sm:h-24 sm:w-28">
                  <ImageLightbox
                    src={preview}
                    alt="Preview"
                    width={112}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* File Details */}
                <div className="flex w-full min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex w-full items-center justify-between gap-2">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-foreground truncate text-xs font-semibold sm:text-sm"
                    >
                      {fileDetails ? fileDetails.name : 'Current Image'}
                    </motion.p>
                    {fileDetails && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="bg-muted text-muted-foreground w-fit shrink-0 rounded-md px-1.5 py-0.5 text-[11px]"
                      >
                        {fileDetails.size}
                      </motion.p>
                    )}
                  </div>

                  {fileDetails && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="bg-muted/70 text-muted-foreground w-fit rounded px-1.5 py-0.5 font-mono text-[10px]"
                    >
                      {fileDetails.type}
                    </motion.p>
                  )}

                  <div className="border-border/60 mt-2 flex items-center justify-end gap-3 border-t pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        inputRef.current?.click()
                      }}
                      disabled={disabled}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                      <IconUpload className="h-3.5 w-3.5" />
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={handleRemove}
                      disabled={disabled}
                      className="text-destructive hover:text-destructive/80 flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                      <IconX className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  layoutId="file-upload"
                  whileHover={{ scale: 1.02 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={cn(
                    'bg-card border-border/80 group-hover/file:border-primary/50 relative z-10 mx-auto mt-2 flex h-24 w-full max-w-[7rem] items-center justify-center rounded-xl border shadow-xs transition-colors group-hover/file:shadow-md sm:h-28 sm:max-w-[8rem]',
                    isDragging ? 'border-primary' : '',
                  )}
                >
                  {isDragging ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-primary flex flex-col items-center text-xs font-medium"
                    >
                      Lepaskan di sini
                      <IconUpload className="text-primary mt-1 h-4 w-4" />
                    </motion.p>
                  ) : (
                    <IconUpload className="text-muted-foreground group-hover/file:text-primary h-5 w-5 transition-colors" />
                  )}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
