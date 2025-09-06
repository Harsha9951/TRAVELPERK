import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Confetti } from '@/components/ui/confetti';

interface BudgetData {
  total: number;
  spent: number;
  remaining: number;
  percentage: number;
}

const aiSuggestions = [
  { id: 1, text: "Book flights 2 weeks earlier to save 12% on average", savings: "12%" },
  { id: 2, text: "Use partner hotels for 15% better rates", savings: "15%" },
  { id: 3, text: "Consider train travel for routes under 500km", savings: "8%" },
  { id: 4, text: "Book Tuesday-Thursday flights for business discounts", savings: "18%" }
];

interface Trip {
  id: number;
  title: string;
  cost: number;
  date: string;
  lat: number;
  lng: number;
}

interface BudgetTrackerProps {
  onTripsChange?: (trips: Trip[]) => void;
}

export const BudgetTracker = ({ onTripsChange }: BudgetTrackerProps) => {
  const [budget, setBudget] = useState<BudgetData>({
    total: 120000,
    spent: 68000,
    remaining: 52000,
    percentage: 57
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(budget.total.toString());
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastBudgetStatus, setLastBudgetStatus] = useState<'over' | 'under' | 'warning'>('under');

  const updateBudget = (newTotal: number) => {
    const remaining = newTotal - budget.spent;
    const percentage = Math.round((budget.spent / newTotal) * 100);
    
    setBudget({
      total: newTotal,
      spent: budget.spent,
      remaining,
      percentage
    });
  };

  const addExpense = (amount: number) => {
    const newSpent = budget.spent + amount;
    const remaining = budget.total - newSpent;
    const percentage = Math.round((newSpent / budget.total) * 100);
    
    setBudget({
      ...budget,
      spent: newSpent,
      remaining,
      percentage
    });
  };

  const handleSaveBudget = () => {
    const newTotal = parseFloat(editValue);
    if (!isNaN(newTotal) && newTotal > 0) {
      updateBudget(newTotal);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditValue(budget.total.toString());
    setIsEditing(false);
  };

  const getBudgetStatus = () => {
    if (budget.percentage >= 90) return 'over';
    if (budget.percentage >= 75) return 'warning';
    return 'under';
  };

  const getStatusColor = () => {
    const status = getBudgetStatus();
    switch (status) {
      case 'over': return 'text-destructive';
      case 'warning': return 'text-orange-500';
      default: return 'text-accent';
    }
  };

  const getProgressColor = () => {
    const status = getBudgetStatus();
    switch (status) {
      case 'over': return 'bg-destructive';
      case 'warning': return 'bg-orange-500';
      default: return 'bg-accent';
    }
  };

  useEffect(() => {
    const currentStatus = getBudgetStatus();
    if (lastBudgetStatus === 'warning' && currentStatus === 'under') {
      setShowConfetti(true);
    }
    setLastBudgetStatus(currentStatus);
  }, [budget.percentage]);

  return (
    <div className="space-y-6">
      <Confetti 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">Live Budgets & Smart Optimization</h3>
          <p className="text-muted-foreground text-sm">Real-time budget tracking and AI suggestions</p>
        </div>
        <div className={`flex items-center gap-2 ${getStatusColor()}`}>
          {getBudgetStatus() === 'over' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : getBudgetStatus() === 'warning' ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span className="font-medium">
            {getBudgetStatus() === 'over' ? 'Over Budget' : 
             getBudgetStatus() === 'warning' ? 'Budget Warning' : 'On Track'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Budget Overview */}
        <div className="panel-glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">Budget Overview</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="hover:bg-accent/10"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Total Budget */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Budget</span>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 h-8 text-right"
                        type="number"
                      />
                      <Button size="sm" onClick={handleSaveBudget}>
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="font-bold text-foreground">₹{budget.total.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Usage</span>
                <span className={`font-medium ${getStatusColor()}`}>{budget.percentage}%</span>
              </div>
              <div className="relative">
                <Progress value={budget.percentage} className="h-3" />
                <motion.div
                  className={`absolute top-0 left-0 h-3 rounded-full ${getProgressColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${budget.percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-accent/10 rounded-xl">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-destructive" />
                  <span className="text-xs text-muted-foreground">Spent</span>
                </div>
                <p className="font-bold text-foreground">₹{budget.spent.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-xl">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingDown className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Remaining</span>
                </div>
                <p className="font-bold text-foreground">₹{budget.remaining.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Quick Actions</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addExpense(10000)}
                className="flex-1"
              >
                Add ₹10k
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addExpense(25000)}
                className="flex-1"
              >
                Add ₹25k
              </Button>
              <Button 
                size="sm" 
                onClick={() => updateBudget(budget.total + 20000)}
                className="flex-1 bg-accent hover:bg-accent/90"
              >
                +₹20k Budget
              </Button>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="panel-glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accent to-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-background" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">AI Optimization</h4>
              <p className="text-xs text-muted-foreground">Smart cost-saving suggestions</p>
            </div>
          </div>

          <div className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-background/50 rounded-xl border border-border/50 hover:border-accent/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-foreground group-hover:text-accent transition-colors">
                    {suggestion.text}
                  </p>
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                    {suggestion.savings}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-accent to-primary hover:brightness-110">
            Apply All Suggestions
          </Button>
        </div>
      </div>
    </div>
  );
};