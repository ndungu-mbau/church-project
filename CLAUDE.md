# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a Turborepo monorepo using pnpm workspaces for a church management system called "Imani Manager".

### Tech Stack
- **Backend**: Express + tRPC + Better-Auth + Drizzle ORM + PostgreSQL
- **Admin Web**: React + TanStack Router + Vite + Radix UI (+ Tauri for desktop)
- **Client Mobile**: Expo + React Native + Expo Router (+ web support)
- **Code Quality**: Biome for linting and formatting, TypeScript for type safety
- **Build System**: Turborepo for monorepo orchestration

### Monorepo Structure

**Apps:**
- `@church-project/server`: Express backend serving tRPC and Better-Auth (port 3000)
- `@church-project/admin`: React admin web app with TanStack Router (port 3001)
- `@church-project/client`: Expo React Native app (supports iOS, Android, and Web)
- `@church-project/landing`: Public landing page
- `@church-project/docs`: Documentation site
- `@church-project/superuser`: Superuser management app

**Shared Packages:**
- `@church-project/api`: tRPC routers and context, defines all API procedures
- `@church-project/auth`: Better-Auth configuration with custom plugins
- `@church-project/db`: Drizzle schema and database connection
- `@church-project/utils`: Shared utilities
- `@church-project/config`: Shared TypeScript configuration

### Role-Based Access Control

The API uses tRPC middlewares for role-based authorization. Available procedures in `packages/api/src/trpc.ts`:

| Procedure | Auth Level | Church Subscription |
|-----------|------------|---------------------|
| `publicProcedure` | None | No |
| `protectedProcedure` | Authenticated user | No |
| `guestProcedure` | Same as `protectedProcedure` | No |
| `churchProtectedProcedure` | Authenticated | Must have active/trialing subscription |
| `superuserProcedure` | Authenticated + superadmin role | No |
| `adminProcedure` | Authenticated + admin role | Active subscription required |
| `staffProcedure` | Authenticated + staff/admin role | Active subscription required |
| `pastorProcedure` | Authenticated + pastor role | Active subscription required |
| `memberProcedure` | Authenticated + member role | Active subscription required |

## Common Development Commands

### Development
```bash
pnpm install                    # Install dependencies
pnpm run dev                   # Start all apps
pnpm run dev:server            # Start backend only (port 3000)
pnpm run dev:admin             # Start admin web only (port 3001)
pnpm run dev:client            # Start Expo client (use Expo Go app)
pnpm run dev:landing           # Start landing page
pnpm run dev:docs              # Start docs site
```

### Building & Type Checking
```bash
pnpm run build                 # Build all apps
pnpm run check-types           # TypeScript type checking
pnpm run check                 # Run Biome (lint and format)
```

### Database Management (Drizzle + PostgreSQL)
```bash
pnpm run db:push               # Push schema changes to database
pnpm run db:studio             # Open Drizzle Studio UI
pnpm run db:generate           # Generate migrations
pnpm run db:migrate            # Run migrations
pnpm run db:start              # Start PostgreSQL via Docker
pnpm run db:stop               # Stop PostgreSQL
pnpm run db:down               # Stop and remove containers
```

### Desktop App (Admin)
```bash
cd apps/admin && pnpm desktop:dev    # Start Tauri desktop app in dev
cd apps/admin && pnpm desktop:build  # Build Tauri desktop app
```

## Routing Architecture

### Admin Web App (`apps/admin/src/routes/`)
- Uses **TanStack Router** with file-based routing
- Routes file `routeTree.gen.ts` is auto-generated
- Protected routes use `beforeLoad` for auth checks
- Root route defines `RouterAppContext` with tRPC and QueryClient

### Client Mobile App (`apps/client/app/`)
- Uses **Expo Router** with file-based routing (typed routes enabled)
- Layout uses `Stack.Protected` for auth guards
- Session managed via `SessionProvider` context
- Supports authenticated tabs `(tabs)` and auth screens `(auth)`

## Key Implementation Patterns

### Adding New tRPC Procedures
1. Create procedure in appropriate router file in `packages/api/src/routers/[role]/`
2. Use appropriate procedure type (`memberProcedure`, `adminProcedure`, etc.)
3. Export router and add to `appRouter` in `packages/api/src/routers/index.ts`
4. Access in frontend via `trpc.namespace.procedure.useQuery()`

### Database Schema Changes
1. Edit table definitions in `packages/db/src/schema/`
2. Run `pnpm run db:push` to apply changes
3. For production: use `pnpm run db:generate` then `pnpm run db:migrate`

### Authentication Flow
- Better-Auth handles sessions via `/api/auth/*` endpoints
- Custom plugins in `packages/auth/src/plugins/` extend functionality (OTP, platform detection, profile linking)
- Web: Cookie-based auth via session headers
- Mobile: Session tokens stored via expo-secure-store

## Code Style
- **Indentation**: Tabs (configured in biome.json)
- **Quotes**: Double quotes
- **TypeScript**: Strict mode enabled
- **Imports**: Auto-organized on save via Biome
- **Tailwind**: CSS classes sorted (warning level)
