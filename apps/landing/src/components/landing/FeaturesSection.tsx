import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Users,
  Calendar,
  CreditCard,
  MessageCircle,
  BarChart3,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Member Management",
    description:
      "Maintain a comprehensive directory with contact info, family relationships, and custom fields tailored to your church.",
  },
  {
    icon: Calendar,
    title: "Event Scheduling",
    description:
      "Create and manage events, track RSVPs, send reminders, and coordinate volunteers all in one place.",
  },
  {
    icon: CreditCard,
    title: "Online Giving",
    description:
      "Accept donations securely online with multiple payment options. Generate tax receipts and detailed giving reports.",
  },
  {
    icon: MessageCircle,
    title: "Communication Hub",
    description:
      "Send targeted emails, SMS, and push notifications to groups or individuals. Keep your congregation connected.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Gain insights with attendance tracking, giving trends, and growth metrics. Make data-driven decisions.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Bank-level encryption protects your data. Automatic backups and 99.9% uptime guarantee peace of mind.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      className="py-24 lg:py-32 bg-section-gradient"
      ref={ref}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-gold font-semibold text-sm uppercase tracking-wider mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful Tools for{" "}
            <span className="text-primary">Modern Churches</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to manage your church efficiently and connect
            with your community effectively.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary group-hover:text-gold transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
