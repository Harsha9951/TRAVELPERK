import { motion } from "framer-motion";
import { Settings, MapPin, BarChart3 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Set guardrails",
      description: "Create policies, budgets, and approvers in minutes.",
      icon: Settings,
      color: "from-accent to-primary"
    },
    {
      id: 2,
      title: "Book anywhere",
      description: "Employees book flights, hotels, cars, and trains in one place.",
      icon: MapPin,
      color: "from-primary to-accent"
    },
    {
      id: 3,
      title: "Optimize",
      description: "Real-time budgets and audit-ready reports keep you on track.",
      icon: BarChart3,
      color: "from-accent/80 to-primary/80"
    }
  ];

  return (
    <section id="how" className="min-h-screen snap-start py-16 md:py-24 bg-gradient-to-br from-background via-muted/20 to-accent/10 dark:from-background dark:via-muted/10 dark:to-accent/5">
      <div className="container space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            How it works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Streamline your enterprise travel management in three simple steps
          </p>
        </motion.div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.article
              key={step.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              viewport={{ once: true }}
              className="group panel-glass rounded-3xl p-8 hover:shadow-glow transition-all duration-300 relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Step number */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center text-background font-bold text-sm">
                {step.id}
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${step.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-full h-full text-background" />
              </div>
              
              {/* Content */}
              <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-accent transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              
              {/* Hover effect line */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${step.color} group-hover:w-full transition-all duration-500`} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
