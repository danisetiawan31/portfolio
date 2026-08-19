// components/common/recruiter-summary-button.tsx
'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, ClipboardList } from 'lucide-react'
import { toast } from 'sonner'
import { type Project } from '@/lib/supabase/queries/projects'
import { type Skill } from '@/lib/supabase/queries/skills'
import { generateRecruiterSummary } from '@/lib/utils/recruiter-summary'

interface RecruiterSummaryButtonProps {
  projects?: Project[]
  skills?: Skill[]
  cvUrl?: string | null
  className?: string
}

export function RecruiterSummaryButton({
  projects = [],
  skills = [],
  cvUrl,
  className,
}: RecruiterSummaryButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      const summaryText = generateRecruiterSummary({
        projects,
        skills,
        cvUrl,
      })

      await navigator.clipboard.writeText(summaryText)
      setCopied(true)

      toast.success('Ringkasan Profil Berhasil Disalin! 📋', {
        description:
          'Format teks siap di-paste ke Notion, Slack, atau ATS hiring team.',
        duration: 4000,
      })

      setTimeout(() => {
        setCopied(false)
      }, 2500)
    } catch {
      toast.error('Gagal menyalin ringkasan', {
        description: 'Silakan coba lagi atau salin manual.',
      })
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label="Salin Ringkasan untuk HR"
      title="Salin Ringkasan untuk HR (Recruiter Quick-Packet)"
      className={`group border-border/80 bg-background/80 hover:border-primary/40 hover:bg-muted/60 relative flex items-center gap-2 overflow-hidden rounded-full border px-4 py-3 text-xs font-medium backdrop-blur-md transition-colors sm:text-sm ${
        className ?? ''
      }`}
    >
      {/* Subtle shine sweep on hover */}
      <span
        aria-hidden
        className="bg-primary/5 absolute inset-0 -translate-x-full skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-[200%]"
      />

      {copied ? (
        <>
          <Check className="relative h-4 w-4 text-emerald-500 transition-transform duration-200" />
          <span className="relative font-semibold text-emerald-600 dark:text-emerald-400">
            Tersalin!
          </span>
        </>
      ) : (
        <>
          <ClipboardList className="text-muted-foreground group-hover:text-primary relative h-4 w-4 transition-colors" />
          <span className="text-foreground/90 group-hover:text-foreground relative">
            <span className="hidden sm:inline">Salin </span>Ringkasan HR
          </span>
        </>
      )}
    </motion.button>
  )
}
