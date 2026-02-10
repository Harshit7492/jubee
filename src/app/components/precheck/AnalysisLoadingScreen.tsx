import { useEffect, useState } from 'react';
import { FileSearch, FileText, CheckCircle, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';

interface AnalysisStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'complete';
  icon: React.ReactNode;
}

interface AnalysisLoadingScreenProps {
  onComplete: () => void;
}

export function AnalysisLoadingScreen({ onComplete }: AnalysisLoadingScreenProps) {
  const [steps, setSteps] = useState<AnalysisStep[]>([
    {
      id: '1',
      label: 'Scanning uploaded documents',
      status: 'pending',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: '2',
      label: 'Analyzing document structure',
      status: 'pending',
      icon: <FileSearch className="w-5 h-5" />
    },
    {
      id: '3',
      label: 'Checking court formatting rules',
      status: 'pending',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: '4',
      label: 'Identifying potential defects',
      status: 'pending',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      id: '5',
      label: 'Generating AI suggestions',
      status: 'pending',
      icon: <Sparkles className="w-5 h-5" />
    }
  ]);

  useEffect(() => {
    const stepDuration = 1200; // 1.2 seconds per step
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSteps(prev => prev.map((step, index) => {
          if (index === currentStep) {
            return { ...step, status: 'processing' };
          } else if (index < currentStep) {
            return { ...step, status: 'complete' };
          }
          return step;
        }));
        currentStep++;
      } else {
        // Mark last step as complete
        setSteps(prev => prev.map(step => ({ ...step, status: 'complete' })));
        
        // Wait a bit before transitioning
        setTimeout(() => {
          onComplete();
        }, 800);
        
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="h-full flex items-center justify-center bg-white dark:bg-background">
      <div className="max-w-2xl w-full px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
            <FileSearch className="w-10 h-10 text-primary animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Running Pre-Check Analysis
          </h2>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-500 ${
                step.status === 'complete'
                  ? 'border-[#008080]/50 bg-[#008080]/5'
                  : step.status === 'processing'
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                  : 'border-border bg-card'
              }`}
              style={{
                opacity: step.status === 'pending' ? 0.4 : 1,
                transform: step.status === 'processing' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  step.status === 'complete'
                    ? 'bg-[#008080] text-white'
                    : step.status === 'processing'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.status === 'complete' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : step.status === 'processing' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Label */}
              <div className="flex-1">
                <p
                  className={`font-medium transition-colors ${
                    step.status === 'complete'
                      ? 'text-[#008080]'
                      : step.status === 'processing'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </p>
                {step.status === 'processing' && (
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              {step.status === 'complete' && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#008080] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            This typically takes 5-8 seconds depending on document size
          </p>
        </div>
      </div>
    </div>
  );
}
