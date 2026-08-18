// app/admin/ai/_components/ai-settings-form.tsx

'use client'

import { useActionState, useState } from 'react'
import {
  Eye,
  EyeOff,
  Sparkles,
  Bot,
  Key,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type AISettings } from '@/lib/supabase/queries/ai'
import { updateAISettingsAction, type AIActionResult } from '../actions'
import { DEFAULT_AI_MODEL, OPENROUTER_MODELS } from '../constants'

interface AISettingsFormProps {
  initialSettings: AISettings | null
}

export function AISettingsForm({ initialSettings }: AISettingsFormProps) {
  const [showKey, setShowKey] = useState(false)
  const [selectedModel, setSelectedModel] = useState(
    initialSettings?.ai_model || DEFAULT_AI_MODEL,
  )

  const [, formAction, isPending] = useActionState<
    AIActionResult | null,
    FormData
  >(async (prevState, formData) => {
    const result = await updateAISettingsAction(prevState, formData)
    if (result.success) {
      toast.success(result.message || 'Settings saved successfully.')
    } else if (result.errors?.root) {
      toast.error(result.errors.root)
    }
    return result
  }, null)

  const hasApiKey = Boolean(initialSettings?.openrouter_api_key)
  const hasCVText = Boolean(initialSettings?.cv_text_content)

  return (
    <form action={formAction} className="space-y-6">
      {/* ── Status Banner ── */}
      <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-2xs sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-foreground text-base font-semibold">
                AI Assistant Status
              </h2>
              <p className="text-muted-foreground text-xs">
                Powered by OpenRouter API & dynamic portfolio context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {hasApiKey ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Key Configured
              </span>
            ) : (
              <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium">
                <AlertCircle className="h-3.5 w-3.5" /> Env / Unset
              </span>
            )}
          </div>
        </div>

        <div className="border-border/60 text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-xs">
          <span>
            Active Model:{' '}
            <strong className="text-foreground">{selectedModel}</strong>
          </span>
          <span>•</span>
          <span>
            CV Knowledge:{' '}
            {hasCVText ? (
              <strong className="text-emerald-600 dark:text-emerald-400">
                Extracted ({initialSettings?.cv_text_content?.length} chars)
              </strong>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">
                Not Extracted{' '}
                <Link
                  href="/admin/cv"
                  className="hover:text-primary underline underline-offset-2"
                >
                  (Upload CV PDF)
                </Link>
              </span>
            )}
          </span>
        </div>
      </div>

      {/* ── 1. OpenRouter API Key ── */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-4 shadow-2xs sm:p-6">
        <div className="flex items-center gap-2">
          <Key className="text-primary h-4 w-4" />
          <h3 className="text-foreground text-base font-semibold">
            OpenRouter API Key
          </h3>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Paste your OpenRouter API key here. If left blank, the assistant will
          fallback to <code>OPENROUTER_API_KEY</code> in <code>.env.local</code>
          .
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="openrouter_api_key" className="text-xs font-medium">
            API Key
          </Label>
          <div className="relative">
            <Input
              id="openrouter_api_key"
              name="openrouter_api_key"
              type={showKey ? 'text' : 'password'}
              defaultValue={initialSettings?.openrouter_api_key || ''}
              placeholder="sk-or-v1-..."
              className="pr-10 font-mono text-xs"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 p-1"
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Model Selection ── */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-4 shadow-2xs sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" />
          <h3 className="text-foreground text-base font-semibold">
            Model Selection
          </h3>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Choose a model from OpenRouter. Free models ending with{' '}
          <code>:free</code> do not consume credits.
        </p>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {OPENROUTER_MODELS.map((model) => {
              const isSelected = selectedModel === model.id
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  className={`flex flex-col justify-between rounded-lg border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card hover:bg-muted/30 text-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs leading-tight font-semibold">
                      {model.name}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${
                        model.tier === 'Free'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {model.tier}
                    </span>
                  </div>
                  <span className="text-muted-foreground mt-2 truncate font-mono text-[11px]">
                    {model.id}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="space-y-1.5 pt-2">
            <Label htmlFor="ai_model" className="text-xs font-medium">
              Custom / Selected Model ID
            </Label>
            <Input
              id="ai_model"
              name="ai_model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              placeholder="e.g. nvidia/nemotron-3.5-lightning:free"
              className="font-mono text-xs"
              required
            />
          </div>
        </div>
      </div>

      {/* ── 3. Extracted CV Text Knowledge ── */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-4 shadow-2xs sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-primary h-4 w-4" />
            <h3 className="text-foreground text-base font-semibold">
              Extracted CV Content
            </h3>
          </div>
          <Button asChild variant="outline" size="sm" className="h-7 text-xs">
            <Link href="/admin/cv">Manage PDF CV</Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          This text is automatically extracted from your uploaded CV PDF. The AI
          uses this text as grounded context to answer recruiter questions. You
          can edit or refine it below.
        </p>

        <div className="space-y-1.5">
          <Textarea
            id="cv_text_content"
            name="cv_text_content"
            defaultValue={initialSettings?.cv_text_content || ''}
            placeholder="No CV text extracted yet. Upload a PDF in /admin/cv or paste your resume text here..."
            className="min-h-[160px] font-mono text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* ── 4. Custom AI Instructions / Persona ── */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-4 shadow-2xs sm:p-6">
        <div className="flex items-center gap-2">
          <Bot className="text-primary h-4 w-4" />
          <h3 className="text-foreground text-base font-semibold">
            Custom Persona & Instructions (Optional)
          </h3>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Provide extra guidelines for the AI (e.g. specific availability,
          salary expectations guidance, tone of voice, preferred contact
          method).
        </p>

        <div className="space-y-1.5">
          <Textarea
            id="custom_instructions"
            name="custom_instructions"
            defaultValue={initialSettings?.custom_instructions || ''}
            placeholder="e.g. Dhani is currently looking for Fullstack Developer roles (Remote/Hybrid in Jakarta). Always highlight his strong experience with Next.js, Go, and PostgreSQL..."
            className="min-h-[100px] text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* ── Submit Button ── */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="min-w-[140px]">
          {isPending ? 'Saving...' : 'Save AI Settings'}
        </Button>
      </div>
    </form>
  )
}
