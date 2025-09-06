import { useMemo } from "react";

const logos = [
  "Umbrella", "Stark", "Wayne", "Hooli", "Initech", "Wonka", "Soylent",
  "Aperture", "Tyrell", "Cyberdyne", "MassiveDynamic", "Gringotts",
  "Monarch", "Acme Corp", "Globex",
];

const LogosCarousel = () => {
  const items = useMemo(() => [...logos, ...logos], []);
  
  return (
    <section className="snap-start py-16 px-6 md:px-10 lg:px-20">
      <div className="relative w-full overflow-hidden">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap opacity-80">
          {items.map((l, i) => (
            <span key={`${l}-${i}`} className="mx-6 inline-block text-white/70">{l}</span>
          ))}
        </div>
        <style>{`
          @keyframes marquee { 0%{ transform: translateX(0);} 100%{ transform: translateX(-50%);} }
        `}</style>
      </div>
    </section>
  );
};

export default LogosCarousel;
