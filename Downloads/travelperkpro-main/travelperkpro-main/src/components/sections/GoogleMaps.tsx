import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Trip {
  id: number;
  title: string;
  cost: number;
  date: string;
  lat: number;
  lng: number;
}

interface GoogleMapsProps {
  trips: Trip[];
}

function useGoogleMaps(apiKey?: string) {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).google?.maps) { 
      setReady(true); 
      return; 
    }
    if (!apiKey) return;
    
    const id = 'gmap-script';
    if (document.getElementById(id)) return;
    
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, [apiKey]);
  
  return ready;
}

export const GoogleMaps = ({ trips }: GoogleMapsProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  // In a real app, this would come from environment variables
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const ready = useGoogleMaps(apiKey);

  useEffect(() => {
    if (!ready || !mapRef.current || googleMapRef.current) return;
    
    const center = { lat: 20.5937, lng: 78.9629 }; // India center
    // @ts-ignore
    googleMapRef.current = new google.maps.Map(mapRef.current, { 
      center, 
      zoom: 4,
      mapId: 'DEMO_MAP_ID',
      styles: [
        {
          "featureType": "all",
          "elementType": "geometry.fill",
          "stylers": [{ "weight": "2.00" }]
        },
        {
          "featureType": "all",
          "elementType": "geometry.stroke",
          "stylers": [{ "color": "#9c9c9c" }]
        },
        {
          "featureType": "all",
          "elementType": "labels.text",
          "stylers": [{ "visibility": "on" }]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [{ "color": "#f2f2f2" }]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry.fill",
          "stylers": [{ "color": "#ffffff" }]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.fill",
          "stylers": [{ "color": "#ffffff" }]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "road",
          "elementType": "all",
          "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{ "color": "#eeeeee" }]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#7b7b7b" }]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [{ "color": "#ffffff" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [{ "visibility": "simplified" }]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{ "color": "#c8d7d4" }]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#070707" }]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [{ "color": "#ffffff" }]
        }
      ]
    });
  }, [ready]);

  useEffect(() => {
    if (!googleMapRef.current || !(window as any).google?.maps) return;
    
    // Clear old markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    
    // Add new markers
    trips.forEach((trip) => {
      // @ts-ignore
      const marker = new google.maps.Marker({ 
        position: { lat: trip.lat, lng: trip.lng }, 
        map: googleMapRef.current, 
        title: `${trip.title} — ₹${trip.cost.toLocaleString()}`,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="#ffffff" stroke-width="3"/>
              <circle cx="16" cy="16" r="6" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new (window as any).google.maps.Size(32, 32),
          anchor: new (window as any).google.maps.Point(16, 16)
        }
      });
      markersRef.current.push(marker);
    });
    
    // Fit bounds if we have trips
    if (trips.length > 0) {
      // @ts-ignore
      const bounds = new google.maps.LatLngBounds();
      trips.forEach((trip) => bounds.extend({ lat: trip.lat, lng: trip.lng }));
      googleMapRef.current.fitBounds(bounds, 64);
    }
  }, [trips]);

  return (
    <section id="maps" className="py-16 md:py-24 bg-gradient-to-br from-background via-muted/10 to-accent/5">
      <div className="container space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Your trips on Google Maps
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Visualize all your business trips on an interactive map with real-time updates
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="rounded-3xl overflow-hidden panel-glass">
            {!apiKey && (
              <div className="p-6 bg-warning/10 border-b border-warning/20">
                <p className="text-sm text-warning">
                  <strong>Setup Google Maps:</strong> Add <code className="px-2 py-1 bg-background/50 rounded text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to your environment variables to enable live interactive maps.
                </p>
              </div>
            )}
            
            <div 
              ref={mapRef} 
              className={`h-[420px] w-full ${apiKey ? 'block' : 'hidden'}`}
            />
            
            {!apiKey && (
              <div className="h-[420px] w-full bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl opacity-50">🗺️</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Interactive Map Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                      Your trips will appear here as interactive pins with real-time updates once Google Maps API is configured.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};