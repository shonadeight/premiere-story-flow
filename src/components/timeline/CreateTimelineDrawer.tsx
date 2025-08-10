import React, { useState, useEffect } from 'react';
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { TimelineTypeSelector } from './TimelineTypeSelector';
import { SharedCreationFlow } from './creation/SharedCreationFlow';
import { TimelineType } from '@/types/timeline';
import { toast } from 'sonner';
import { OfflineStorage } from '@/lib/storage';

interface CreateTimelineDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTimelineDrawer: React.FC<CreateTimelineDrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const [currentView, setCurrentView] = useState<'type-selection' | 'creation-flow'>('type-selection');
  const [selectedType, setSelectedType] = useState<TimelineType | ''>('');

  // Reset state when drawer closes
  useEffect(() => {
    if (!open) {
      setCurrentView('type-selection');
      setSelectedType('');
    }
  }, [open]);

  const handleTypeSelect = (type: TimelineType) => {
    setSelectedType(type);
    setCurrentView('creation-flow');
  };

  const handleCreationComplete = (timelineData: any) => {
    const newTimeline = {
      id: Date.now().toString(),
      ...timelineData,
      type: selectedType,
      value: 0,
      currency: timelineData.baseUnit === 'USD' ? 'USD' : 'TOKEN',
      change: 0,
      changePercent: 0,
      invested: false,
      subtimelines: [],
      rating: 0,
      views: 0,
      investedMembers: 0,
      matchedTimelines: 0,
      status: 'draft' as const,
      userId: '1', // TODO: Get from auth
      ownerId: '1', // TODO: Get from auth
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    OfflineStorage.saveTimeline(newTimeline);
    OfflineStorage.clearDraft();
    
    toast.success('Timeline created successfully!');
    onOpenChange(false);
  };

  const handleBackToTypeSelection = () => {
    setCurrentView('type-selection');
    setSelectedType('');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>
            {currentView === 'type-selection' ? 'Create New Timeline' : `Create ${selectedType} Timeline`}
          </DrawerTitle>
          <DrawerDescription>
            {currentView === 'type-selection' 
              ? 'Choose the type of timeline that best fits your needs'
              : 'Follow the step-by-step process to configure your timeline'
            }
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4 overflow-y-auto">
          {currentView === 'type-selection' ? (
            <TimelineTypeSelector
              selectedType={selectedType}
              onTypeSelect={handleTypeSelect}
            />
          ) : (
            <SharedCreationFlow
              selectedType={selectedType as TimelineType}
              onComplete={handleCreationComplete}
              onBack={handleBackToTypeSelection}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};