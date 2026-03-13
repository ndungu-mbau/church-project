---
description: Implement conditional modal/full-page routing in TanStack Router
---

This workflow explains how to implement a route (e.g., `/devotions/add`) that appears as a **Sheet** when navigated to from within the app, but renders as a **full-page outlet** when accessed via direct URL.

### 1. Identify/Create the Shared Form Component

Extract the form logic into a standalone component. This component should accept common props like `onSuccess` or `onCancel`.

### 2. Set Up the Child Route

Create the sub-route file (e.g., `apps/admin/src/routes/_app/devotions/add.tsx`).

### 3. Implement Conditional Sheet Logic

In the child route component, use `useLocation` to check for a "modal" signal in the history state.

```tsx
import {
  createFileRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/_app/devotions/add")({
  component: AddDevotionRoute,
});

function AddDevotionRoute() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Signal passed via Link state
  const isModal = state?.isModal;

  const formElement = (
    <DevotionForm
      onSuccess={() => navigate({ to: ".." })}
      onCancel={() => navigate({ to: ".." })}
    />
  );

  if (isModal) {
    return (
      <Sheet
        open={true}
        onOpenChange={(open) => !open && navigate({ to: ".." })}
      >
        <SheetContent side="right" className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Add Devotion</SheetTitle>
          </SheetHeader>
          <div className="py-4 font-normal">{formElement}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Page mode (Direct Access)
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Devotion</h1>
      {formElement}
    </div>
  );
}
```

### 4. Update the Parent Layout

In the parent layout (e.g., `_app/devotions.tsx`), conditionally hide the "Master" view (the list) if the sub-route is active and **not** in modal mode.

```tsx
function DevotionsLayout() {
  const { pathname, state } = useLocation();
  const isAddRoute = pathname.endsWith("/add");

  // We hide the sidebar ONLY if we are on /add and it's NOT a modal
  const hideSidebar = isAddRoute && !state?.isModal;

  return (
    <div className="flex h-full">
      {!hideSidebar && (
        <div className="w-80 border-r flex flex-col bg-card/50">
          {/* Your list here */}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
```

### 5. Trigger Navigation with State

Update your "Add" button to pass the `isModal` state.

```tsx
<Link to="/devotions/add" state={{ isModal: true }}>
  <Plus className="h-4 w-4" />
</Link>
```

### Why this works

- **Context Awareness**: The `state` object in history is only present if the user navigated via the app's link.
- **Deep Linking**: Refreshing the page clears the ephemeral `state` (or it's never set), defaulting to the `else` case (full page).
- **Layout Control**: The parent layout monitors the route and state to decide if it should stay in "Master-Detail" mode or yield the whole screen to the child.
