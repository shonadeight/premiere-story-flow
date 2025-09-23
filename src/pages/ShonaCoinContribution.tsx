import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ContributionFlow } from '@/components/timeline/ContributionFlow';
import { mockTimelines } from '@/data/mockData';
import { Timeline } from '@/types/timeline';
import { toast } from 'sonner';

export function ShonaCoinContribution() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [targetTimeline, setTargetTimeline] = useState<Timeline | null>(null);
  
  // Get timeline ID from URL parameters
  const timelineId = searchParams.get('timelineId');
  
  useEffect(() => {
    if (timelineId) {
      // Find the timeline from mock data (in real app, fetch from API)
      const timeline = mockTimelines.find(t => t.id === timelineId);
      if (timeline) {
        setTargetTimeline(timeline);
      } else {
        toast.error('Timeline not found');
        navigate('/portfolio');
      }
    } else {
      // Default to first timeline if no ID provided
      setTargetTimeline(mockTimelines[0]);
    }
  }, [timelineId, navigate]);

  const handleContributionComplete = (contributionData: any) => {
    console.log('Contribution submitted:', contributionData);
    toast.success('Contribution submitted successfully!');
    navigate('/portfolio');
  };

  const handleCancel = () => {
    if (timelineId) {
      navigate(`/timeline/${timelineId}`);
    } else {
      navigate('/portfolio');
    }
  };

  if (!targetTimeline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Timeline...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      <ContributionFlow
        targetTimeline={targetTimeline}
        onComplete={handleContributionComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default ShonaCoinContribution;