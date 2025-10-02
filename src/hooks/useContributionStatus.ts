import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContributionStatus } from '@/types/contribution';
import { toast } from 'sonner';

interface UseContributionStatusReturn {
  updateStatus: (contributionId: string, newStatus: ContributionStatus) => Promise<boolean>;
  isUpdating: boolean;
}

export const useContributionStatus = (): UseContributionStatusReturn => {
  const [isUpdating, setIsUpdating] = useState(false);

  const validateStatusTransition = (
    currentStatus: ContributionStatus,
    newStatus: ContributionStatus
  ): boolean => {
    const validTransitions: Record<ContributionStatus, ContributionStatus[]> = {
      draft: ['setup_incomplete', 'ready_to_receive', 'ready_to_give', 'cancelled'],
      setup_incomplete: ['ready_to_receive', 'ready_to_give', 'draft', 'cancelled'],
      ready_to_receive: ['negotiating', 'active', 'cancelled'],
      ready_to_give: ['negotiating', 'active', 'cancelled'],
      negotiating: ['active', 'ready_to_receive', 'ready_to_give', 'cancelled'],
      active: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  };

  const updateStatus = async (
    contributionId: string,
    newStatus: ContributionStatus
  ): Promise<boolean> => {
    setIsUpdating(true);

    try {
      // Get current status
      const { data: contribution, error: fetchError } = await supabase
        .from('contributions')
        .select('status')
        .eq('id', contributionId)
        .single();

      if (fetchError) throw fetchError;

      const currentStatus = contribution.status as ContributionStatus;

      // Validate transition
      if (!validateStatusTransition(currentStatus, newStatus)) {
        toast.error(`Cannot transition from ${currentStatus} to ${newStatus}`);
        return false;
      }

      // Update status
      const { error: updateError } = await supabase
        .from('contributions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', contributionId);

      if (updateError) throw updateError;

      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      return true;
    } catch (error) {
      console.error('Error updating contribution status:', error);
      toast.error('Failed to update status');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating };
};
