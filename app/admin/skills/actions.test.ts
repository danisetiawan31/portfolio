import { describe, it, expect, vi, beforeEach } from 'vitest'
import { inferSkillCategory } from './constants'
import { syncSkillsFromProjects } from './actions'

vi.mock('@/lib/supabase/auth-guard', () => ({
  requireAuth: vi.fn().mockResolvedValue({ id: 'admin-123' }),
}))

const mockInsert = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: () => ({
    from: (table: string) => {
      if (table === 'projects') {
        return {
          select: () =>
            Promise.resolve({
              data: [
                { tech_stack: ['React', 'Angular', 'Go', 'Redis'] },
                { tech_stack: ['Next.js', 'PostgreSQL', 'Tailwind CSS'] },
              ],
              error: null,
            }),
        }
      }
      if (table === 'skills') {
        return {
          select: () =>
            Promise.resolve({
              data: [
                { name: 'React' },
                { name: 'Next.js' },
                { name: 'PostgreSQL' },
              ],
              error: null,
            }),
          insert: mockInsert.mockResolvedValue({ error: null }),
        }
      }
      return {}
    },
  }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Skills Admin Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('inferSkillCategory', () => {
    it('accurately categorizes frontend and mobile technologies', () => {
      expect(inferSkillCategory('Angular')).toBe('frontend_mobile')
      expect(inferSkillCategory('React')).toBe('frontend_mobile')
      expect(inferSkillCategory('Vue.js')).toBe('frontend_mobile')
      expect(inferSkillCategory('React Native')).toBe('frontend_mobile')
      expect(inferSkillCategory('Tailwind CSS')).toBe('frontend_mobile')
    })

    it('accurately categorizes backend technologies', () => {
      expect(inferSkillCategory('NestJS')).toBe('backend')
      expect(inferSkillCategory('Laravel')).toBe('backend')
      expect(inferSkillCategory('Go')).toBe('backend')
      expect(inferSkillCategory('FastAPI')).toBe('backend')
    })

    it('accurately categorizes databases and caching', () => {
      expect(inferSkillCategory('PostgreSQL')).toBe('database_caching')
      expect(inferSkillCategory('Redis')).toBe('database_caching')
      expect(inferSkillCategory('Prisma')).toBe('database_caching')
      expect(inferSkillCategory('MongoDB')).toBe('database_caching')
    })

    it('accurately categorizes testing frameworks', () => {
      expect(inferSkillCategory('Playwright')).toBe('testing')
      expect(inferSkillCategory('Vitest')).toBe('testing')
      expect(inferSkillCategory('Jest')).toBe('testing')
      expect(inferSkillCategory('Pest')).toBe('testing')
    })

    it('accurately categorizes devops & tools', () => {
      expect(inferSkillCategory('Docker')).toBe('tools_devops')
      expect(inferSkillCategory('GitHub Actions')).toBe('tools_devops')
      expect(inferSkillCategory('Git')).toBe('tools_devops')
    })
  })

  describe('syncSkillsFromProjects', () => {
    it('imports missing tech stacks from projects and avoids duplicates', async () => {
      const result = await syncSkillsFromProjects()
      expect(result.success).toBe(true)
      expect(result.count).toBe(4) // Angular, Go, Redis, Tailwind CSS
      expect(result.added).toEqual(
        expect.arrayContaining(['Angular', 'Go', 'Redis', 'Tailwind CSS']),
      )
      expect(mockInsert).toHaveBeenCalledTimes(1)
    })
  })
})
