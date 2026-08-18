// components/ai/quick-prompts.tsx

'use client'

import { Sparkles, Code2, Briefcase, Mail } from 'lucide-react'

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void
  disabled?: boolean
}

const PROMPT_SUGGESTIONS = [
  {
    icon: Code2,
    label: 'Tech Stack & Keahlian',
    prompt: 'Apa keahlian dan tech stack utama yang dikuasai oleh Dhani?',
  },
  {
    icon: Sparkles,
    label: 'Project Unggulan',
    prompt:
      'Ceritakan project paling relevan dan menarik yang pernah dibuat Dhani.',
  },
  {
    icon: Briefcase,
    label: 'Riwayat Pengalaman',
    prompt: 'Bisa jelaskan ringkasan riwayat pengalaman kerja Dhani?',
  },
  {
    icon: Mail,
    label: 'Kontak & Rekrutmen',
    prompt:
      'Apakah Dhani terbuka untuk role Full-time/Freelance dan bagaimana cara menghubunginya?',
  },
]

export function QuickPrompts({ onSelectPrompt, disabled }: QuickPromptsProps) {
  return (
    <div className="space-y-2.5">
      <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
        Pertanyaan Cepat:
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {PROMPT_SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="border-border/80 bg-card hover:bg-primary/5 hover:border-primary/40 group text-foreground flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs shadow-2xs transition-all duration-150 disabled:pointer-events-none disabled:opacity-50"
          >
            <div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="truncate font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
