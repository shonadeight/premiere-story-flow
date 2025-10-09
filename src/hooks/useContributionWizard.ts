import { useState, useRef } from 'react';
import { ContributionCategory, SelectedSubtype, ContributionDirection } from '@/types/contribution';

export const useContributionWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTimeline, setIsTimeline] = useState(false);
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDescription, setTimelineDescription] = useState('');
  const [completeLater, setCompleteLater] = useState(false);
  const [selectedSubtypes, setSelectedSubtypes] = useState<SelectedSubtype[]>([]);
  const [currentTab, setCurrentTab] = useState<ContributionDirection>('to_give');
  const savedContributionId = useRef<string | undefined>();

  const addSubtype = (subtype: SelectedSubtype) => {
    setSelectedSubtypes(prev => [...prev, subtype]);
  };

  const removeSubtype = (index: number) => {
    setSelectedSubtypes(prev => prev.filter((_, i) => i !== index));
  };

  const hasSubtypes = selectedSubtypes.length > 0;
  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return true; // Always can proceed from step 1
      case 2:
        return true; // Can proceed even without timeline details
      case 3:
        return hasSubtypes || completeLater;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (currentStep === 4 && !savedContributionId.current) {
      console.warn('Cannot proceed from step 4 without saved contribution');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 14));
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const skipStep = () => {
    goToNextStep();
  };

  const reset = () => {
    setCurrentStep(1);
    setIsTimeline(false);
    setTimelineTitle('');
    setTimelineDescription('');
    setCompleteLater(false);
    setSelectedSubtypes([]);
    setCurrentTab('to_give');
    savedContributionId.current = undefined;
  };

  return {
    currentStep,
    isTimeline,
    timelineTitle,
    timelineDescription,
    completeLater,
    selectedSubtypes,
    currentTab,
    savedContributionId: savedContributionId.current,
    setCurrentStep,
    setIsTimeline,
    setTimelineTitle,
    setTimelineDescription,
    setCompleteLater,
    setCurrentTab,
    setSavedContributionId: (id: string) => { savedContributionId.current = id; },
    addSubtype,
    removeSubtype,
    goToNextStep,
    goToPrevStep,
    skipStep,
    canProceed,
    hasSubtypes,
    reset
  };
};