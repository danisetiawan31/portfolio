// lib/github/readme.test.ts

import { describe, it, expect } from 'vitest'
import { parseGitHubRepoUrl } from './readme'

describe('parseGitHubRepoUrl', () => {
  it('parses standard https github URL', () => {
    const result = parseGitHubRepoUrl(
      'https://github.com/danisetiawan31/absensi-karyawan-outsourcing',
    )
    expect(result).toEqual({
      owner: 'danisetiawan31',
      repo: 'absensi-karyawan-outsourcing',
    })
  })

  it('parses URL with trailing slash and .git suffix', () => {
    const result = parseGitHubRepoUrl(
      'https://github.com/danisetiawan31/pemancingan.git/',
    )
    expect(result).toEqual({
      owner: 'danisetiawan31',
      repo: 'pemancingan',
    })
  })

  it('returns null for invalid or empty URLs', () => {
    expect(parseGitHubRepoUrl('')).toBeNull()
    expect(parseGitHubRepoUrl(null)).toBeNull()
    expect(parseGitHubRepoUrl('https://example.com/other')).toBeNull()
  })
})
