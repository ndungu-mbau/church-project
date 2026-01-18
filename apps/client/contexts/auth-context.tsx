import { createContext, use, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

type Session = typeof authClient.$Infer.Session;

interface AuthContextType {
  signIn: typeof authClient.signIn;
  signOut: typeof authClient.signOut;
  useSession: typeof authClient.useSession;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook to access the current session and auth functions.
 * Must be used within a <SessionProvider />.
 */
export function useSession() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return context;
}

interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application and provides auth state.
 * Uses better-auth's useSession hook for real-time session management.
 */
export function SessionProvider({ children }: SessionProviderProps) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <AuthContext.Provider
      value={{
        signIn: authClient.signIn,
        signOut: authClient.signOut,
        useSession: authClient.useSession,
        session: session ?? null,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
