'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Upload as IconUpload, X as IconX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ImageLightbox } from '@/components/common/image-lightbox'

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
}

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

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
          'group/file relative block w-full cursor-pointer overflow-hidden rounded-lg border border-dashed p-10 transition-colors',
          error ? 'border-destructive' : 'border-border',
          isDragging ? 'border-primary bg-primary/5' : 'bg-transparent',
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

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            Upload Image
          </p>
          <p className="relative z-20 mt-2 text-center font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
            Drag or drop your image here or click to upload
          </p>

          <div className="relative mx-auto mt-10 w-full max-w-xl">
            {preview ? (
              <motion.div
                layoutId="file-upload"
                className={cn(
                  'border-border relative z-40 mx-auto flex w-full flex-col items-center justify-start gap-6 overflow-hidden rounded-md border bg-white p-4 shadow-sm sm:flex-row sm:items-start dark:bg-neutral-900',
                )}
                onClick={(e) => e.stopPropagation()} // Prevent clicking card from opening file dialog again
              >
                {/* Image Lightbox Preview */}
                <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md shadow-inner">
                  <ImageLightbox
                    src={preview}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="h-full w-full"
                  />
                </div>

                {/* File Details */}
                <div className="flex w-full flex-1 flex-col gap-2">
                  <div className="flex w-full items-center justify-between gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="max-w-[12rem] truncate text-base font-medium text-neutral-700 sm:max-w-xs dark:text-neutral-300"
                    >
                      {fileDetails ? fileDetails.name : 'Current Image'}
                    </motion.p>
                    {fileDetails && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="shadow-input w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white"
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
                      className="w-fit rounded-md bg-gray-100 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                      {fileDetails.type}
                    </motion.p>
                  )}

                  <div className="mt-auto flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        inputRef.current?.click()
                      }}
                      disabled={disabled}
                      className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                      <IconUpload className="h-4 w-4" />
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemove}
                      disabled={disabled}
                      className="text-destructive hover:text-destructive/80 flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                      <IconX className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={cn(
                    'relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white shadow-[0px_10px_50px_rgba(0,0,0,0.1)] transition-colors group-hover/file:shadow-2xl dark:bg-neutral-900',
                    isDragging ? 'border-primary border' : '',
                  )}
                >
                  {isDragging ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-primary flex flex-col items-center text-sm font-medium"
                    >
                      Drop it
                      <IconUpload className="text-primary mt-1 h-5 w-5" />
                    </motion.p>
                  ) : (
                    <IconUpload className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                  )}
                </motion.div>

                <motion.div
                  variants={secondaryVariant}
                  className="border-primary absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed bg-transparent opacity-0"
                />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
