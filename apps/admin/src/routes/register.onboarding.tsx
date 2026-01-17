import OnboardingForm from "@/components/onboarding-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OnboardingForm />;
}
