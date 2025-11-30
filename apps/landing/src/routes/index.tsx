import { BenefitItem, FeatureCard, PricingCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, BookOpen, Calendar, DollarSign, Users } from "lucide-react";
import { InviteForm } from "@/components/invite-form";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
		<div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">CM</span>
            </div>
            <span className="font-semibold text-lg text-balance">Church Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-foreground/70 hover:text-foreground transition">
              Features
            </a>
            <a href="#pricing" className="text-sm text-foreground/70 hover:text-foreground transition">
              Pricing
            </a>
            <Button variant="outline" size="sm">
              Log in
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Start free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                ✨ Serving churches since 2024
              </p>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-pretty">
                Bring your church community together
              </h1>
              <p className="text-xl text-foreground/70 mb-8 text-pretty">
                Streamline member management, events, donations, and communications all in one sacred space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get started free
                </Button>
                <Button size="lg" variant="outline">
                  Watch demo
                </Button>
              </div>
              <p className="text-sm text-foreground/50 mt-6">No credit card required. 14-day free trial.</p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-12 h-96 flex items-center justify-center border border-primary/10">
              <div className="text-center">
                <Users className="w-24 h-24 text-primary/30 mx-auto mb-4" />
                <p className="text-foreground/40 font-medium">Church Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-foreground/60 mb-8">Trusted by 500+ churches worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center text-center opacity-60">
            <div className="font-semibold">Grace Chapel</div>
            <div className="font-semibold">Living Water</div>
            <div className="font-semibold">Hope Community</div>
            <div className="font-semibold">Cornerstone</div>
            <div className="font-semibold">Faith Assembly</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Everything you need to manage your church
            </h2>
            <p className="text-xl text-foreground/60 text-pretty">
              Built specifically for churches, by people who understand ministry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Member Management"
              description="Keep detailed records of members, track attendance, and manage family relationships."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-primary" />}
              title="Event Scheduling"
              description="Create events, send notifications, and track RSVPs all in one place."
            />
            <FeatureCard
              icon={<DollarSign className="w-8 h-8 text-primary" />}
              title="Donation Tracking"
              description="Accept online giving, track donations, and generate giving statements for members."
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-primary" />}
              title="Sermon Library"
              description="Archive sermons, create study materials, and share content with your congregation."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-primary" />}
              title="Analytics & Reports"
              description="Track growth, attendance trends, and giving patterns with beautiful insights."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Communication Hub"
              description="Send messages, newsletters, and announcements to your entire community."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-8 h-96 flex items-center justify-center border border-primary/10">
              <div className="text-center">
                <BarChart3 className="w-20 h-20 text-primary/30 mx-auto" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-8 text-pretty">
                Why churches choose Church Manager
              </h2>
              <ul className="space-y-4">
                <BenefitItem text="95% of leaders report better organization" />
                <BenefitItem text="Save 10 hours per week on admin tasks" />
                <BenefitItem text="Increase member engagement by up to 40%" />
                <BenefitItem text="Secure, CCPA compliant data storage" />
                <BenefitItem text="24/7 dedicated support for churches" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Pricing plans for churches of all sizes
            </h2>
            <p className="text-xl text-foreground/60">Start free and upgrade as your needs grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              name="Starter"
              price="Free"
              description="Perfect for small churches just getting started"
              features={["Up to 100 members", "Basic member directory", "Event calendar", "Community forum"]}
              cta="Start free"
            />
            <PricingCard
              name="Growth"
              price="$49"
              period="/month"
              description="For growing churches with advanced needs"
              features={[
                "Up to 1,000 members",
                "Advanced member management",
                "Donation tracking",
                "Sermon library",
                "Email campaigns",
                "Priority support",
              ]}
              cta="Try free"
              featured
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For large churches with unique requirements"
              features={[
                "Unlimited members",
                "White-label option",
                "Custom integrations",
                "Dedicated account manager",
                "Advanced analytics",
                "24/7 phone support",
              ]}
              cta="Contact us"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-pretty">
            Ready to transform your church management?
          </h2>
          <p className="text-xl opacity-90 mb-8 text-pretty">
            Join hundreds of churches already using Church Manager to serve their communities better.
          </p>
          <InviteForm />
        </div>
      </section>
    

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-background border-t border-border text-foreground/60 text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="transition hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/" className="transition hover:text-foreground">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link to="/" className="transition hover:text-foreground">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="transition hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="transition hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/" className="transition hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between border-border border-t pt-8 md:flex-row">
            <p>&copy; 2025 Church Manager. All rights reserved.</p>
            <div className="mt-4 flex gap-6 md:mt-0">
              <Link to="/" className="transition hover:text-foreground">
                Twitter
              </Link>
              <Link to="/" className="transition hover:text-foreground">
                Facebook
              </Link>
              <Link to="/" className="transition hover:text-foreground">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </footer>
			</div>
	);
}