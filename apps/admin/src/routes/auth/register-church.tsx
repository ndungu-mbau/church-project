import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register-church")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
