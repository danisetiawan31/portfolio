'use client'

import { type Skill } from '@/lib/supabase/queries/skills'
import {
  LayoutTemplate,
  Server,
  Database,
  CheckCircle2,
  Wrench,
  Sparkles,
} from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { TechBadge } from '@/components/common/tech-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  inferSkillCategory,
  type CategoryType,
} from '@/app/admin/skills/constants'

interface SkillsGridProps {
  skills: Skill[]
}

interface CategoryMeta {
  label: string
  subtitle: string
  icon: React.ReactNode
  number: string
  colSpan: string
}

const CATEGORY_META: Record<CategoryType, CategoryMeta> = {
  frontend_mobile: {
    label: 'FRONTEND & MOBILE',
    subtitle: 'User interfaces & cross-platform mobile apps',
    icon: <LayoutTemplate className="text-primary h-4.5 w-4.5" />,
    number: '01',
    colSpan: 'lg:col-span-2',
  },
  backend: {
    label: 'BACKEND & APIS',
    subtitle: 'RESTful architectures, microservices & real-time',
    icon: <Server className="text-primary h-4.5 w-4.5" />,
    number: '02',
    colSpan: 'lg:col-span-2',
  },
  database_caching: {
    label: 'DATABASE & CACHING',
    subtitle: 'Relational, document stores & memory caches',
    icon: <Database className="text-primary h-4.5 w-4.5" />,
    number: '03',
    colSpan: 'lg:col-span-2',
  },
  testing: {
    label: 'TESTING & QA',
    subtitle: 'End-to-end automation, unit tests & quality gates',
    icon: <CheckCircle2 className="text-primary h-4.5 w-4.5" />,
    number: '04',
    colSpan: 'lg:col-span-3',
  },
  tools_devops: {
    label: 'DEVOPS & TOOLS',
    subtitle: 'Containers, cloud infrastructure & dev tooling',
    icon: <Wrench className="text-primary h-4.5 w-4.5" />,
    number: '05',
    colSpan: 'lg:col-span-3',
  },
}

const DEFAULT_CATEGORY_ORDER: CategoryType[] = [
  'frontend_mobile',
  'backend',
  'database_caching',
  'testing',
  'tools_devops',
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  // Group skills by dynamically inferred category for precision
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      // Use intelligent categorization based on skill name
      const cat = inferSkillCategory(skill.name)
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(skill)
      return acc
    },
    {} as Record<CategoryType, Skill[]>,
  )

  return (
    <TooltipProvider delayDuration={120}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6"
      >
        {DEFAULT_CATEGORY_ORDER.map((catKey) => {
          const meta = CATEGORY_META[catKey]
          const categorySkills = groupedSkills[catKey] || []

          return (
            <motion.div
              key={catKey}
              variants={cardVariants}
              className={`bg-card/70 border-border/80 group hover:border-primary/40 relative flex flex-col justify-between rounded-2xl border p-5 shadow-xs backdrop-blur-xs transition-all duration-300 hover:shadow-md sm:p-6 ${meta.colSpan}`}
            >
              {/* Header */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg">
                      {meta.icon}
                    </div>
                    <h3 className="text-foreground text-xs font-bold tracking-wider uppercase sm:text-sm">
                      {meta.label}
                    </h3>
                  </div>
                  <span className="text-muted-foreground/40 font-mono text-[11px]">
                    / {meta.number}
                  </span>
                </div>

                <p className="text-muted-foreground mb-5 line-clamp-1 text-xs">
                  {meta.subtitle}
                </p>

                {/* Interactive Icon Tiles with Floating Tooltip */}
                <div className="flex flex-wrap gap-2.5">
                  {categorySkills.length > 0 ? (
                    categorySkills.map((skill) => (
                      <Tooltip key={skill.id}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="group/tile border-border/80 bg-background/80 hover:border-primary/60 hover:bg-primary/5 focus-visible:ring-primary relative flex size-11 items-center justify-center rounded-xl border p-2 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:shadow-md focus-visible:ring-2 focus-visible:outline-hidden"
                            aria-label={skill.name}
                          >
                            <TechBadge
                              label={skill.name}
                              size="md"
                              className="border-0 bg-transparent p-0 shadow-none hover:scale-100 dark:border-0 dark:bg-transparent"
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={6}
                          className="bg-popover text-popover-foreground border-border/80 border text-xs font-medium tracking-wide shadow-md"
                        >
                          {skill.name}
                        </TooltipContent>
                      </Tooltip>
                    ))
                  ) : (
                    <div className="border-border/70 text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs">
                      <Sparkles className="text-primary/60 size-3.5" />
                      <span>Stack continuously expanding</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative Corner Accents */}
              <div className="border-primary/0 group-hover:border-primary/40 pointer-events-none absolute top-0 left-0 h-3 w-3 rounded-tl-2xl border-t-2 border-l-2 transition-colors" />
              <div className="border-primary/0 group-hover:border-primary/40 pointer-events-none absolute right-0 bottom-0 h-3 w-3 rounded-br-2xl border-r-2 border-b-2 transition-colors" />
            </motion.div>
          )
        })}
      </motion.div>
    </TooltipProvider>
  )
}
