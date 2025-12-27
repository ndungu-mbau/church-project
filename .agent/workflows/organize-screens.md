---
description: How to organize screens in the client application (separated from routing)
---

This workflow describes how to organize screens in the `apps/client` application to ensure that the `app` folder remains strictly for routing, while screen logic lives in a dedicated `screens` folder.

## Structure

Screens should be organized within `apps/client/screens` into two main categories:

- `auth/`: Screens for unauthenticated users (Login, Sign Up, Forgot Password, OTP).
- `authenticated/`: Screens for authenticated users, further divided by role if necessary (Member, Staff, etc.).

Example structure:

```text
apps/client/
├── app/ (Routing ONLY)
│   ├── (auth)/
│   │   ├── login.tsx (Imports LoginScreen)
│   │   └── register.tsx (Imports RegisterScreen)
│   └── (tabs)/
│       └── index.tsx (Imports DashboardScreen)
└── screens/ (Screen UI and Logic)
    ├── auth/
    │   ├── login-screen.tsx
    │   └── register-screen.tsx
    └── authenticated/
        ├── member/
        │   ├── dashboard-screen.tsx
        │   └── events-screen.tsx
        └── shared/
            └── profile-screen.tsx
```

## Implementation Steps

1. **Create Screen Component**:

   - Create a new file in `apps/client/screens/[category]/[screen-name]-screen.tsx`.
   - Implement the full UI and logic for the screen here.
   - Use the `Screen` suffix for clarity.

2. **Register in Route**:
   - In the corresponding `apps/client/app/...` file, import the screen component.
   - The file in `app/` should be a thin wrapper that renders the screen component.

```tsx
// apps/client/app/(tabs)/index.tsx
import { DashboardScreen } from "@/screens/authenticated/member/dashboard-screen";

export default function Page() {
  return <DashboardScreen />;
}
```

3. **Shared Components vs. Screens**:

   - If a UI element is reused across multiple screens, it belongs in `apps/client/components`.
   - If it defines an entire view, it belongs in `apps/client/screens`.

4. **Hooks and State**:
   - Use `apps/client/hooks` for reusable logic.
   - Context providers should stay in `apps/client/contexts`.
