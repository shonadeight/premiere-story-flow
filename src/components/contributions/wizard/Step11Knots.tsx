import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { KnotsAdder } from '../adders/KnotsAdder';
import { NegotiationAdder } from '../negotiation/NegotiationAdder';
import { Plus, Link2, HandshakeIcon, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step11KnotsProps {
  contributionId: string;
}

export const Step11Knots = ({ contributionId }: Step11KnotsProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [knots, setKnots] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSaveKnot = async (knot: any) => {
    try {
      const { error } = await supabase
        .from('contribution_knots')
        .insert({
          contribution_id: contributionId,
          knot_type: knot.knot_type,
          linked_timeline_id: knot.linked_timeline_id,
          configuration: knot.configuration,
        });

      if (error) throw error;

      setKnots([...knots, knot]);
      toast({
        title: "Success",
        description: "Timeline knot created successfully",
      });
    } catch (error) {
      console.error('Error saving knot:', error);
      toast({
        title: "Error",
        description: "Failed to create knot",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 min-h-0 flex-1 overflow-y-auto">
      <Alert>
        <Link2 className="h-4 w-4" />
        <AlertDescription>
          Link this contribution to other timelines to share value or create knowledge connections.
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
        Create Knot
      </Button>

      {knots.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No knots configured yet
        </p>
      )}

      {knots.map((knot, i) => (
        <Card key={i} className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">{knot.knot_type.replace('_', ' ')}</p>
              {knot.linked_timeline_id && (
                <p className="text-sm text-muted-foreground">Timeline: {knot.linked_timeline_id.slice(0, 8)}...</p>
              )}
            </div>
            <Badge variant="outline">
              <Link2 className="h-3 w-3 mr-1" />
              Linked
            </Badge>
          </div>
        </Card>
      ))}

      <KnotsAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveKnot}
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
