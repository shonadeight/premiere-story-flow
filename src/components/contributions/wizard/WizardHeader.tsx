import { Progress } from '@/components/ui/progress';

interface WizardHeaderProps {
  currentStep: number;
}

export const WizardHeader = ({ currentStep }: WizardHeaderProps) => {
  const progress = (currentStep / 13) * 100;

  const getStepTitle = () => {
    if (currentStep === 1) return 'Subscription Access';
    if (currentStep === 2) return 'Contribution Type';
    if (currentStep === 3) return 'Select Subtypes';
    if (currentStep === 4) return 'Review & Save';
    if (currentStep === 5) return 'Expected Insights';
    if (currentStep === 6) return 'Expected Valuation';
    if (currentStep === 7) return 'Expected Follow-up';
    if (currentStep === 8) return 'Smart Rules';
    if (currentStep === 9) return 'Custom Ratings';
    if (currentStep === 10) return 'Expected Files';
    if (currentStep === 11) return 'Expected Knots';
    if (currentStep === 12) return 'Expected Contributors';
    if (currentStep === 13) return 'Users and Admins';
    return 'Setup';
  };

  return (
    <div className="border-b px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">{getStepTitle()}</h2>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of 13
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};