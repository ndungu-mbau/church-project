---
description: Implement new features in the admin application using existing tRPC APIs, TanStack Router, and @tanstack/react-form.
---

# Admin Feature Implementation Workflow

Use this workflow to implement new features in the `apps/admin` application, leveraging existing tRPC procedures and Zod schemas.

## 1. Feature Discovery
Before implementing, locate the relevant tRPC procedures and Zod schemas defined in `packages/api`.
- [ ] Find the sub-router in `packages/api/src/routers/admin/`.
- [ ] Identify the query and mutation procedures you will use.
- [ ] Identify the Zod schemas for form validation (e.g., in the sub-router directory or a shared schema file).

## 2. Frontend Routing (TanStack Router)
Create the route file in `apps/admin/src/routes/_app/`.
- [ ] For a list page, create `apps/admin/src/routes/_app/<module>/index.tsx`.
- [ ] For a detail/edit page, create `apps/admin/src/routes/_app/<module>/$id.tsx`.
- [ ] Define the route using `createFileRoute`.
- [ ] **Pre-fetching**: Use the `loader` to pre-fetch data if the page requires it for SEO or UX.
  ```typescript
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(trpc.<procedure>.queryOptions());
  },
  ```

## 3. Data Fetching & State
In your route component:
- [ ] Use `useQuery` via `trpc.<procedure>.queryOptions()` to consume data.
- [ ] Use `trpc.<procedure>.useMutation()` for actions like create, update, or delete.
- [ ] Handle loading and error states using components from `apps/admin/src/components/loader.tsx` or similar.

## 4. Forms Implementation
Use `@tanstack/react-form` for data entry.
- [ ] Define the form using the `useForm` hook.
- [ ] Integrate the Zod schema from `packages/api` for validation.
- [ ] Use `shadcn/ui` components (Input, Button, etc.) for the UI.
- [ ] Reference `apps/admin/src/components/onboarding-form.tsx` for complex form patterns.

## 5. UI Layout & Tables
- [ ] For list views, utilize `shadcn/ui` Data Table components (if available) or create a responsive list.
- [ ] Ensure consistent spacing and styling using the project's CSS variables and Tailwind classes.

## 6. Navigation Integration
Register the new route in the sidebar to make it accessible.
- [ ] Open `apps/admin/src/components/app-sidebar.tsx`.
- [ ] Add the new route to the navigation items list.
- [ ] Choose an appropriate icon from `lucide-react`.

## 7. Verification
- [ ] Verify that the route loads correctly and data is pre-fetched.
- [ ] Test all form validations and mutations.
- [ ] Ensure the sidebar navigation works as expected.
