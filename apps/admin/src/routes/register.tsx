import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-background">
      <div className="w-full max-w-2xl bg-card border rounded-lg shadow-sm p-2">
        <Outlet />
      </div>
    </div>
  );
}
