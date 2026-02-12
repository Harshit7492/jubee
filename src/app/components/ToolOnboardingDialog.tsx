import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface OnboardingStep {
  title: string;
  description: string;
  imageUrl: string;
}

interface ToolOnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
  steps: OnboardingStep[];
}

const toolNames: Record<string, string> = {
  'research': 'Legal Research',
  'drafting': 'AI Drafting',
  'translation': 'Jubee Bhasha',
  'typing': 'Court Typing',
  'draftsman': 'Jubee Counsel',
  'psi': 'PSI Analysis',
  'cross-examiner': 'Cross-Examiner'
};

export function ToolOnboardingDialog({ isOpen, onClose, toolId, steps }: ToolOnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen || steps.length === 0) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const currentStepData = steps[currentStep];
  const toolName = toolNames[toolId] || toolId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Tool Name */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <h2 className="text-2xl font-bold text-foreground">{toolName}</h2>
          </div>

          {/* Step Counter */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                      ? 'bg-primary/50'
                      : 'bg-border'
                  }`}
              />
            ))}
          </div>

          {/* Image */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-primary/10 via-purple-500/10 to-amber-500/10">
            <img
              src={currentStepData.imageUrl}
              alt={currentStepData.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Step Title */}
          <h3 className="text-xl font-bold text-foreground mb-3">
            {currentStepData.title}
          </h3>

          {/* Step Description */}
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            {currentStepData.description}
          </p>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl border-2 border-border hover:bg-muted"
            >
              Skip
            </Button>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  className="px-6 py-2.5 rounded-xl border-2 border-border hover:bg-muted flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? (
                  'Get Started'
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step Indicator Text */}
          <p className="text-sm text-muted-foreground text-center mt-6">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}