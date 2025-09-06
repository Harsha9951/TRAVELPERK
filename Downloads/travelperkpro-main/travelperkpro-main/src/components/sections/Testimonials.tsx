import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "Our team loves the interface. The live budgets and alerts keep us always on track.",
    author: "Maya R.",
    role: "People Ops, Globex",
    avatar: "🧑‍💼",
    rating: 5
  },
  {
    id: 2,
    quote: "TravelPerk Pro cut our travel spend by 18% and gave us real-time policy control.",
    author: "Priya S.",
    role: "Finance Lead, Initech",
    avatar: "👩‍💼",
    rating: 5
  },
  {
    id: 3,
    quote: "The automated approval workflow saved us countless hours. Game changer for enterprise travel.",
    author: "Alex Chen",
    role: "Operations Director, TechCorp",
    avatar: "👨‍💻",
    rating: 5
  },
  {
    id: 4,
    quote: "Seamless booking experience with instant policy compliance. Our teams can focus on business, not paperwork.",
    author: "Sarah Kim",
    role: "VP Operations, InnovateLabs",
    avatar: "👩‍💻",
    rating: 5
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
            Loved by modern teams
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            See what industry leaders say about our futuristic travel management platform
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main testimonial display */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="panel-glass rounded-3xl p-8 md:p-12 text-center shadow-glow"
          >
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-current" />
              ))}
            </div>
            
            <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-8 italic">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="text-4xl">{testimonials[currentIndex].avatar}</div>
              <div className="text-left">
                <div className="font-semibold text-foreground text-lg">
                  {testimonials[currentIndex].author}
                </div>
                <div className="text-muted-foreground">
                  {testimonials[currentIndex].role}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={goToPrevious}
              className="p-3 rounded-full panel-glass hover:shadow-glow transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-accent shadow-glow' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={goToNext}
              className="p-3 rounded-full panel-glass hover:shadow-glow transition-all duration-300 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
          </div>
        </div>

        {/* Grid of all testimonials (smaller preview) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? 'panel-glass ring-2 ring-accent/30 shadow-glow'
                  : 'bg-card/50 hover:panel-glass hover:shadow-glow'
              }`}
            >
              <div className="text-2xl mb-3">{testimonial.avatar}</div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="font-medium text-foreground text-sm">
                  {testimonial.author}
                </div>
                <div className="text-xs text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;