import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, SkipForward } from 'lucide-react';

interface WizardFooterProps {
  currentStep: number;
  canProceed: boolean;
  hasSubtypes: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const WizardFooter = ({
  currentStep,
  canProceed,
  hasSubtypes,
  onNext,
  onPrev,
  onSkip,
  onComplete
}: WizardFooterProps) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 14; // Step 14 is Preview & Publish
  const isConfigurableStep = currentStep >= 5 && currentStep <= 13;

  return (
    <div className="border-t px-6 py-4 flex items-center justify-between bg-muted/30">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isFirstStep}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      <div className="flex gap-2">
        {isConfigurableStep && (
          <Button variant="ghost" onClick={onSkip}>
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
        )}

        {isLastStep ? (
          <Button onClick={onComplete}>
            <Check className="mr-2 h-4 w-4" />
            Complete
          </Button>
        ) : (
          <Button onClick={onNext} disabled={!canProceed}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};