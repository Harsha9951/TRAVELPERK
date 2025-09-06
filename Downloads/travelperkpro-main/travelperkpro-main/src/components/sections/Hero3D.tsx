import { motion } from "framer-motion";
import EarthGlobe from "@/components/three/EarthGlobe";

const GradientButton = ({ children, href, outline }: any) => {
  const base = outline
    ? "border border-white/20 hover:border-white/40 text-white"
    : "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black hover:brightness-110";
  
  return (
    <motion.a
      href={href}
      whileTap={{ scale: 0.98 }}
      className={`inline-block px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-cyan-500/10 ${base}`}
    >
      {children}
    </motion.a>
  );
};


const Hero3D = () => {
  return (
    <section id="hero" className="snap-start min-h-screen w-full px-6 md:px-10 lg:px-20 py-14 pt-24 relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(210,90,255,0.1),transparent_50%)]" />
      
      <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
        <div>
          <motion.h1 
            initial={{ y: 12, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent"
          >
            Future Travel Management
          </motion.h1>
          <motion.p 
            initial={{ y: 12, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground font-medium"
          >
            Travel for Work. Made <span className="text-accent font-bold">Simpler & Smarter</span>.
          </motion.p>
          <motion.p 
            initial={{ y: 12, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-2 text-muted-foreground max-w-xl"
          >
            Book, manage, and optimize business travel with cyberpunk aesthetics, live budgets, and policy automation.
          </motion.p>
          <motion.div 
            initial={{ y: 12, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 flex gap-3"
          >
            <GradientButton href="#book">Book a Demo</GradientButton>
            <GradientButton outline href="#book">Get Started</GradientButton>
          </motion.div>
        </div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-80 md:h-[28rem] rounded-3xl overflow-hidden panel-glass ring-2 ring-accent/20 shadow-glow"
        >
          <EarthGlobe />
          {/* Enhanced cyberpunk overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(34,211,238,0.1)_100%)]" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero3D;
