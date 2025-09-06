import { useEffect, useState } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import Hero3D from "@/components/sections/Hero3D";
import LogosCarousel from "@/components/sections/LogosCarousel";
import { BookingCards } from "@/components/sections/BookingCards";
import { ManageOptimize } from "@/components/features/ManageOptimize";

import { Testimonials } from "@/components/sections/Testimonials";
import Footer from "@/components/layout/Footer";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import AuthSection from "@/components/sections/AuthSection";

interface Trip {
  id: number;
  title: string;
  cost: number;
  date: string;
  lat: number;
  lng: number;
}

const Index = () => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    document.title = "TravelPerk Pro — Enterprise Travel Management";
  }, []);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TravelPerk Pro',
    url: window.location.origin,
    description: 'TravelPerk Pro: Enterprise travel management with booking, budgets, and compliance',
  };

  return (
    <ThemeProvider>
      <div id="top" className="min-h-screen w-full bg-background text-foreground snap-y snap-mandatory overflow-y-auto transition-colors duration-300">
        <Navbar />
        <Hero3D />
        <LogosCarousel />
        <BookingCards />
        <ManageOptimize onTripsChange={setTrips} />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <AuthSection />
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </div>
    </ThemeProvider>
  );
};

export default Index;
