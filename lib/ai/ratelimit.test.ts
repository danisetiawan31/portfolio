import { describe, it, expect, beforeEach } from 'vitest'
import { checkAIRateLimit } from './ratelimit'

describe('AI Assistant: Rate Limiter', () => {
  beforeEach(() => {
    // Fresh test context
  })

  it('allows requests within limit', async () => {
    const ip = `test-ip-${Date.now()}`
    const res1 = await checkAIRateLimit(ip)
    expect(res1.success).toBe(true)
    expect(res1.limit).toBe(10)
    expect(res1.remaining).toBe(9)

    const res2 = await checkAIRateLimit(ip)
    expect(res2.success).toBe(true)
    expect(res2.remaining).toBe(8)
  })

  it('blocks requests exceeding 10 messages per window', async () => {
    const ip = `test-blocked-ip-${Date.now()}`

    // Consume all 10 tokens
    for (let i = 0; i < 10; i++) {
      const res = await checkAIRateLimit(ip)
      expect(res.success).toBe(true)
    }

    // 11th request should be blocked
    const blockedRes = await checkAIRateLimit(ip)
    expect(blockedRes.success).toBe(false)
    expect(blockedRes.remaining).toBe(0)
    expect(blockedRes.reset).toBeGreaterThan(Date.now())
  })
})
