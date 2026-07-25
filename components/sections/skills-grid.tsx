'use client'

import { type Skill } from '@/lib/supabase/queries/skills'
import { Code2, Database, LayoutTemplate, Server } from 'lucide-react'
import { motion, type Variants } from 'motion/react'

interface SkillsGridProps {
  skills: Skill[]
}

const CATEGORY_MAP: Record<
  string,
  { label: string; icon: React.ReactNode; number: string }
> = {
  languages: {
    label: 'LANGUAGES',
    icon: <Code2 className="text-primary h-5 w-5" />,
    number: '01',
  },
  frontend: {
    label: 'FRONTEND',
    icon: <LayoutTemplate className="text-primary h-5 w-5" />,
    number: '02',
  },
  backend_infra: {
    label: 'BACKEND & INFRA',
    icon: <Server className="text-primary h-5 w-5" />,
    number: '03',
  },
  database: {
    label: 'DATABASE',
    icon: <Database className="text-primary h-5 w-5" />,
    number: '04',
  },
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  // Desired render order
  const categoryOrder = ['languages', 'frontend', 'backend_infra', 'database']

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="grid w-full grid-cols-1 gap-6 md:grid-cols-2"
    >
      {categoryOrder.map((catKey) => {
        const categoryData = CATEGORY_MAP[catKey]
        const categorySkills = groupedSkills[catKey] || []

        return (
          <motion.div
            key={catKey}
            variants={cardVariants}
            className="bg-card border-border group relative flex flex-col rounded-xl border p-6 shadow-sm transition-all hover:shadow-md"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {categoryData.icon}
                <h3 className="text-foreground text-sm font-bold tracking-widest uppercase">
                  {categoryData.label}
                </h3>
              </div>
              <span className="text-muted-foreground/50 font-mono text-xs">
                / {categoryData.number}
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-3">
              {categorySkills.length > 0 ? (
                categorySkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="bg-background border-border text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center justify-center rounded border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors"
                  >
                    {skill.name}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm italic">
                  No skills yet
                </span>
              )}
            </div>

            {/* Corner accents */}
            <div className="border-primary/0 group-hover:border-primary/50 absolute top-0 left-0 h-4 w-4 rounded-tl-xl border-t-2 border-l-2 transition-colors" />
            <div className="border-primary/0 group-hover:border-primary/50 absolute right-0 bottom-0 h-4 w-4 rounded-br-xl border-r-2 border-b-2 transition-colors" />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
