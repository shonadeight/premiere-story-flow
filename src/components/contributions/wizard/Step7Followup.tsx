import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { FollowupAdder } from '../adders/FollowupAdder';
import { NegotiationAdder } from '../negotiation/NegotiationAdder';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { SelectedSubtype } from '@/types/contribution';
import { getFollowupTemplates } from '@/lib/templates/contributionTemplates';

interface Step7FollowupProps {
  contributionId: string;
  selectedSubtypes: SelectedSubtype[];
}

export const Step7Followup = ({ contributionId, selectedSubtypes }: Step7FollowupProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [activeSubtype, setActiveSubtype] = useState<SelectedSubtype | null>(null);
  const [followups, setFollowups] = useState<Record<string, any[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadFollowups();
  }, [contributionId]);

  const loadFollowups = async () => {
    const { data, error} = await supabase
      .from('contribution_followups')
      .select('*')
      .eq('contribution_id', contributionId);

    if (error) {
      console.error('Error loading followups:', error);
      return;
    }

    const grouped = (data || []).reduce((acc, followup) => {
      const key = `${followup.subtype_name}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(followup);
      return acc;
    }, {} as Record<string, any[]>);

    setFollowups(grouped);
  };

  const handleEnableTemplate = async (subtype: SelectedSubtype, template: any) => {
    try {
      const { error } = await supabase.from('contribution_followups').insert({
        contribution_id: contributionId,
        subtype_name: subtype.name,
        followup_status: template.followup_status,
        notes: template.notes,
        due_date: template.due_date,
      });

      if (error) throw error;

      toast({
        title: 'Template enabled',
        description: `Follow-up template applied for ${subtype.displayName}`,
      });
      
      loadFollowups();
    } catch (error) {
      console.error('Error enabling template:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable template',
        variant: 'destructive',
      });
    }
  };

  const handleSaveFollowup = async (followupData: any) => {
    if (!activeSubtype) return;

    try {
      const { error } = await supabase.from('contribution_followups').insert({
        contribution_id: contributionId,
        subtype_name: activeSubtype.name,
        ...followupData,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Follow-up saved successfully',
      });
      
      loadFollowups();
      setAdderOpen(false);
    } catch (error) {
      console.error('Error saving follow-up:', error);
      toast({
        title: 'Error',
        description: 'Failed to save follow-up',
        variant: 'destructive',
      });
    }
  };

  const renderSubtypeCard = (subtype: SelectedSubtype) => {
    const key = subtype.name;
    const subtypeFollowups = followups[key] || [];
    const templates = getFollowupTemplates(subtype.category, subtype.name);

    return (
      <Card key={`${key}-${subtype.direction}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{subtype.displayName}</span>
            <Badge variant={subtype.direction === 'to_give' ? 'default' : 'secondary'}>
              {subtype.direction === 'to_give' ? 'To Give' : 'To Receive'}
            </Badge>
          </CardTitle>
          <CardDescription>{subtype.category}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subtypeFollowups.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Configured Follow-ups:</p>
              {subtypeFollowups.map((followup, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-muted rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{followup.followup_status}</p>
                    {followup.notes && <p className="text-xs text-muted-foreground">{followup.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {templates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Suggested Templates:</p>
                  {templates.map((template, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{template.followup_status}</p>
                        <p className="text-xs text-muted-foreground">{template.notes}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEnableTemplate(subtype, template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setActiveSubtype(subtype);
                setNegotiationOpen(true);
              }}
            >
              Negotiate
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setActiveSubtype(subtype);
                setAdderOpen(true);
              }}
            >
              Custom
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 min-h-0 flex-1 overflow-y-auto">
      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          Configure follow-up procedures for each subtype. Use templates or create custom follow-ups.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {selectedSubtypes.map(subtype => renderSubtypeCard(subtype))}
      </div>

      <FollowupAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveFollowup}
        direction={activeSubtype?.direction || 'to_give'}
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