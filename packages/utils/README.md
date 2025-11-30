# @church-project/utils

Utility functions and services for the church project.

## Features

- **Upstash Redis Client**: Serverless Redis client optimized for edge deployments
- **OTP Storage**: Complete OTP management with expiration, attempt tracking, and rate limiting
- **Session Storage**: Redis-based storage for better-auth's `secondaryStorage` option

## Installation

This package is part of the monorepo workspace. Install dependencies:

```bash
pnpm install
```

## Environment Variables

Configure Upstash Redis connection in your `.env` file. You can get these credentials from your [Upstash Console](https://console.upstash.com/):

```env
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_rest_token_here
```

> **Note**: Upstash uses REST API over HTTP, making it perfect for serverless and edge environments. No persistent connections needed!


## Usage

### Redis Client

```typescript
import { getRedisClient } from '@church-project/utils'

// Get Upstash Redis client
const redis = getRedisClient()

// Use the client (it's serverless, no need to close connections!)
await redis.set('key', 'value')
const value = await redis.get('key')
```


### OTP Storage

```typescript
import { otpStorage } from '@church-project/utils'

// Store an OTP (expires in 10 minutes by default)
await otpStorage.set('+1234567890', '123456')

// Store with custom expiration (e.g., 5 minutes)
await otpStorage.set('+1234567890', '123456', 5)

// Retrieve an OTP
const code = await otpStorage.get('+1234567890')

// Delete an OTP
await otpStorage.delete('+1234567890')

// Check if OTP exists
const exists = await otpStorage.exists('+1234567890')

// Get remaining time
const ttl = await otpStorage.ttl('+1234567890') // in seconds

// Track failed attempts
const attempts = await otpStorage.incrementAttempts('+1234567890')
if (attempts > 5) {
  throw new Error('Too many attempts. Please try again later.')
}

// Reset attempts after successful verification
await otpStorage.resetAttempts('+1234567890')
```

### Better-Auth Integration

Use the session storage as `secondaryStorage` in better-auth:

```typescript
import { betterAuth } from 'better-auth'
import { sessionStorage } from '@church-project/utils'

export const auth = betterAuth({
  // ... other config
  secondaryStorage: {
    get: async (key: string) => {
      const value = await sessionStorage.get(key)
      return value ? JSON.parse(value) : null
    },
    set: async (key: string, value: unknown, ttl?: number) => {
      await sessionStorage.set(key, JSON.stringify(value), ttl)
    },
    delete: async (key: string) => {
      await sessionStorage.delete(key)
    },
  },
})
```

### OTP Workflow Example

```typescript
import { otpStorage } from '@church-project/utils'

// 1. Generate and send OTP
const code = Math.floor(100000 + Math.random() * 900000).toString()
await otpStorage.set(phoneNumber, code, 10) // 10 minutes expiration

// Send code via SMS...

// 2. Verify OTP
const storedCode = await otpStorage.get(phoneNumber)
if (!storedCode) {
  throw new Error('OTP expired or not found')
}

// Track attempts
const attempts = await otpStorage.incrementAttempts(phoneNumber)
if (attempts > 5) {
  throw new Error('Too many attempts. Please try again later.')
}

if (code !== storedCode) {
  throw new Error('Invalid OTP code')
}

// Success - clean up
await otpStorage.delete(phoneNumber)
await otpStorage.resetAttempts(phoneNumber)
```

## API Reference

### `otpStorage`

- `set(identifier, code, expirationMinutes?)`: Store OTP with expiration
- `get(identifier)`: Retrieve OTP code
- `delete(identifier)`: Delete OTP code
- `exists(identifier)`: Check if OTP exists
- `ttl(identifier)`: Get remaining time in seconds
- `incrementAttempts(identifier, maxAttempts?, blockMinutes?)`: Track failed attempts
- `getAttempts(identifier)`: Get current attempt count
- `resetAttempts(identifier)`: Reset attempt counter

### `sessionStorage`

- `get(key)`: Retrieve session data
- `set(key, value, ttlSeconds?)`: Store session data with optional TTL
- `delete(key)`: Delete session data
