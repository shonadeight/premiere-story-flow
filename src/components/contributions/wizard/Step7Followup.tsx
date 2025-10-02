import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FollowupAdder } from '../adders/FollowupAdder';
import { Plus, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step7FollowupProps {
  contributionId: string;
}

export const Step7Followup = ({ contributionId }: Step7FollowupProps) => {
  const [currentTab, setCurrentTab] = useState<'to_give' | 'to_receive'>('to_give');
  const [adderOpen, setAdderOpen] = useState(false);
  const [followups, setFollowups] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSaveFollowup = async (followup: any) => {
    try {
      const { error } = await supabase
        .from('contribution_followups')
        .insert({
          contribution_id: contributionId,
          followup_status: followup.followup_status,
          notes: followup.notes,
          due_date: followup.due_date,
        });

      if (error) throw error;

      setFollowups([...followups, { ...followup, direction: currentTab }]);
      toast({
        title: "Success",
        description: "Follow-up added successfully",
      });
    } catch (error) {
      console.error('Error saving follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to save follow-up",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          Configure follow-up procedures and schedules for tracking contribution progress.
        </AlertDescription>
      </Alert>

      <Tabs value={currentTab} onValueChange={(v: any) => setCurrentTab(v)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="to_give">To Give</TabsTrigger>
          <TabsTrigger value="to_receive">To Receive</TabsTrigger>
        </TabsList>

        <TabsContent value="to_give" className="space-y-3">
          <Button onClick={() => setAdderOpen(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Follow-up
          </Button>

          {followups.filter(f => f.direction === 'to_give').map((followup, i) => (
            <Card key={i} className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{followup.followup_status}</p>
                  <Badge variant="outline">Pending</Badge>
                </div>
                {followup.notes && (
                  <p className="text-sm text-muted-foreground">{followup.notes}</p>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="to_receive" className="space-y-3">
          <Button onClick={() => setAdderOpen(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Follow-up
          </Button>

          {followups.filter(f => f.direction === 'to_receive').map((followup, i) => (
            <Card key={i} className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{followup.followup_status}</p>
                  <Badge variant="outline">Pending</Badge>
                </div>
                {followup.notes && (
                  <p className="text-sm text-muted-foreground">{followup.notes}</p>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <FollowupAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveFollowup}
        direction={currentTab}
      />
    </div>
  );
};
