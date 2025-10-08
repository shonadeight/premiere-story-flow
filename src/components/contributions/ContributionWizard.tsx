import { useState, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useContributionWizard } from '@/hooks/useContributionWizard';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardFooter } from './wizard/WizardFooter';
import { Step1Subscription } from './wizard/Step1Subscription';
import { Step2TimelineToggle } from './wizard/Step2TimelineToggle';
import { Step3SubtypeSelection } from './wizard/Step3SubtypeSelection';
import { Step4Confirmation, Step4ConfirmationHandle } from './wizard/Step4Confirmation';
import { Step5Insights } from './wizard/Step5Insights';
import { Step6Valuation } from './wizard/Step6Valuation';
import { Step7Followup } from './wizard/Step7Followup';
import { Step8SmartRules } from './wizard/Step8SmartRules';
import { Step9Ratings } from './wizard/Step9Ratings';
import { Step10Files } from './wizard/Step10Files';
import { Step11Knots } from './wizard/Step11Knots';
import { Step12Contributors } from './wizard/Step12Contributors';
import { Step13AdminUsers } from './wizard/Step13AdminUsers';
import { Step14Preview } from './wizard/Step14Preview';
import { SchemaPreview } from './wizard/SchemaPreview';

interface ContributionWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timelineId: string;
}

export const ContributionWizard = ({ open, onOpenChange, timelineId }: ContributionWizardProps) => {
  const isMobile = useIsMobile();
  const wizard = useContributionWizard();
  const [savedContributionId, setSavedContributionId] = useState<string | undefined>();
  const step4Ref = useRef<Step4ConfirmationHandle>(null);

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
            ref={step4Ref}
            selectedSubtypes={wizard.selectedSubtypes}
            timelineId={timelineId}
            isTimeline={wizard.isTimeline}
            timelineTitle={wizard.timelineTitle}
            timelineDescription={wizard.timelineDescription}
            onComplete={(contributionId) => {
              setSavedContributionId(contributionId);
            }}
          />
        );
      case 5:
        if (!savedContributionId) {
          return (
            <div className="text-center py-8">
              <p className="text-destructive">Error: Contribution not saved. Please go back to Step 4.</p>
            </div>
          );
        }
        return (
          <Step5Insights
            selectedSubtypes={wizard.selectedSubtypes}
            currentTab={wizard.currentTab}
            setCurrentTab={wizard.setCurrentTab}
            contributionId={savedContributionId}
          />
        );
      case 6:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return (
          <Step6Valuation
            selectedSubtypes={wizard.selectedSubtypes}
            contributionId={savedContributionId}
          />
        );
      case 7:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return <Step7Followup contributionId={savedContributionId} />;
      case 8:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return <Step8SmartRules contributionId={savedContributionId} />;
      case 9:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return <Step9Ratings contributionId={savedContributionId} />;
      case 10:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return <Step10Files contributionId={savedContributionId} />;
      case 11:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return <Step11Knots contributionId={savedContributionId} />;
      case 12:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return <Step12Contributors contributionId={savedContributionId} />;
      case 13:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return <Step13AdminUsers contributionId={savedContributionId} />;
      case 14:
        if (!savedContributionId) return <div className="text-center py-8"><p className="text-destructive">Please complete Step 4 first.</p></div>;
        return (
          <Step14Preview
            contributionId={savedContributionId}
            selectedSubtypes={wizard.selectedSubtypes}
            onPublish={handleClose}
          />
        );
      default:
        return null;
    }
  };

  const content = (
    <>
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4">
        <WizardHeader currentStep={wizard.currentStep} />
        {wizard.currentStep >= 4 && savedContributionId && (
          <SchemaPreview 
            selectedSubtypes={wizard.selectedSubtypes}
            contributionId={savedContributionId}
          />
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
        {renderStep()}
      </div>

      <WizardFooter
        currentStep={wizard.currentStep}
        canProceed={wizard.canProceed(wizard.currentStep)}
        hasSubtypes={wizard.hasSubtypes}
        onNext={async () => {
          // Step 4 needs to save before proceeding
          if (wizard.currentStep === 4) {
            if (step4Ref.current) {
              try {
                await step4Ref.current.save();
                // Wait a bit for savedContributionId to be set
                await new Promise(resolve => setTimeout(resolve, 200));
                if (!savedContributionId) {
                  throw new Error('Failed to save contribution');
                }
                wizard.goToNextStep();
              } catch (error) {
                // Error already handled in Step4Confirmation
                console.error('Failed to save contribution:', error);
              }
            }
          } else {
            wizard.goToNextStep();
          }
        }}
        onPrev={wizard.goToPrevStep}
        onSkip={wizard.skipStep}
        onComplete={handleClose}
      />
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose} dismissible={false}>
        <DrawerContent className="flex flex-col p-0">
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {content}
      </DialogContent>
    </Dialog>
  );
};