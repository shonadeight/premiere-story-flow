import { useState } from 'react';
import { ContributionCategory, SelectedSubtype, ContributionDirection } from '@/types/contribution';

export const useContributionWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTimeline, setIsTimeline] = useState(false);
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDescription, setTimelineDescription] = useState('');
  const [completeLater, setCompleteLater] = useState(false);
  const [selectedSubtypes, setSelectedSubtypes] = useState<SelectedSubtype[]>([]);
  const [currentTab, setCurrentTab] = useState<ContributionDirection>('to_give');

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
    if (currentStep === 3 && !hasSubtypes) {
      // Skip to step 4 if no subtypes selected
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Move to step 5 only if subtypes are selected
      if (hasSubtypes) {
        setCurrentStep(5);
      }
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 13));
    }
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
  };

  return {
    currentStep,
    isTimeline,
    timelineTitle,
    timelineDescription,
    completeLater,
    selectedSubtypes,
    currentTab,
    setCurrentStep,
    setIsTimeline,
    setTimelineTitle,
    setTimelineDescription,
    setCompleteLater,
    setCurrentTab,
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