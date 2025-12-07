---
description: Implement the role-based tRPC routers (Member, Staff, Pastor, Admin, Superuser) with specific entity sub-routers and authorization logic.
---

# tRPC Router Implementation Workflow

Follow this workflow to implement the new role-based API structure.

## 1. Setup Directory Structure
Create the following directory structure in `packages/api/src/routers/` if it doesn't exist:
- `member/`
- `staff/`
- `pastor/`
- `admin/`
- `superuser/`

## 2. Implement Member Router
Create `packages/api/src/routers/member/index.ts`.
**Scope**: `memberProcedure`
**Sub-routers**:
- `events`: `list`, `get`, `register`, `cancelRegistration`, `myRegistrations`
- `groups`: `list`, `get` (single), `myGroups`, `join`, `leave`
- `prayerRequests`: `create`, `listMine`
- `profile`: `getMe`, `updateMe`

## 3. Implement Staff Router
Create `packages/api/src/routers/staff/index.ts`.
**Scope**: `staffProcedure`
**Ownership Rule**: For `update`/`delete` on content (Events, Devotions), generally enforce `createdBy === session.user.id` or check for Admin role override.
**Sub-routers**:
- `events` (Management): `create`, `update`, `delete`, `listRegistrations`
- `groups` (Management): `create`, `update`, `listMembers`
- `devotions` (Management): `create`, `update`, `delete`, `list`
- `members`: `list`, `get`
- `prayerRequests`: `list`, `view`
- `sermons`: `create`, `update`, `delete`, `list`

## 4. Implement Pastor Router
Create `packages/api/src/routers/pastor/index.ts`.
**Scope**: `pastorProcedure`
**Sub-routers**:
- `devotions`: `create`, `update` (Own), `delete` (Own)
- `prayerRequests`: `list` (Shared), `update` (Mark answer)

## 5. Implement Admin Router
Create `packages/api/src/routers/admin/index.ts`.
**Scope**: `adminProcedure`
**Sub-routers**:
- `church`: `update`
- `staff`: `create`, `update`, `delete`, `list`, `get`
- `sermons`: `create`, `update`, `delete`
- `subscriptions`: `manage`

## 6. Implement Superuser Router
Create `packages/api/src/routers/superuser/index.ts`.
**Scope**: `superuserProcedure`
**Procedures**:
- `churches`: `create`, `list`, `get`, `deactivate`, `reactivate`, `impersonate`
- `subscriptions`: `listAll`, `checkStatus`

## 7. Register Routers
Update `packages/api/src/routers/index.ts` (or the main router entry point, e.g. `packages/api/src/index.ts`) to import and merge these new role-based routers.
Example:
```typescript
export const appRouter = t.router({
  member: memberRouter,
  staff: staffRouter,
  pastor: pastorRouter,
  admin: adminRouter,
  superuser: superuserRouter,
  // ... keep existing public/auth routers if needed
});
```

## 8. Verification
- Run `tsc` to check for type errors.
- Verify that `member` cannot access `staff` procedures.
- Verify `impersonate` logic works (if implemented).
