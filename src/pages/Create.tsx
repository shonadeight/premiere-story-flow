import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ContributionWizard } from '@/components/contributions/ContributionWizard';
import { supabase } from '@/integrations/supabase/client';

export const Create = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [timelineId, setTimelineId] = useState<string>('');
  const [wizardOpen, setWizardOpen] = useState(true);

  useEffect(() => {
    // Get timelineId from URL params or use default
    const paramTimelineId = searchParams.get('timelineId');
    if (paramTimelineId) {
      setTimelineId(paramTimelineId);
    } else {
      // Get user's root timeline
      loadDefaultTimeline();
    }
  }, [searchParams]);

  const loadDefaultTimeline = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: timelines } = await supabase
        .from('timelines')
        .select('id')
        .eq('user_id', user.id)
        .eq('timeline_type', 'personal')
        .limit(1)
        .maybeSingle();

      if (timelines) {
        setTimelineId(timelines.id);
      }
    } catch (error) {
      console.error('Error loading timeline:', error);
    }
  };

  const handleClose = () => {
    setWizardOpen(false);
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <ContributionWizard
        open={wizardOpen}
        onOpenChange={handleClose}
        timelineId={timelineId}
      />
    </div>
  );
};