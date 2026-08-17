import { describe, it, expect } from 'vitest'
import { parseTechStack } from './parse-tech-stack'

describe('parseTechStack', () => {
  it('splits comma-separated tech stack strings into trimmed lowercase array', () => {
    const input = 'Next.js, TypeScript, Tailwind CSS, Supabase'
    const result = parseTechStack(input)
    expect(result).toEqual([
      'next.js',
      'typescript',
      'tailwind css',
      'supabase',
    ])
  })

  it('removes duplicate entries', () => {
    const input = 'React, TypeScript, react, TYPESCRIPT, Next.js'
    const result = parseTechStack(input)
    expect(result).toEqual(['react', 'typescript', 'next.js'])
  })

  it('filters out empty or whitespace-only items', () => {
    const input = 'Next.js, , , TypeScript,   '
    const result = parseTechStack(input)
    expect(result).toEqual(['next.js', 'typescript'])
  })

  it('handles empty string input', () => {
    expect(parseTechStack('')).toEqual([])
  })
})
