// lib/utils/recruiter-summary.test.ts

import { describe, it, expect } from 'vitest'
import { generateRecruiterSummary } from './recruiter-summary'
import { type Project } from '@/lib/supabase/queries/projects'
import { type Skill } from '@/lib/supabase/queries/skills'

describe('generateRecruiterSummary', () => {
  it('generates summary with default fallback data', () => {
    const summary = generateRecruiterSummary({})
    expect(summary).toContain('AHMAD DHANI SETIAWAN')
    expect(summary).toContain('portfolio-dhani.vercel.app')
    expect(summary).toContain('https://github.com/danisetiawan31')
  })

  it('formats custom projects and skills dynamically', () => {
    const mockProjects: Partial<Project>[] = [
      {
        id: '1',
        title: 'Custom Attendance App',
        slug: 'custom-attendance-app',
        description: 'Test desc',
        tech_stack: ['Next.js'],
        is_featured: true,
        display_order: 1,
        created_at: '',
        updated_at: '',
        thumbnail_url: null,
        live_url: null,
        github_url: null,
      },
    ]

    const mockSkills: Partial<Skill>[] = [
      {
        id: 's1',
        name: 'TypeScript',
        category: 'language',
        proficiency: 90,
        is_visible: true,
        display_order: 1,
        created_at: '',
        updated_at: '',
      },
      {
        id: 's2',
        name: 'PostgreSQL',
        category: 'database',
        proficiency: 85,
        is_visible: true,
        display_order: 2,
        created_at: '',
        updated_at: '',
      },
    ]

    const summary = generateRecruiterSummary({
      projects: mockProjects as Project[],
      skills: mockSkills as Skill[],
      cvUrl: 'https://example.com/cv.pdf',
    })

    expect(summary).toContain(
      '1. Custom Attendance App: https://portfolio-dhani.vercel.app/projects/custom-attendance-app',
    )
    expect(summary).toContain('TypeScript, PostgreSQL')
    expect(summary).toContain('Resume (CV): https://example.com/cv.pdf')
  })
})
