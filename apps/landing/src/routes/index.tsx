import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductSection } from "@/components/landing/ProductSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { WaitlistSection } from "@/components/landing/WaitlistSection";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
component: HomeComponent,
  loader: async ({ context }) => {
    console.log("[LOADER]: healthCheck loader called")
    await context.queryClient.prefetchQuery(context.trpc.healthCheck.queryOptions())
  },
})

function HomeComponent() {
  const { data, isFetching } = useQuery(trpc.healthCheck.queryOptions());

  if(isFetching) {
    toast.loading("Loading health check", {
      description: "Please wait...",
      duration: 1000
    })
  }

  if(data) {
    toast.success("`Loaded health check", {
      description: "Server is up and online",
      duration: 5000
    })
  } else {
    toast.error("Failed to load health check", {
      description: "Server might be down. Please try again later",
      duration: 5000
    })
  }

return (
<div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductSection />
      <FeaturesSection />
      <PricingSection />
      <WaitlistSection />
      <Footer />
</div>
);
}
