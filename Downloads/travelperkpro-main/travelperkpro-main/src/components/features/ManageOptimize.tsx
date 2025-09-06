import React, { useState, useMemo } from "react";
import {
  User,
  Check,
  X,
  Trash2,
  Edit2,
  Plus,
  Activity,
  Wallet,
  BarChart2,
  Settings,
  TrendingUp,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* -------------------------
  CONFIG & HELPERS
------------------------- */
const WORKFLOW_STEPS = [
  "Trip Request",
  "Manager Approval",
  "Finance Review",
  "Confirmation",
];

const TRIP_CATEGORIES = [
  "Flights",
  "Hotels",
  "Cars",
  "Trains",
  "Buses",
  "Cruises",
  "Events",
  "Holiday Packages",
  "Insurance",
];

const currency = (n: number) =>
  typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : "—";

interface Trip {
  id: number;
  title: string;
  cost: number;
  date: string;
  lat: number;
  lng: number;
}

interface ManageOptimizeProps {
  onTripsChange?: (trips: Trip[]) => void;
}

/* -------------------------
  ManageWorkflow component
  - Role-aware (Employee, Manager, Finance)
  - Approve / Reject / Reset
  - Linear progress bar + status badges
------------------------- */
function ManageWorkflow({ role = "Manager", onReset }: { role?: string; onReset?: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const percent = Math.round((stepIndex / (WORKFLOW_STEPS.length - 1)) * 100);

  /* role-aware action handlers */
  const handleApprove = () => setStepIndex((s) => Math.min(s + 1, WORKFLOW_STEPS.length - 1));
  const handleReject = () => setStepIndex(0);
  const handleReset = () => {
    setStepIndex(0);
    onReset?.();
  };

  return (
    <section aria-labelledby="manage-heading" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 id="manage-heading" className="text-lg font-semibold text-foreground">
            Automated Approvals & Guardrails
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time approval workflow — role-aware actions and progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
            {role}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300`}
            style={{
              width: `${percent}%`,
              backgroundColor: percent >= 90 ? "hsl(var(--destructive))" : percent >= 70 ? "hsl(var(--warning))" : "hsl(var(--primary))",
            }}
            aria-valuenow={percent}
            role="progressbar"
            aria-label="Workflow progress"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {WORKFLOW_STEPS.map((s, i) => {
            const status = i < stepIndex ? "Approved" : i === stepIndex ? "Current" : "Pending";
            const badgeColor =
              status === "Approved" ? "bg-primary text-primary-foreground" : 
              status === "Current" ? "bg-accent text-accent-foreground" : 
              "bg-muted text-muted-foreground";
            return (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={`px-2 py-1 rounded-md text-[11px] font-medium ${badgeColor} w-full text-center`}
                  aria-current={i === stepIndex ? "step" : undefined}
                >
                  {status}
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground">{s}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {/* Manager can Approve/Reject */}
        {role === "Manager" && (
          <>
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-sm text-sm hover:bg-primary/90 transition-colors"
            >
              <Check className="w-4 h-4" />
              Approve & Next
            </button>

            <button
              onClick={handleReject}
              className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-2 rounded-md text-sm hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </>
        )}

        {/* Finance-only contextual info */}
        {role === "Finance" && (
          <div className="px-3 py-2 rounded-md bg-muted text-sm text-muted-foreground">Finance: review budgets & compliance</div>
        )}

        {/* Employee: Submit request (simulate) */}
        {role === "Employee" && (
          <div className="px-3 py-2 rounded-md bg-accent text-sm text-accent-foreground">Submit request (use app workflow)</div>
        )}

        <button
          onClick={handleReset}
          className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors"
        >
          Reset Workflow
        </button>
      </div>
    </section>
  );
}

/* -------------------------
  OptimizeBudgets component
  - INR currency
  - Add/Edit/Delete trips
  - Contextual suggestions
------------------------- */
function OptimizeBudgets({ onTripsChange }: { onTripsChange?: (trips: Trip[]) => void }) {
  const [budget, setBudget] = useState(150000);
  const [trips, setTrips] = useState<Trip[]>([
    // exemplary seed trip
    { id: Date.now(), title: "Bengaluru → Mumbai", cost: 7000, date: new Date().toISOString().split('T')[0], lat: 12.9716, lng: 77.5946 },
  ]);
  const [form, setForm] = useState({ title: "", category: TRIP_CATEGORIES[0], cost: "" });
  const spent = useMemo(() => trips.reduce((s, t) => s + Number(t.cost || 0), 0), [trips]);
  const remaining = Math.max(0, budget - spent);
  const pct = Math.round((spent / Math.max(1, budget)) * 100);

  const addTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.cost || Number(form.cost) <= 0) return;
    const newTrips = [...trips, { 
      id: Date.now(), 
      title: form.title.trim(), 
      cost: Number(form.cost),
      date: new Date().toISOString().split('T')[0],
      lat: 0, // Default coordinates
      lng: 0
    }];
    setTrips(newTrips);
    onTripsChange?.(newTrips);
    setForm({ title: "", category: TRIP_CATEGORIES[0], cost: "" });
  };

  const deleteTrip = (id: number) => {
    const newTrips = trips.filter((t) => t.id !== id);
    setTrips(newTrips);
    onTripsChange?.(newTrips);
  };

  const updateBudget = () => {
    const val = prompt("Set total budget in ₹ (numbers only)", String(budget));
    const n = Number(val);
    if (!Number.isNaN(n) && n > 0) setBudget(n);
  };

  const suggestionPoolHigh = [
    "You're above 80% of budget — prioritize essential trips.",
    "Switch to partner hotels to unlock negotiated corporate rates.",
    "Consider train or bus for short distances under 6 hours.",
  ];
  const suggestionPoolLow = [
    "Great — you're under budget. Consider locking flexible fares for protection.",
    "Book mid-week flights to save ~15%.",
    "Bundle flights + hotel for package discounts.",
  ];
  const suggestions = pct >= 80 ? suggestionPoolHigh : suggestionPoolLow;

  // progress color
  const progressColor = pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-warning" : "bg-primary";

  return (
    <section aria-labelledby="optimize-heading" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 id="optimize-heading" className="text-lg font-semibold text-foreground">Optimize — Live Budgets (₹)</h3>
          <p className="text-sm text-muted-foreground mt-1">Track total, spent and remaining. Add trips to see live impact on budget.</p>
        </div>
        <div className="flex gap-3 items-center">
          <BarChart2 className="w-5 h-5 text-muted-foreground" />
          <button onClick={updateBudget} className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted transition-colors">Set Budget</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-muted rounded-md text-sm">
          <div className="text-muted-foreground">Total Budget</div>
          <div className="font-semibold text-lg text-foreground">{currency(budget)}</div>
        </div>
        <div className="p-3 bg-muted rounded-md text-sm">
          <div className="text-muted-foreground">Spent</div>
          <div className={`font-semibold text-lg ${spent > budget ? "text-destructive" : "text-foreground"}`}>{currency(spent)}</div>
        </div>
        <div className="p-3 bg-muted rounded-md text-sm">
          <div className="text-muted-foreground">Remaining</div>
          <div className="font-semibold text-lg text-foreground">{currency(remaining)}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div className={`${progressColor} h-full transition-all duration-300`} style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <div className="text-xs text-muted-foreground">{pct}% of budget used</div>
      </div>

      {/* Add trip form */}
      <form onSubmit={addTrip} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="text-xs text-muted-foreground">Destination</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
            placeholder="e.g. Chennai — Sales Meet"
            aria-label="Trip destination"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
            aria-label="Trip category"
          >
            {TRIP_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Cost (₹)</label>
          <input
            required
            type="number"
            min="1"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
            placeholder="e.g. 7500"
            aria-label="Trip cost"
          />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md w-full hover:bg-primary/90 transition-colors"
            aria-label="Add trip"
          >
            <Plus className="w-4 h-4" />
            Add Trip
          </button>
        </div>
      </form>

      {/* Trip list */}
      <div>
        <ul className="space-y-2">
          {trips.map((t) => (
            <li key={t.id} className="flex items-center justify-between bg-muted p-3 rounded-md">
              <div>
                <div className="text-sm font-medium text-foreground">{t.title}</div>
                <div className="text-xs text-muted-foreground">{currency(t.cost)} • {t.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newTitle = prompt("Edit trip title", t.title);
                    if (newTitle) {
                      const newTrips = trips.map((x) => (x.id === t.id ? { ...x, title: newTitle } : x));
                      setTrips(newTrips);
                      onTripsChange?.(newTrips);
                    }
                  }}
                  title="Edit"
                  className="p-2 rounded-md border border-border hover:bg-background transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this trip?")) deleteTrip(t.id);
                  }}
                  title="Delete"
                  className="p-2 rounded-md border border-border text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
          {trips.length === 0 && <li className="text-sm text-muted-foreground">No trips added yet.</li>}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="bg-muted rounded-md p-3">
        <div className="text-sm font-semibold mb-2 text-foreground">Smart Suggestions</div>
        <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
          {suggestions.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export const ManageOptimize = ({ onTripsChange }: ManageOptimizeProps) => {
  const [role, setRole] = useState("Manager");

  const resetCallback = () => {
    // placeholder for any parent-level reset logic
  };

  return (
    <section id="features" className="min-h-screen snap-start py-16 md:py-24 bg-gradient-to-br from-background via-muted/10 to-accent/5">
      <div className="container space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Powerful features, zero chaos
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Streamline your enterprise travel with automated workflows, intelligent budget tracking, and comprehensive trip management
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="manage" className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="manage" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Manage</span>
                </TabsTrigger>
                <TabsTrigger value="optimize" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Optimize</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border border-border rounded-md px-2 py-1 bg-background text-foreground"
                  aria-label="Select role"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>

            <TabsContent value="manage" className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/50">
                <ManageWorkflow role={role} onReset={resetCallback} />
              </div>
            </TabsContent>

            <TabsContent value="optimize" className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/50">
                <OptimizeBudgets onTripsChange={onTripsChange} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};