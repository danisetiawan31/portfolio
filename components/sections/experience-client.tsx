'use client'

import { motion, type Variants } from 'framer-motion'
import { Code2 } from 'lucide-react'
import { type Experience } from '@/lib/supabase/queries/experiences'
import { TechBadge } from '@/components/common/tech-badge'

// ── Animation variants ──────────────────────────────────────────────────────

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 65, damping: 16 },
  },
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function dateRange(exp: Experience): string {
  const start = formatDate(exp.start_date)
  if (exp.is_current) return `${start} – Present`
  if (exp.end_date) return `${start} – ${formatDate(exp.end_date)}`
  return start
}

// ── Type badge ───────────────────────────────────────────────────────────────

type BadgeStyle = { wrapper: string; label: string }

const TYPE_BADGE: Record<string, BadgeStyle> = {
  'full-time': {
    wrapper: 'bg-violet-500/10 dark:bg-violet-400/10',
    label: 'text-violet-700 dark:text-violet-300',
  },
  internship: {
    wrapper: 'bg-blue-500/10 dark:bg-blue-400/10',
    label: 'text-blue-700 dark:text-blue-300',
  },
  freelance: {
    wrapper: 'bg-amber-500/10 dark:bg-amber-400/10',
    label: 'text-amber-700 dark:text-amber-300',
  },
  'part-time': {
    wrapper: 'bg-zinc-100 dark:bg-zinc-800',
    label: 'text-zinc-600 dark:text-zinc-400',
  },
}

function TypeBadge({ type }: { type: string }) {
  const style = TYPE_BADGE[type] ?? TYPE_BADGE['part-time']
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide capitalize ${style.wrapper} ${style.label}`}
    >
      {type.replace(/-/g, '\u2011')}
    </span>
  )
}

// ── Company logo placeholder ─────────────────────────────────────────────────

function CompanyLogo({ company }: { company: string }) {
  const initials = company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 dark:border-violet-900/40 dark:bg-violet-950/30">
      <Code2 className="h-6 w-6 text-violet-500 dark:text-violet-400" />
      <span className="sr-only">{initials}</span>
    </div>
  )
}

// ── Timeline item ─────────────────────────────────────────────────────────────

function TimelineItem({
  experience,
  isLast,
}: {
  experience: Experience
  isLast: boolean
}) {
  const range = dateRange(experience)

  return (
    <motion.li variants={itemVariants} className="relative flex gap-5">
      {/* Left: dot + line */}
      <div className="flex flex-col items-center pt-1">
        <div className="relative z-10 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center">
          <div className="bg-background h-3 w-3 rounded-full border-2 border-violet-500" />
          {experience.is_current && (
            <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-violet-500/40" />
          )}
        </div>
        {!isLast && (
          <div className="mt-2 w-px flex-1 bg-gradient-to-b from-zinc-200 to-transparent dark:from-zinc-700" />
        )}
      </div>

      {/* Right: date row + card */}
      <div className={`flex flex-1 flex-col ${isLast ? 'pb-0' : 'pb-10'}`}>
        {/* Date + type */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            {experience.is_current && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
            <span className="font-mono text-[12px] tracking-tight text-zinc-400 tabular-nums dark:text-zinc-500">
              {range}
            </span>
          </div>
          <TypeBadge type={experience.type} />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/60">
          {/* Header: logo + role + company */}
          <div className="flex gap-4">
            <CompanyLogo company={experience.company} />
            <div className="flex flex-col justify-center">
              <h3 className="font-heading text-lg leading-tight font-bold text-zinc-900 dark:text-zinc-100">
                {experience.role}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-violet-600 dark:text-violet-400">
                {experience.company}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-zinc-100 dark:bg-zinc-800" />

          {/* Description */}
          {experience.description && (
            <div>
              <p className="mb-2.5 text-[12px] font-semibold tracking-widest text-violet-600 uppercase dark:text-violet-400">
                Tanggung Jawab
              </p>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {experience.description}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          {experience.tech_stack.length > 0 && (
            <>
              <div className="my-4 h-px bg-zinc-100 dark:bg-zinc-800" />
              <div>
                <p className="mb-2.5 text-[12px] font-semibold tracking-widest text-violet-600 uppercase dark:text-violet-400">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {experience.tech_stack.map((tech) => (
                    <TechBadge key={tech} label={tech} size="md" />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.li>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-800">
      <p className="text-sm text-zinc-400">
        No experience entries yet. Check back soon!
      </p>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ExperienceClient({
  experiences,
}: {
  experiences: Experience[]
}) {
  if (experiences.length === 0) return <EmptyState />

  return (
    <motion.ul
      className="flex flex-col"
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {experiences.map((exp, idx) => (
        <TimelineItem
          key={exp.id}
          experience={exp}
          isLast={idx === experiences.length - 1}
        />
      ))}
    </motion.ul>
  )
}
