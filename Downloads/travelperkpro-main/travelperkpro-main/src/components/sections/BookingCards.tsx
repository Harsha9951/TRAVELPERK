import { 
  Plane, Hotel, Car, Train, Bus, Ship, Calendar, MapPin, Shield 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const bookingLinks = [
  { 
    key: 'flights', 
    title: 'Flights', 
    Icon: Plane, 
    href: 'https://www.makemytrip.com',
    description: 'Book domestic & international flights'
  },
  { 
    key: 'hotels', 
    title: 'Hotels', 
    Icon: Hotel, 
    href: 'https://www.booking.com',
    description: 'Find & book accommodation worldwide'
  },
  { 
    key: 'cars', 
    title: 'Cars', 
    Icon: Car, 
    href: 'https://www.zoomcar.com',
    description: 'Rent cars for business travel'
  },
  { 
    key: 'trains', 
    title: 'Trains', 
    Icon: Train, 
    href: 'https://www.irctc.co.in',
    description: 'Book train tickets easily'
  },
  { 
    key: 'buses', 
    title: 'Buses', 
    Icon: Bus, 
    href: 'https://www.redbus.in',
    description: 'Intercity bus bookings'
  },
];

const extraBookingLinks = [
  { 
    key: 'cruises', 
    title: 'Cruises', 
    Icon: Ship,
    href: 'https://www.gocruise.co.in',
    description: 'Luxury cruise experiences'
  },
  { 
    key: 'events', 
    title: 'Events', 
    Icon: Calendar,
    href: 'https://in.bookmyshow.com',
    description: 'Book events & entertainment'
  },
  { 
    key: 'packages', 
    title: 'Holiday Packages', 
    Icon: MapPin,
    href: 'https://www.yatra.com',
    description: 'Complete travel packages'
  },
  { 
    key: 'insurance', 
    title: 'Travel Insurance', 
    Icon: Shield,
    href: 'https://www.policybazaar.com',
    description: 'Protect your business trips'
  },
];

const allBookingLinks = [...bookingLinks, ...extraBookingLinks];

export const BookingCards = () => {
  const { toast } = useToast();

  return (
    <section id="book" className="py-16 md:py-24">
      <div className="container space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Enterprise Travel Booking Hub
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Professional travel management with instant booking redirects to trusted platforms. Streamlined for corporate efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {allBookingLinks.map(({ key, title, Icon, href, description }) => {
            const handleClick = (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              
              // Show toast notification
              toast({
                title: `Opening ${title}`,
                description: `Redirecting to ${title.toLowerCase()} booking platform...`,
              });
              
              window.open(href, '_blank', 'noopener,noreferrer');
            };

            return (
              <div
                key={key}
                className="group flex flex-col p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-accent/50 cursor-pointer transition-all duration-200"
                onClick={handleClick}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 group-hover:bg-accent/20 mb-4 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {description}
                  </p>
                </div>
                
                <div className="flex items-center text-sm text-primary font-medium">
                  <span>One-click booking</span>
                  <div className="ml-2 w-1.5 h-1.5 rounded-full bg-primary"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};