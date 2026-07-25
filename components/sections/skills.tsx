// components/sections/skills.tsx

import { SectionContainer } from '@/components/common/section-container'
import { SectionHeader } from '@/components/common/section-header'
import { getPublicSkills } from '@/lib/supabase/queries/skills'
import { SkillsGrid } from './skills-grid'

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
      <p className="text-muted-foreground text-sm">
        No skills listed yet. Check back soon!
      </p>
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default async function SkillsSection() {
  const skills = await getPublicSkills()

  return (
    <SectionContainer id="skills">
      <SectionHeader
        title="Skills & Toolkit"
        subtitle="Tools I reach for consistently, grouped by where they sit in the stack."
      />

      {skills.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mx-auto mt-12 w-full max-w-5xl">
          <SkillsGrid skills={skills} />
        </div>
      )}
    </SectionContainer>
  )
}
