import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Plane, Building2 } from "lucide-react";

const features = [
  {
    icon: Plane,
    title: "All‑in‑one platform",
    desc: "Flights, stays, trains, and cars—all in one streamlined itinerary with real‑time pricing.",
  },
  {
    icon: Building2,
    title: "Global inventory",
    desc: "Corporate rates from top providers with 1,000s of options across every route and city.",
  },
  {
    icon: ShieldCheck,
    title: "Policy & budgets",
    desc: "Automated approvals and guardrails that keep every trip on budget and compliant.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/40">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Powerful features, zero chaos</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="rounded-3xl p-1">
              <CardHeader className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Icon />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
