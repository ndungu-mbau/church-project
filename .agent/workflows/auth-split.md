---
description: Split auth configuration for mobile (Expo) and web platforms using better-auth plugins
---

# Auth Split Implementation Workflow

This workflow implements platform-specific authentication using a single `betterAuth` instance with custom plugins.

## Summary of Requirements

| Aspect               | Mobile (Expo)                              | Web Dashboard              |
| -------------------- | ------------------------------------------ | -------------------------- |
| **Auth Methods**     | Email/Password, OAuth, OTP                 | Email/Password, OAuth, OTP |
| **Role Restriction** | None (all roles allowed)                   | Reject `member` role       |
| **Registration**     | Self-register (creates guest if no record) | Invite-only                |
| **Sessions**         | Shared                                     | Shared                     |

---

## Phase 1: Create Platform Detection Plugin

Create a plugin that detects the request origin (mobile vs web) and attaches context.

### Step 1.1: Create `platform-detector` plugin folder

```bash
mkdir -p packages/auth/src/plugins/platform-detector
```

### Step 1.2: Create `packages/auth/src/plugins/platform-detector/server.ts`

```typescript
import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";

export type Platform = "mobile" | "web" | "unknown";

export const platformDetectorPlugin = () => {
  return {
    id: "platform-detector",
    hooks: {
      before: [
        {
          matcher: () => true, // Match all requests
          handler: createAuthMiddleware(async (ctx) => {
            // Detect platform from headers
            const userAgent = ctx.headers?.get("user-agent") || "";
            const xPlatform = ctx.headers?.get("x-platform"); // Custom header from clients

            let platform: Platform = "unknown";

            if (xPlatform === "mobile" || xPlatform === "expo") {
              platform = "mobile";
            } else if (xPlatform === "web") {
              platform = "web";
            } else if (
              userAgent.includes("Expo") ||
              userAgent.includes("okhttp")
            ) {
              platform = "mobile";
            } else if (
              userAgent.includes("Mozilla") ||
              userAgent.includes("Chrome")
            ) {
              platform = "web";
            }

            // Attach platform to context for downstream plugins
            (ctx as any).platform = platform;
            return;
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};
```

### Step 1.3: Create `packages/auth/src/plugins/platform-detector/index.ts`

```typescript
export * from "./server";
```

---

## Phase 2: Create Web Auth Plugin (Role Enforcement)

This plugin rejects `member` role logins on web.

### Step 2.1: Create `web-auth` plugin folder

```bash
mkdir -p packages/auth/src/plugins/web-auth
```

### Step 2.2: Create `packages/auth/src/plugins/web-auth/server.ts`

```typescript
import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import type { Platform } from "../platform-detector/server";

// Toggle: Set to false to allow members on web
const REJECT_MEMBERS_ON_WEB = true;

export const webAuthPlugin = () => {
  return {
    id: "web-auth",
    hooks: {
      after: [
        {
          matcher: (ctx) => {
            // Match sign-in related paths
            return (
              ctx.path.includes("/sign-in") || ctx.path.includes("/callback")
            );
          },
          handler: createAuthMiddleware(async (ctx) => {
            const platform = (ctx as any).platform as Platform;

            // Only enforce on web platform
            if (platform !== "web") {
              return;
            }

            // Check if toggle is enabled
            if (!REJECT_MEMBERS_ON_WEB) {
              return;
            }

            // Get user from session/response
            const user = ctx.context?.newSession?.user;

            if (user && user.role === "member") {
              throw new APIError("FORBIDDEN", {
                message:
                  "Members cannot access the web dashboard. Please use the mobile app.",
              });
            }

            return;
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};
```

### Step 2.3: Create `packages/auth/src/plugins/web-auth/index.ts`

```typescript
export * from "./server";
```

---

## Phase 3: Create Mobile Auth Plugin (Guest Creation)

This plugin creates guest profiles for new self-registering members.

### Step 3.1: Create `mobile-auth` plugin folder

```bash
mkdir -p packages/auth/src/plugins/mobile-auth
```

### Step 3.2: Create `packages/auth/src/plugins/mobile-auth/server.ts`

