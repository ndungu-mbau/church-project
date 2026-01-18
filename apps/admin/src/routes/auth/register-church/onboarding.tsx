import OnboardingForm from "@/components/onboarding-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register-church/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OnboardingForm />;
}
