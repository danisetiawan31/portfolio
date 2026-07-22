// components/sections/experiences.tsx

import { SectionContainer } from '@/components/common/section-container'
import { SectionHeader } from '@/components/common/section-header'
import { getPublicExperiences } from '@/lib/supabase/queries/experiences'
import { ExperienceClient } from './experience-client'

export default async function ExperiencesSection() {
  const experiences = await getPublicExperiences()

  return (
    <SectionContainer id="experience">
      <SectionHeader
        title="Experience"
        subtitle="My professional journey — roles, companies, and the tech I worked with."
      />
      <ExperienceClient experiences={experiences} />
    </SectionContainer>
  )
}