```typescript
import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";
import { db } from "@church-project/db";
import { members } from "@church-project/db/schema/members";
import { profiles } from "@church-project/db/schema/profiles";
import { eq } from "drizzle-orm";
import type { Platform } from "../platform-detector/server";

export const mobileAuthPlugin = () => {
  return {
    id: "mobile-auth",
    hooks: {
      after: [
        {
          matcher: (ctx) => {
            return (
              ctx.path.includes("/sign-up") || ctx.path.includes("/callback")
            );
          },
          handler: createAuthMiddleware(async (ctx) => {
            const platform = (ctx as any).platform as Platform;

            // Only run for mobile registrations (optional: can also run for all)
            // Remove this check if you want guest creation for all platforms
            if (platform !== "mobile") {
              return;
            }

            const user = ctx.context?.newSession?.user;

            if (!user) {
              return;
            }

            // Check if user already has a linked member record
            const existingMember = await db.query.members.findFirst({
              where: eq(members.userId, user.id),
            });

            if (existingMember) {
              // Already linked, no need to create guest
              return;
            }

            // Check if profile-linker already linked via email
            const linkedByEmail = await db.query.members.findFirst({
              where: eq(members.email, user.email),
            });

            if (linkedByEmail) {
              // Will be/was handled by profile-linker
              return;
            }

            // Create empty profile for guest
            const [newProfile] = await db
              .insert(profiles)
              .values({
                userId: user.id,
                // Empty profile - no details yet
              })
              .returning();

            // Create empty member record (guest member - no church assignment)
            await db.insert(members).values({
              userId: user.id,
              profileId: newProfile.id,
              email: user.email,
              // No churchId means "Global Church" / unassigned
            });

            // User role is already 'guest' by default from better-auth config

            return;
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};
```

### Step 3.3: Create `packages/auth/src/plugins/mobile-auth/index.ts`

```typescript
export * from "./server";
```

---

## Phase 4: Update Profile Linker Plugin

Ensure the profile-linker runs for all platforms (it's already universal, just verify).

### Step 4.1: Review `packages/auth/src/plugins/profile-linker/server.ts`

The current implementation already:

- Triggers on `/sign-up` and `/callback`
- Links members and staff by email
- Works for both platforms

**No changes needed** unless you want to also check by phone number.

---

## Phase 5: Configure OAuth Providers

### Step 5.1: Install OAuth dependencies (if needed)

```bash
pnpm add @better-auth/oauth --filter @church-project/auth
```

### Step 5.2: Update `packages/auth/src/index.ts` with OAuth providers

Add desired providers (Google, Microsoft, etc.) to the config:

```typescript
import { google, microsoft } from "better-auth/plugins";

export const auth = betterAuth({
  // ... existing config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    // Add more as needed
  },
});
```

---

## Phase 6: Update Main Auth Config

### Step 6.1: Update `packages/auth/src/index.ts`

```typescript
import { expo } from "@better-auth/expo";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@church-project/db";
import * as schema from "@church-project/db/schema/auth";
import crypto from "node:crypto";

// Plugins
import { platformDetectorPlugin } from "./plugins/platform-detector";
import { profileLinkerPlugin } from "./plugins/profile-linker";
import { webAuthPlugin } from "./plugins/web-auth";
import { mobileAuthPlugin } from "./plugins/mobile-auth";
import { otpPluginServer } from "./plugins/otp-plugin";

// Re-exports
export * from "./plugins/otp-plugin";
export * from "./plugins/profile-linker";
export * from "./plugins/platform-detector";
export * from "./plugins/web-auth";
export * from "./plugins/mobile-auth";

export const auth = betterAuth<BetterAuthOptions>({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: ["*"],
  emailAndPassword: {
    enabled: true,
  },
  // OAuth providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "guest",
        input: false,
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  plugins: [
    // Order matters: platform detector first, then others
    platformDetectorPlugin(),
    profileLinkerPlugin(),
    webAuthPlugin(),
    mobileAuthPlugin(),
    otpPluginServer(),
    expo(),
  ],
});
```

---

## Phase 7: Client-Side Updates

### Step 7.1: Add `x-platform` header to Expo client

In your Expo app's auth client setup, add a custom header:

```typescript
import { createAuthClient } from "better-auth/client";
import { expoClient } from "@better-auth/expo/client";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  fetchOptions: {
    headers: {
      "x-platform": "mobile",
    },
  },
  plugins: [expoClient()],
});
```

### Step 7.2: Add `x-platform` header to Web client

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    headers: {
      "x-platform": "web",
    },
  },
});
```

---

## Phase 8: Verification

### Step 8.1: Test mobile registration (guest creation)

1. Register a new user from Expo app with email not in database
2. Verify a `guest` role user is created
3. Verify empty `profile` and `member` records are created

### Step 8.2: Test mobile registration (existing member)

1. Register with an email that exists in `members` table
2. Verify profile-linker links the user
3. Verify no duplicate records are created

### Step 8.3: Test web login rejection

1. Try to login from web with a `member` role user
2. Verify FORBIDDEN error is returned
3. Change `REJECT_MEMBERS_ON_WEB` to `false` and retry

### Step 8.4: Test admin web login

1. Login from web with an `admin` or `staff` role user
2. Verify login succeeds

---

## Plugin Order Summary

```
Request → platformDetectorPlugin (detect platform)
        → profileLinkerPlugin (link by email after sign-up)
        → webAuthPlugin (reject members on web)
        → mobileAuthPlugin (create guest records)
        → otpPluginServer (OTP endpoints)
        → expo (mobile session handling)
```

---

## Environment Variables Required

```env
# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Optional: Add more providers
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
```
