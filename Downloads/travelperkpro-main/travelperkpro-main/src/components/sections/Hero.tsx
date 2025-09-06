import heroImg from "@/assets/hero-travel.jpg";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container grid gap-10 lg:grid-cols-2 items-center py-16 md:py-24">
        <div className="space-y-6 animate-enter">
          <p className="text-sm font-medium text-muted-foreground">Corporate Travel Management System</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Travel for work made simpler and smarter
          </h1>
          <p className="text-lg text-muted-foreground max-w-prose">
            Plan, book, and manage every trip in one place. Real-time budgets, policy controls, and duty-of-care—built for modern teams.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" className="hover-scale">Book a demo</Button>
            <Button variant="pill" className="hover-scale" asChild>
              <a href="#features">Show features</a>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="text-accent" />
            <span>4.8 average rating • 1,500+ reviews</span>
          </div>
        </div>
        <div className="relative">
          <img
            src={heroImg}
            alt="NovaTravel TMS hero showing a travel dashboard on mobile with floating cards"
            loading="lazy"
            className="rounded-2xl shadow-elevated border w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
