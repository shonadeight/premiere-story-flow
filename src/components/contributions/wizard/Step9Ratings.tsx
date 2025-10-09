import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RatingsAdder } from '../adders/RatingsAdder';
import { NegotiationAdder } from '../negotiation/NegotiationAdder';
import { Plus, Star, HandshakeIcon, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step9RatingsProps {
  contributionId: string;
}

export const Step9Ratings = ({ contributionId }: Step9RatingsProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [ratingConfigs, setRatingConfigs] = useState<any[]>([]);
  const { toast } = useToast();

  // Load existing rating configs
  useEffect(() => {
    loadRatingConfigs();
  }, [contributionId]);

  const loadRatingConfigs = async () => {
    const { data, error } = await supabase
      .from('contribution_rating_configs')
      .select('*')
      .eq('contribution_id', contributionId);

    if (error) {
      console.error('Error loading rating configs:', error);
      return;
    }

    setRatingConfigs(data || []);
  };

  const handleSaveConfig = async (config: any) => {
    try {
      const { error } = await supabase
        .from('contribution_rating_configs')
        .insert({
          contribution_id: contributionId,
          criteria: config.criteria,
          max_rating: config.max_rating,
          scale_type: config.scale_type,
        });

      if (error) throw error;

      await loadRatingConfigs();
      toast({
        title: "Success",
        description: "Rating criteria added successfully",
      });
    } catch (error) {
      console.error('Error saving rating config:', error);
      toast({
        title: "Error",
        description: "Failed to save rating criteria",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 min-h-0 flex-1 overflow-y-auto">
      <Alert>
        <Star className="h-4 w-4" />
        <AlertDescription>
          Configure custom rating criteria to evaluate contribution quality and performance.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={bulkMode ? "default" : "outline"}
          size="sm"
          onClick={() => setBulkMode(!bulkMode)}
        >
          <Users className="h-4 w-4 mr-2" />
          {bulkMode ? 'Individual Mode' : 'Bulk Setup'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNegotiationOpen(true)}
        >
          <HandshakeIcon className="h-4 w-4 mr-2" />
          Negotiate
        </Button>
      </div>

      <Button onClick={() => setAdderOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Rating Criteria
      </Button>

      {ratingConfigs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No rating criteria configured yet
        </p>
      )}

      {ratingConfigs.map((config) => (
        <Card key={config.id} className="p-3">
          <div className="space-y-1">
            <p className="font-medium">{config.criteria}</p>
            <p className="text-sm text-muted-foreground">
              Scale: {config.scale_type} (Max: {config.max_rating})
            </p>
          </div>
        </Card>
      ))}

      <RatingsAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveConfig}
      />

      <NegotiationAdder
        open={negotiationOpen}
        onOpenChange={setNegotiationOpen}
        contributionId={contributionId}
        mode="flexible"
        giverUserId=""
        receiverUserId=""
      />
    </div>
  );
};
