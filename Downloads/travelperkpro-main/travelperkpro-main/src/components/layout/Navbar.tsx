import { ThemeToggle } from "@/components/ui/theme-toggle";

const Navbar = () => {
  const links = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Budget Planner", href: "#optimize" },
    { label: "Maps", href: "#maps" },
    { label: "Testimonials", href: "#testimonials" },
  ];
  
  return (
    <div className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 h-16 flex items-center justify-between">
        <a href="#top" className="font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-primary">
          TravelPerk Pro
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition-colors duration-200 story-link">
              {l.label}
            </a>
          ))}
          <a href="#book" className="px-4 py-2 rounded-xl border border-border/20 text-foreground hover:border-accent/40 transition-all duration-200">
            Book a Demo
          </a>
          <a href="#get-started" className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:brightness-110 transition-all duration-200">
            Get started
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="#get-started" className="md:hidden px-3 py-2 rounded-lg panel-glass text-foreground text-sm hover:bg-accent/20 transition-all duration-200">
            Start
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;