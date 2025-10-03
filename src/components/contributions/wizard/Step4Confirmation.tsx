import { useImperativeHandle, forwardRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { SelectedSubtype } from '@/types/contribution';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step4ConfirmationProps {
  selectedSubtypes: SelectedSubtype[];
  timelineId: string;
  isTimeline: boolean;
  timelineTitle?: string;
  timelineDescription?: string;
  onComplete: (contributionId: string) => void;
}

export interface Step4ConfirmationHandle {
  save: () => Promise<void>;
}

export const Step4Confirmation = forwardRef<Step4ConfirmationHandle, Step4ConfirmationProps>(({
  selectedSubtypes,
  timelineId,
  isTimeline,
  timelineTitle,
  timelineDescription,
  onComplete
}, ref) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create contribution record
      const { data: contribution, error: contribError } = await supabase
        .from('contributions')
        .insert({
          timeline_id: timelineId,
          creator_user_id: user.id,
          category: selectedSubtypes[0]?.category || 'financial',
          status: 'setup_incomplete',
          is_timeline: isTimeline,
          title: timelineTitle,
          description: timelineDescription
        })
        .select()
        .single();

      if (contribError) throw contribError;

      // Insert selected subtypes
      const subtypesData = selectedSubtypes.map(st => ({
        contribution_id: contribution.id,
        subtype_name: st.name,
        direction: st.direction
      }));

      const { error: subtypesError } = await supabase
        .from('contribution_subtypes')
        .insert(subtypesData);

      if (subtypesError) throw subtypesError;

      toast({
        title: 'Success',
        description: 'Contribution saved! Continue with configurations or skip to publish.'
      });

      onComplete(contribution.id);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Expose save method to parent via ref
  useImperativeHandle(ref, () => ({
    save: handleSave
  }));

  return (
    <div className="space-y-6">
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Review your selections below. Click Next to save and continue with optional configurations.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">To Give:</h3>
          {selectedSubtypes.filter(s => s.direction === 'to_give').length === 0 ? (
            <p className="text-muted-foreground text-sm">No subtypes selected</p>
          ) : (
            <div className="space-y-2">
              {selectedSubtypes.filter(s => s.direction === 'to_give').map((st, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Badge variant="outline">{st.category}</Badge>
                  <span className="font-medium">{st.displayName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3">To Receive:</h3>
          {selectedSubtypes.filter(s => s.direction === 'to_receive').length === 0 ? (
            <p className="text-muted-foreground text-sm">No subtypes selected</p>
          ) : (
            <div className="space-y-2">
              {selectedSubtypes.filter(s => s.direction === 'to_receive').map((st, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Badge variant="outline">{st.category}</Badge>
                  <span className="font-medium">{st.displayName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Step4Confirmation.displayName = 'Step4Confirmation';