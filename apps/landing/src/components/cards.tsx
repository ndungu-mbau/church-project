import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Check } from "lucide-react"
import { Button } from "./ui/button"

export function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-lg">
      <CardHeader>
        <div className="mb-2 flex items-center gap-3">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/60">{description}</p>
      </CardContent>
    </Card>
  )
}

export function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
      <span className="text-foreground text-lg">{text}</span>
    </li>
  )
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  featured,
}: {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  featured?: boolean
}) {
  return (
    <Card className={`flex flex-col ${featured ? "scale-105 border-primary/50 shadow-lg" : ""}`}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="font-bold text-4xl text-foreground">{price}</span>
          {period && <span className="ml-2 text-foreground/60">{period}</span>}
        </div>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <div className="p-6 pt-0">
        <Button className="w-full" variant={featured ? "default" : "outline"}>
          {cta}
        </Button>
      </div>
    </Card>
  )
}