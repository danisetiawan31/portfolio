import { describe, it, expect } from 'vitest'
import { resolveTechIcon } from './tech-badge'

describe('resolveTechIcon', () => {
  it('resolves local icons correctly', () => {
    expect(resolveTechIcon('React')).toBe('/icons/react.svg')
    expect(resolveTechIcon('TypeScript')).toBe('/icons/ts.svg')
    expect(resolveTechIcon('Tailwind CSS')).toBe('/icons/tail.svg')
    expect(resolveTechIcon('Laravel')).toBe('/icons/laravel.svg')
  })

  it('resolves dynamic Devicon CDN icons for stacks not in local folder', () => {
    expect(resolveTechIcon('Angular')).toContain('angular/angular-original.svg')
    expect(resolveTechIcon('Redis')).toContain('redis/redis-original.svg')
    expect(resolveTechIcon('Playwright')).toContain(
      'playwright/playwright-original.svg',
    )
    expect(resolveTechIcon('Prisma')).toContain('prisma/prisma-original.svg')
    expect(resolveTechIcon('FastAPI')).toContain('fastapi/fastapi-original.svg')
    expect(resolveTechIcon('Vitest')).toContain('vitest/vitest-original.svg')
  })

  it('handles variations and spaces smoothly', () => {
    expect(resolveTechIcon('vue.js')).toContain('vuejs/vuejs-original.svg')
    expect(resolveTechIcon('GitHub Actions')).toContain(
      'githubactions/githubactions-original.svg',
    )
  })
})
