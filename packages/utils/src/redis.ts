import { Redis } from '@upstash/redis'

let redisClient: Redis | null = null

/**
 * Get or create an Upstash Redis client instance (singleton pattern)
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in environment variables'
      )
    }

    redisClient = new Redis({
      url,
      token,
    })
  }

  return redisClient
}

/**
 * Reset the Redis client (mainly for testing)
 */
export function resetRedisClient(): void {
  redisClient = null
}

/**
 * OTP Storage utilities using Upstash Redis
 */
export const otpStorage = {
  /**
   * Store an OTP code with expiration
   * @param identifier - Phone number or email
   * @param code - OTP code
   * @param expirationMinutes - Expiration time in minutes (default: 10)
   */
  async set(identifier: string, code: string, expirationMinutes = 10): Promise<void> {
    const client = getRedisClient()
    const key = `otp:${identifier}`
    const expirationSeconds = expirationMinutes * 60
    
    await client.set(key, code, { ex: expirationSeconds })
  },

  /**
   * Retrieve an OTP code
   * @param identifier - Phone number or email
   * @returns The OTP code or null if not found/expired
   */
  async get(identifier: string): Promise<string | null> {
    const client = getRedisClient()
    const key = `otp:${identifier}`
    
    return await client.get<string>(key)
  },

  /**
   * Delete an OTP code
   * @param identifier - Phone number or email
   */
  async delete(identifier: string): Promise<void> {
    const client = getRedisClient()
    const key = `otp:${identifier}`
    
    await client.del(key)
  },

  /**
   * Check if an OTP code exists
   * @param identifier - Phone number or email
   */
  async exists(identifier: string): Promise<boolean> {
    const client = getRedisClient()
    const key = `otp:${identifier}`
    
    const result = await client.exists(key)
    return result === 1
  },

  /**
   * Get remaining TTL for an OTP code
   * @param identifier - Phone number or email
   * @returns TTL in seconds, -1 if no expiration, -2 if key doesn't exist
   */
  async ttl(identifier: string): Promise<number> {
    const client = getRedisClient()
    const key = `otp:${identifier}`
    
    return await client.ttl(key)
  },

  /**
   * Increment failed attempts counter
   * @param identifier - Phone number or email
   * @param _maxAttempts - Maximum allowed attempts before blocking (reserved for future use)
   * @param blockMinutes - How long to block after max attempts
   * @returns Current attempt count
   */
  async incrementAttempts(
    identifier: string,
    _maxAttempts = 5,
    blockMinutes = 15
  ): Promise<number> {
    const client = getRedisClient()
    const attemptsKey = `otp:attempts:${identifier}`
    
    const attempts = await client.incr(attemptsKey)
    
    // Set expiration on first attempt
    if (attempts === 1) {
      await client.expire(attemptsKey, blockMinutes * 60)
    }
    
    return attempts
  },

  /**
   * Get current attempt count
   * @param identifier - Phone number or email
   */
  async getAttempts(identifier: string): Promise<number> {
    const client = getRedisClient()
    const attemptsKey = `otp:attempts:${identifier}`
    
    const attempts = await client.get<string>(attemptsKey)
    return attempts ? Number.parseInt(attempts, 10) : 0
  },

  /**
   * Reset attempts counter
   * @param identifier - Phone number or email
   */
  async resetAttempts(identifier: string): Promise<void> {
    const client = getRedisClient()
    const attemptsKey = `otp:attempts:${identifier}`
    
    await client.del(attemptsKey)
  },
}

/**
 * Session storage utilities for better-auth
 * This can be used as secondaryStorage in better-auth config
 */
export const sessionStorage = {
  async get(key: string): Promise<string | null> {
    const client = getRedisClient()
    return await client.get<string>(key)
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = getRedisClient()
    
    if (ttlSeconds) {
      await client.set(key, value, { ex: ttlSeconds })
    } else {
      await client.set(key, value)
    }
  },

  async delete(key: string): Promise<void> {
    const client = getRedisClient()
    await client.del(key)
  },
}
