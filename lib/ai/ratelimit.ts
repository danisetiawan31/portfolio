// lib/ai/ratelimit.ts

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// In-memory fallback sliding window map for environments without Upstash credentials
const memoryStore = new Map<string, number[]>()

function checkMemoryRateLimit(
  identifier: string,
  limit = 10,
  windowMs = 10 * 60 * 1000, // 10 minutes
): RateLimitResult {
  const now = Date.now()
  const timestamps = memoryStore.get(identifier) || []
  const windowStart = now - windowMs

  // Prune expired timestamps
  const validTimestamps = timestamps.filter((t) => t > windowStart)

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0]
    const reset = oldest + windowMs
    memoryStore.set(identifier, validTimestamps)
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    }
  }

  validTimestamps.push(now)
  memoryStore.set(identifier, validTimestamps)

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    reset: now + windowMs,
  }
}

let upstashRatelimit: Ratelimit | null = null

function getUpstashRatelimit(): Ratelimit | null {
  if (upstashRatelimit) return upstashRatelimit

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    try {
      const redis = new Redis({ url, token })
      upstashRatelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 m'),
        analytics: true,
        prefix: 'portfolio:ratelimit:ai',
      })
    } catch (e) {
      console.warn(
        '[ratelimit] Failed to initialize Upstash Redis, using in-memory fallback:',
        e,
      )
    }
  }

  return upstashRatelimit
}

/**
 * Enforces rate limiting on the AI assistant endpoint (10 requests per 10 minutes per IP).
 */
export async function checkAIRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  const ratelimiter = getUpstashRatelimit()

  if (ratelimiter) {
    try {
      const result = await ratelimiter.limit(identifier)
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      }
    } catch (err) {
      console.warn(
        '[ratelimit] Upstash error, falling back to in-memory limit:',
        err,
      )
    }
  }

  return checkMemoryRateLimit(identifier)
}
