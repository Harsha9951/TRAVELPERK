import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Edit3, 
  Trash2, 
  Plane,
  Hotel,
  Car,
  Train
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Trip {
  id: string;
  destination: string;
  purpose: string;
  cost: number;
  date: string;
  type: 'flight' | 'hotel' | 'car' | 'train';
  status: 'planned' | 'booked' | 'completed';
}

const initialTrips: Trip[] = [
  {
    id: '1',
    destination: 'Mumbai → Delhi',
    purpose: 'Client Meeting',
    cost: 8500,
    date: '2024-02-15',
    type: 'flight',
    status: 'booked'
  },
  {
    id: '2',
    destination: 'Delhi Business Hotel',
    purpose: '2 nights accommodation',
    cost: 6000,
    date: '2024-02-15',
    type: 'hotel',
    status: 'booked'
  },
  {
    id: '3',
    destination: 'Bangalore → Chennai',
    purpose: 'Product Launch',
    cost: 12000,
    date: '2024-03-10',
    type: 'flight',
    status: 'planned'
  }
];

const tripTypeIcons = {
  flight: Plane,
  hotel: Hotel,
  car: Car,
  train: Train
};

const tripTypeColors = {
  flight: 'from-blue-500 to-cyan-500',
  hotel: 'from-purple-500 to-pink-500',
  car: 'from-green-500 to-emerald-500',
  train: 'from-orange-500 to-red-500'
};

export const TripManager = () => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<string | null>(null);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    purpose: '',
    cost: '',
    date: '',
    type: 'flight' as Trip['type']
  });

  const addTrip = () => {
    if (!newTrip.destination || !newTrip.cost || !newTrip.date) return;

    const trip: Trip = {
      id: Date.now().toString(),
      destination: newTrip.destination,
      purpose: newTrip.purpose || 'Business Travel',
      cost: parseFloat(newTrip.cost),
      date: newTrip.date,
      type: newTrip.type,
      status: 'planned'
    };

    setTrips(prev => [...prev, trip]);
    setNewTrip({ destination: '', purpose: '', cost: '', date: '', type: 'flight' });
    setShowAddForm(false);
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  const updateTripStatus = (id: string, status: Trip['status']) => {
    setTrips(prev => prev.map(trip => 
      trip.id === id ? { ...trip, status } : trip
    ));
  };

  const totalCost = trips.reduce((sum, trip) => sum + trip.cost, 0);
  const bookedCost = trips.filter(t => t.status === 'booked').reduce((sum, trip) => sum + trip.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">Trip Management</h3>
          <p className="text-muted-foreground text-sm">
            Total: ₹{totalCost.toLocaleString()} • Booked: ₹{bookedCost.toLocaleString()}
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-accent hover:bg-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Trip
        </Button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="panel-glass rounded-2xl p-6 space-y-4"
          >
            <h4 className="font-semibold text-foreground">Add New Trip</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Destination (e.g., Mumbai → Delhi)"
                value={newTrip.destination}
                onChange={(e) => setNewTrip(prev => ({ ...prev, destination: e.target.value }))}
              />
              <Input
                placeholder="Purpose (optional)"
                value={newTrip.purpose}
                onChange={(e) => setNewTrip(prev => ({ ...prev, purpose: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Cost (₹)"
                value={newTrip.cost}
                onChange={(e) => setNewTrip(prev => ({ ...prev, cost: e.target.value }))}
              />
              <Input
                type="date"
                value={newTrip.date}
                onChange={(e) => setNewTrip(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              {Object.entries(tripTypeIcons).map(([type, Icon]) => (
                <Button
                  key={type}
                  variant={newTrip.type === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewTrip(prev => ({ ...prev, type: type as Trip['type'] }))}
                  className={newTrip.type === type ? "bg-accent" : ""}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={addTrip} className="bg-accent hover:bg-accent/90">
                Add Trip
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        <AnimatePresence>
          {trips.map((trip, index) => {
            const Icon = tripTypeIcons[trip.type];
            const colorClass = tripTypeColors[trip.type];
            
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card className="panel-glass p-4 hover:shadow-glow transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-background" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                            {trip.destination}
                          </h4>
                          <p className="text-sm text-muted-foreground">{trip.purpose}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(trip.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ₹{trip.cost.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <select
                            value={trip.status}
                            onChange={(e) => updateTripStatus(trip.id, e.target.value as Trip['status'])}
                            className={`
                              px-2 py-1 rounded-md text-xs font-medium border-0 outline-0
                              ${trip.status === 'completed' ? 'bg-primary/20 text-primary' :
                                trip.status === 'booked' ? 'bg-accent/20 text-accent' :
                                'bg-muted text-muted-foreground'}
                            `}
                          >
                            <option value="planned">Planned</option>
                            <option value="booked">Booked</option>
                            <option value="completed">Completed</option>
                          </select>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTrip(trip.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};