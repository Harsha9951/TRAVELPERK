import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  UserCheck, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  User,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/hooks/useUserRole';
import { Progress } from '@/components/ui/progress';

type WorkflowStep = 'request' | 'manager' | 'finance' | 'confirmed';
type StepStatus = 'pending' | 'approved' | 'rejected' | 'completed';

interface WorkflowState {
  currentStep: WorkflowStep;
  steps: Record<WorkflowStep, StepStatus>;
  progress: number;
}

const steps = [
  {
    key: 'request' as const,
    title: 'Trip Request',
    description: 'Employee submits travel request',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    key: 'manager' as const,
    title: 'Manager Approval',
    description: 'Direct manager reviews and approves',
    icon: UserCheck,
    color: 'from-purple-500 to-pink-500'
  },
  {
    key: 'finance' as const,
    title: 'Finance Review',
    description: 'Finance team validates budget',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500'
  },
  {
    key: 'confirmed' as const,
    title: 'Confirmation',
    description: 'Trip is approved and ready to book',
    icon: CheckCircle2,
    color: 'from-orange-500 to-red-500'
  }
];

export const ApprovalWorkflow = () => {
  const { currentUser, isManager, isFinance } = useUserRole();
  const [workflow, setWorkflow] = useState<WorkflowState>({
    currentStep: 'request',
    steps: {
      request: 'completed',
      manager: 'pending',
      finance: 'pending',
      confirmed: 'pending'
    },
    progress: 25
  });

  const [isAnimating, setIsAnimating] = useState(false);

  const handleApprove = async (step: WorkflowStep) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setWorkflow(prev => {
      const newSteps = { ...prev.steps };
      newSteps[step] = 'approved';
      
      const nextStepIndex = steps.findIndex(s => s.key === step) + 1;
      const nextStep = steps[nextStepIndex]?.key;
      
      let newCurrentStep = prev.currentStep;
      let newProgress = prev.progress;
      
      if (nextStep) {
        newCurrentStep = nextStep;
        newProgress = ((nextStepIndex + 1) / steps.length) * 100;
      } else {
        newSteps.confirmed = 'completed';
        newProgress = 100;
      }
      
      return {
        currentStep: newCurrentStep,
        steps: newSteps,
        progress: newProgress
      };
    });
    
    setIsAnimating(false);
  };

  const handleReject = async (step: WorkflowStep) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setWorkflow(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        [step]: 'rejected'
      }
    }));
    
    setIsAnimating(false);
  };

  const resetWorkflow = () => {
    setWorkflow({
      currentStep: 'request',
      steps: {
        request: 'completed',
        manager: 'pending',
        finance: 'pending',
        confirmed: 'pending'
      },
      progress: 25
    });
  };

  const getStepStatus = (stepKey: WorkflowStep) => {
    const status = workflow.steps[stepKey];
    const isCurrent = workflow.currentStep === stepKey;
    
    if (status === 'completed' || status === 'approved') return 'completed';
    if (status === 'rejected') return 'rejected';
    if (isCurrent) return 'current';
    return 'pending';
  };

  const canApprove = (stepKey: WorkflowStep) => {
    if (stepKey === 'manager' && isManager) return true;
    if (stepKey === 'finance' && isFinance) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">Automated Approvals & Guardrails</h3>
          <p className="text-muted-foreground text-sm">Real-time approval workflow</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          <span className="text-muted-foreground">Role:</span>
          <span className="font-medium text-foreground capitalize">{currentUser.role}</span>
          {(isManager || isFinance) && <Shield className="w-4 h-4 text-accent" />}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(workflow.progress)}%</span>
        </div>
        <Progress value={workflow.progress} className="h-2" />
      </div>

      <div className="grid gap-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const isActive = status === 'current';
          const isCompleted = status === 'completed';
          const isRejected = status === 'rejected';
          const showActions = isActive && canApprove(step.key) && !isAnimating;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative panel-glass rounded-2xl p-4 border transition-all duration-300
                ${isActive ? 'ring-2 ring-accent shadow-glow' : ''}
                ${isCompleted ? 'bg-accent/10 border-accent/30' : ''}
                ${isRejected ? 'bg-destructive/10 border-destructive/30' : ''}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden
                  ${isCompleted ? 'bg-gradient-to-r from-accent to-primary' : 
                    isRejected ? 'bg-destructive' : 
                    isActive ? `bg-gradient-to-r ${step.color}` : 'bg-muted'}
                `}>
                  <AnimatePresence mode="wait">
                    {isAnimating && isActive ? (
                      <motion.div
                        key="loading"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock className="w-6 h-6 text-background" />
                      </motion.div>
                    ) : isRejected ? (
                      <motion.div
                        key="rejected"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <XCircle className="w-6 h-6 text-background" />
                      </motion.div>
                    ) : isCompleted ? (
                      <motion.div
                        key="completed"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-background" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <step.icon className={`w-6 h-6 ${isActive ? 'text-background' : 'text-muted-foreground'}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${isActive ? 'text-accent' : 'text-foreground'}`}>
                      {step.title}
                    </h4>
                    {isActive && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-accent"
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>

                  <AnimatePresence>
                    {showActions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2 mt-3"
                      >
                        <Button
                          size="sm"
                          onClick={() => handleApprove(step.key)}
                          className="bg-accent hover:bg-accent/90"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(step.key)}
                          className="hover:bg-destructive/10 hover:border-destructive"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute -bottom-2 left-6 w-6 h-6 flex items-center justify-center">
                    <motion.div
                      animate={isCompleted ? { y: [0, -2, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className={`w-4 h-4 ${isCompleted ? 'text-accent' : 'text-muted-foreground'}`} />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          onClick={resetWorkflow}
          disabled={isAnimating}
          className="hover:bg-accent/10"
        >
          Reset Workflow
        </Button>
      </div>
    </div>
  );
};