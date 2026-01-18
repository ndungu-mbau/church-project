import Header from '@/components/header';
import { authClient } from '@/lib/auth-client';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: '/auth/login',
        throw: true,
      });
    }
    return { session };
  },
})

function RouteComponent() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
