import AdminRegisterForm from "@/components/admin-register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminRegisterForm />;
}
