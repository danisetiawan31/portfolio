import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn (classNames merger)', () => {
  it('combines simple class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional class names properly', () => {
    const isPrimary = true
    const isDisabled = false
    expect(
      cn('btn', isPrimary && 'btn-primary', isDisabled && 'btn-disabled'),
    ).toBe('btn btn-primary')
  })

  it('correctly resolves and merges conflicting Tailwind classes using tailwind-merge', () => {
    expect(cn('px-4 px-8', 'text-red-500 text-blue-500')).toBe(
      'px-8 text-blue-500',
    )
  })
})
