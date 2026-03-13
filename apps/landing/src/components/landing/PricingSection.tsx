import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small churches just getting started",
    price: "Free",
    period: "forever",
    features: [
      "Up to 100 members",
      "Basic member directory",
      "Event scheduling",
      "Email support",
      "Mobile app access",
    ],
    cta: "Get Started Free",
    variant: "nav-outline" as const,
    popular: false,
  },
  {
    name: "Growth",
    description: "For growing churches with expanding needs",
    price: "$49",
    period: "per month",
    features: [
      "Up to 500 members",
      "Full member management",
      "Online giving integration",
      "SMS & email communications",
      "Custom groups & teams",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start 14-Day Trial",
    variant: "gold" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large churches and multi-site organizations",
    price: "$149",
    period: "per month",
    features: [
      "Unlimited members",
      "Multi-site support",
      "Advanced reporting",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    variant: "default" as const,
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-gold font-semibold text-sm uppercase tracking-wider mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent{" "}
            <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your church. No hidden fees, no surprises.
            Upgrade or downgrade anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-1.5 bg-gold text-primary text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              <Card
                className={`h-full ${
                  plan.popular
                    ? "border-2 border-gold shadow-xl scale-105"
                    : "border-border/50"
                } bg-card`}
              >
                <CardHeader className="pb-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>

                  <Button
                    variant={plan.variant}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-3 pt-4 border-t border-border">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-gold" />
                        </div>
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-muted-foreground mt-12"
        >
          All plans include a 30-day money-back guarantee. No questions asked.
        </motion.p>
      </div>
    </section>
  );
}
