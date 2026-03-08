import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Users, Calendar, Heart, MessageSquare } from "lucide-react";
import productImage from "@/assets/product-image.jpg";

const features = [
  "Member management & directory",
  "Event scheduling & RSVP tracking",
  "Online giving & donation reports",
  "Group communications & messaging",
  "Volunteer coordination",
  "Attendance tracking",
];

export function ProductSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="product" className="py-24 lg:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-block text-gold font-semibold text-sm uppercase tracking-wider mb-4"
            >
              About Our Product
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            >
              Everything You Need to{" "}
              <span className="text-primary">Grow Your Ministry</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Sanctuary brings together all the tools your church needs in one 
              beautifully designed platform. From managing your congregation to 
              organizing events and tracking donations, we've got you covered.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="grid sm:grid-cols-2 gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-border"
            >
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-primary">
                  500+
                </div>
                <div className="text-muted-foreground text-sm">Churches</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-primary">
                  50K+
                </div>
                <div className="text-muted-foreground text-sm">Members</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-primary">
                  $2M+
                </div>
                <div className="text-muted-foreground text-sm">Donations</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gold/10 rounded-2xl -z-10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
              
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={productImage}
                  alt="Church community"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">1,234</div>
                    <div className="text-xs text-muted-foreground">Active Members</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="absolute -top-4 -right-4 bg-card rounded-xl shadow-lg p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">$12,450</div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
