// app/admin/cv/_components/cv-form.tsx

'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { uploadCVAction, deleteCVAction } from '../actions'
import { type ProfileSettings } from '@/lib/supabase/queries/profile'

interface CVFormProps {
  initialSettings: ProfileSettings | null
}

export function CVForm({ initialSettings }: CVFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  const hasCV = !!initialSettings?.cv_url

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMsg(null)
    const file = e.target.files?.[0]
    if (!file) {
      setSelectedFile(null)
      return
    }

    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files (.pdf) are allowed.')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10 MB limit.')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setSelectedFile(file)
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFile) {
      setErrorMsg('Please select a PDF file first.')
      return
    }

    startTransition(async () => {
      setErrorMsg(null)
      const formData = new FormData()
      formData.append('cv_file', selectedFile)

      const result = await uploadCVAction(null, formData)

      if (result.errors) {
        const msg =
          result.errors.cv_file || result.errors.root || 'Failed to upload CV.'
        setErrorMsg(msg)
        toast.error(msg)
      } else if (result.success) {
        toast.success(result.message || 'CV updated successfully!')
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        router.refresh()
      }
    })
  }

  function handleDelete() {
    if (!confirm('Are you sure you want to remove the current CV?')) return

    startDeleteTransition(async () => {
      setErrorMsg(null)
      const result = await deleteCVAction()

      if (result.errors) {
        const msg = result.errors.root || 'Failed to delete CV.'
        setErrorMsg(msg)
        toast.error(msg)
      } else if (result.success) {
        toast.success('CV deleted successfully.')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-8">
      {errorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* ── Active CV Card ── */}
      <div className="border-border bg-card rounded-xl border p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Current Active CV</h3>
                {hasCV ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Live
                  </span>
                ) : (
                  <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
                    Default Fallback
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {hasCV
                  ? initialSettings?.cv_file_name || 'Active CV Document'
                  : 'Using static public/file/cv.pdf'}
              </p>
              {hasCV && initialSettings?.updated_at && (
                <p className="text-muted-foreground/70 mt-1 text-xs">
                  Last updated:{' '}
                  {new Date(initialSettings.updated_at).toLocaleDateString(
                    'en-US',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  )}
                </p>
              )}
            </div>
          </div>

          {hasCV && (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <a
                  href={initialSettings.cv_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </a>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting || isPending}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Upload New CV Form ── */}
      <div className="border-border bg-card rounded-xl border p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold">Upload New CV</h3>
          <p className="text-muted-foreground text-sm">
            Upload any PDF file from your computer. Uploading a new file will
            automatically replace the old one.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-border hover:border-primary/50 hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
              selectedFile ? 'border-primary/60 bg-primary/5' : ''
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center text-center">
                <FileCheck className="text-primary mb-2 h-10 w-10" />
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedFile.name}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to
                  upload
                </p>
                <span className="text-primary mt-2 text-xs hover:underline">
                  Click to choose a different file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <Upload className="text-muted-foreground mb-2 h-10 w-10" />
                <p className="text-sm font-medium">
                  Click to select PDF or drag and drop
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  PDF format only (Max 10 MB)
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {selectedFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              disabled={!selectedFile || isPending}
              className="min-w-[130px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Save & Replace CV
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
