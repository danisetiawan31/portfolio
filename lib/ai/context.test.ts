import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildSystemPrompt } from './context'

vi.mock('@/lib/supabase/queries/projects', () => ({
  getPublicProjects: vi.fn(),
}))
vi.mock('@/lib/supabase/queries/experiences', () => ({
  getPublicExperiences: vi.fn(),
}))
vi.mock('@/lib/supabase/queries/skills', () => ({
  getPublicSkills: vi.fn(),
}))
vi.mock('@/lib/supabase/queries/certificates', () => ({
  getPublicCertificates: vi.fn(),
}))
vi.mock('@/lib/supabase/queries/ai', () => ({
  getAISettings: vi.fn(),
}))

import { getPublicProjects } from '@/lib/supabase/queries/projects'
import { getPublicExperiences } from '@/lib/supabase/queries/experiences'
import { getPublicSkills } from '@/lib/supabase/queries/skills'
import { getPublicCertificates } from '@/lib/supabase/queries/certificates'
import { getAISettings } from '@/lib/supabase/queries/ai'

describe('AI Assistant: buildSystemPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds system prompt with formatted projects, experiences, skills, and CV text', async () => {
    vi.mocked(getPublicProjects).mockResolvedValueOnce([
      {
        id: '1',
        title: 'Portfolio Web',
        slug: 'portfolio-web',
        description: 'Personal developer website',
        tech_stack: ['Next.js', 'Tailwind CSS'],
        live_url: 'https://example.com',
        github_url: 'https://github.com/example/repo',
        is_featured: true,
        display_order: 1,
        thumbnail_url: null,
        created_at: '',
        updated_at: '',
      },
    ])

    vi.mocked(getPublicExperiences).mockResolvedValueOnce([
      {
        id: '1',
        company: 'Tech Corp',
        role: 'Fullstack Developer',
        type: 'full-time',
        start_date: '2023-01-01',
        end_date: null,
        is_current: true,
        tech_stack: ['React', 'Go'],
        description: ['Built microservices', 'Optimized database'],
        display_order: 1,
        created_at: '',
        updated_at: '',
      },
    ])

    vi.mocked(getPublicSkills).mockResolvedValueOnce([
      {
        id: '1',
        name: 'TypeScript',
        category: 'languages',
        is_visible: true,
        display_order: 1,
        created_at: '',
        updated_at: '',
      },
    ])

    vi.mocked(getPublicCertificates).mockResolvedValueOnce([
      {
        id: '1',
        title: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        issue_date: '2024-05-10',
        is_featured: true,
        credential_url: 'https://aws.amazon.com',
        image_url: null,
        display_order: 1,
        created_at: '',
        updated_at: '',
      },
    ])

    vi.mocked(getAISettings).mockResolvedValueOnce({
      openrouter_api_key: 'sk-test',
      ai_model: 'nvidia/nemotron-3.5-lightning:free',
      cv_text_content: 'Graduated Computer Science with 3.9 GPA.',
      custom_instructions: 'Highlight remote readiness.',
      cv_file_name: 'cv.pdf',
      cv_url: 'https://example.com/cv.pdf',
      updated_at: '',
    })

    const prompt = await buildSystemPrompt()

    expect(prompt).toContain('Ahmad Dhani Setiawan')
    expect(prompt).toContain('Portfolio Web')
    expect(prompt).toContain('Tech Corp')
    expect(prompt).toContain('Built microservices')
    expect(prompt).toContain('LANGUAGES')
    expect(prompt).toContain('TypeScript')
    expect(prompt).toContain('AWS Certified Developer')
    expect(prompt).toContain('Graduated Computer Science with 3.9 GPA.')
    expect(prompt).toContain('Highlight remote readiness.')
  })
})
