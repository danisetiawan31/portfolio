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
      title="Salin Ringkasan untuk HR (Summary)"
      className={`group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:bg-zinc-950 ${
        className ?? ''
      }`}
    >
      {/* shine sweep */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-zinc-100/60 transition-transform duration-700 group-hover:translate-x-[200%] dark:bg-white/5"
      />

      {copied ? (
        <>
          <Check className="relative h-[18px] w-[18px] text-emerald-600 dark:text-emerald-400" />
          <span className="relative text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Copied!
          </span>
        </>
      ) : (
        <>
          <ClipboardList className="relative h-[18px] w-[18px] text-zinc-900 dark:text-zinc-100" />
          <span className="relative text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Summary
          </span>
        </>
      )}
    </motion.button>
  )
}
