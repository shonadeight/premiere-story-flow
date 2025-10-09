import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ContributorsAdder } from '../adders/ContributorsAdder';
import { NegotiationAdder } from '../negotiation/NegotiationAdder';
import { Plus, Users, HandshakeIcon, UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step12ContributorsProps {
  contributionId: string;
}

export const Step12Contributors = ({ contributionId }: Step12ContributorsProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [contributors, setContributors] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSaveContributor = async (contributor: any) => {
    try {
      const { error } = await supabase
        .from('contribution_contributors')
        .insert({
          contribution_id: contributionId,
          user_id: contributor.user_id,
          role: contributor.role,
          permissions: contributor.permissions,
        });

      if (error) throw error;

      setContributors([...contributors, contributor]);
      toast({
        title: "Success",
        description: "Contributor added successfully",
      });
    } catch (error) {
      console.error('Error adding contributor:', error);
      toast({
        title: "Error",
        description: "Failed to add contributor",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 min-h-0 flex-1 overflow-y-auto">
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          Add and manage contributors who can participate in this contribution.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={bulkMode ? "default" : "outline"}
          size="sm"
          onClick={() => setBulkMode(!bulkMode)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
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
        Add Contributor
      </Button>

      {contributors.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No contributors added yet
        </p>
      )}

      {contributors.map((contributor, i) => (
        <Card key={i} className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{contributor.user_id}</p>
              <p className="text-sm text-muted-foreground capitalize">{contributor.role}</p>
            </div>
            <Badge variant="outline">{contributor.role}</Badge>
          </div>
        </Card>
      ))}

      <ContributorsAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveContributor}
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
