import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SelectedSubtype } from '@/types/contribution';
import { 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Zap, 
  Star, 
  FileText, 
  Link2, 
  Users,
  TrendingUp 
} from 'lucide-react';

interface Step14PreviewProps {
  contributionId: string;
  selectedSubtypes: SelectedSubtype[];
  onPublish: () => void;
}

export const Step14Preview = ({ contributionId, selectedSubtypes, onPublish }: Step14PreviewProps) => {
  const [loading, setLoading] = useState(false);
  const [contributionData, setContributionData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContributionData();
  }, [contributionId]);

  const loadContributionData = async () => {
    try {
      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .eq('id', contributionId)
        .single();

      if (error) throw error;
      setContributionData(data);
    } catch (error) {
      console.error('Error loading contribution:', error);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      // Determine status based on selected subtypes
      const hasToGive = selectedSubtypes.some(s => s.direction === 'to_give');
      const hasToReceive = selectedSubtypes.some(s => s.direction === 'to_receive');
      
      let newStatus: 'ready_to_give' | 'ready_to_receive' | 'active' = 'active';
      if (hasToGive && !hasToReceive) {
        newStatus = 'ready_to_give';
      } else if (hasToReceive && !hasToGive) {
        newStatus = 'ready_to_receive';
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update contribution status
      const { error: updateError } = await supabase
        .from('contributions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', contributionId);

      if (updateError) throw updateError;

      // If contribution is marked as timeline, create a timeline entry
      if (contributionData?.is_timeline) {
        const { error: timelineError } = await supabase
          .from('timelines')
          .insert({
            user_id: user.id,
            title: contributionData.title || 'Untitled Contribution Timeline',
            description: contributionData.description,
            timeline_type: contributionData.category as any,
            is_public: false,
            parent_timeline_id: contributionData.timeline_id
          });

        if (timelineError) throw timelineError;
      }

      toast({
        title: "Published Successfully!",
        description: `Your contribution is now ${newStatus.replace('_', ' ')} and visible to others.`,
      });
      
      // Close wizard after successful publish
      setTimeout(() => onPublish(), 500);
    } catch (error) {
      console.error('Error publishing:', error);
      toast({
        title: "Error",
        description: "Failed to publish contribution",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toGiveSubtypes = selectedSubtypes.filter(s => s.direction === 'to_give');
  const toReceiveSubtypes = selectedSubtypes.filter(s => s.direction === 'to_receive');

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/10 border-primary">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Review your contribution setup before publishing. Once published, it will be visible to matched contributors.
        </AlertDescription>
      </Alert>

      {/* Contribution Summary */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Contribution Overview</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Timeline Type:</span>
            <Badge variant={contributionData?.is_timeline ? "default" : "secondary"}>
              {contributionData?.is_timeline ? 'Timeline' : 'Single Contribution'}
            </Badge>
          </div>
          {contributionData?.title && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-medium">{contributionData.title}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium capitalize">{contributionData?.category}</span>
          </div>
        </div>
      </Card>

      {/* Selected Subtypes */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Selected Contributions</h3>
        
        {toGiveSubtypes.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-muted-foreground mb-2">To Give:</p>
            <div className="flex flex-wrap gap-2">
              {toGiveSubtypes.map((subtype, i) => (
                <Badge key={i} variant="default">
                  {subtype.displayName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {toReceiveSubtypes.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">To Receive:</p>
            <div className="flex flex-wrap gap-2">
              {toReceiveSubtypes.map((subtype, i) => (
                <Badge key={i} variant="secondary">
                  {subtype.displayName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Configuration Summary */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Configuration Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>Insights: Configured</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Valuation: Ready</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Follow-ups: Set</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span>Smart Rules: Active</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span>Rating System: Configured</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Files: Attached</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <span>Knots: Linked</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Contributors: Added</span>
          </div>
        </div>
      </Card>

      <Separator />

      <div className="flex flex-col gap-2">
        <Button onClick={handlePublish} size="lg" disabled={loading} className="w-full">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          {loading ? 'Publishing...' : 'Publish Contribution'}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          By publishing, you agree to the contribution terms and make it visible for matching
        </p>
      </div>
    </div>
  );
};
