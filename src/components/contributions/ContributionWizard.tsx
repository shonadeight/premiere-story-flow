import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useContributionWizard } from '@/hooks/useContributionWizard';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardFooter } from './wizard/WizardFooter';
import { Step1Subscription } from './wizard/Step1Subscription';
import { Step2TimelineToggle } from './wizard/Step2TimelineToggle';
import { Step3SubtypeSelection } from './wizard/Step3SubtypeSelection';
import { Step4Confirmation } from './wizard/Step4Confirmation';
import { Step5Insights } from './wizard/Step5Insights';
import { StepsConfigurable } from './wizard/StepsConfigurable';

interface ContributionWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timelineId: string;
}

export const ContributionWizard = ({ open, onOpenChange, timelineId }: ContributionWizardProps) => {
  const wizard = useContributionWizard();
  const [savedContributionId, setSavedContributionId] = useState<string | undefined>();

  const handleClose = () => {
    wizard.reset();
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1:
        return <Step1Subscription />;
      case 2:
        return (
          <Step2TimelineToggle
            isTimeline={wizard.isTimeline}
            setIsTimeline={wizard.setIsTimeline}
            timelineTitle={wizard.timelineTitle}
            setTimelineTitle={wizard.setTimelineTitle}
            timelineDescription={wizard.timelineDescription}
            setTimelineDescription={wizard.setTimelineDescription}
          />
        );
      case 3:
        return (
          <Step3SubtypeSelection
            selectedSubtypes={wizard.selectedSubtypes}
            currentTab={wizard.currentTab}
            setCurrentTab={wizard.setCurrentTab}
            addSubtype={wizard.addSubtype}
            removeSubtype={wizard.removeSubtype}
            completeLater={wizard.completeLater}
            setCompleteLater={wizard.setCompleteLater}
          />
        );
      case 4:
        return (
          <Step4Confirmation
            selectedSubtypes={wizard.selectedSubtypes}
            timelineId={timelineId}
            onComplete={(contributionId) => {
              setSavedContributionId(contributionId);
              wizard.goToNextStep();
            }}
          />
        );
      case 5:
        return (
          <Step5Insights
            selectedSubtypes={wizard.selectedSubtypes}
            currentTab={wizard.currentTab}
            setCurrentTab={wizard.setCurrentTab}
            contributionId={savedContributionId}
          />
        );
      default:
        // Steps 6-13: Configurable steps
        return (
          <StepsConfigurable
            currentStep={wizard.currentStep}
            selectedSubtypes={wizard.selectedSubtypes}
            currentTab={wizard.currentTab}
            setCurrentTab={wizard.setCurrentTab}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <WizardHeader currentStep={wizard.currentStep} />
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderStep()}
        </div>

        <WizardFooter
          currentStep={wizard.currentStep}
          canProceed={wizard.canProceed(wizard.currentStep)}
          hasSubtypes={wizard.hasSubtypes}
          onNext={wizard.goToNextStep}
          onPrev={wizard.goToPrevStep}
          onSkip={wizard.skipStep}
          onComplete={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};