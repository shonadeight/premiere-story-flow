import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface FollowupTabViewProps {
  contributionId: string;
}

interface FollowupData {
  id: string;
  followup_status: string;
  due_date: string | null;
  completed: boolean;
  notes: string | null;
  subtype_name: string | null;
  created_at: string;
}

export const FollowupTabView = ({ contributionId }: FollowupTabViewProps) => {
  const [followups, setFollowups] = useState<FollowupData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowups();
  }, [contributionId]);

  const fetchFollowups = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_followups')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setFollowups(data || []);
    } catch (error) {
      console.error('Error fetching followups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (followups.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No follow-ups configured yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {followups.map((followup) => (
        <Card key={followup.id} className={followup.completed ? 'opacity-60' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">
                  {followup.followup_status}
                </CardTitle>
                {followup.completed && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              {followup.subtype_name && (
                <Badge variant="outline" className="capitalize">
                  {followup.subtype_name.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {followup.due_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Due: {format(new Date(followup.due_date), 'MMM d, yyyy')}
              </div>
            )}
            {followup.notes && (
              <p className="text-sm">{followup.notes}</p>
            )}
            <div className="flex items-center gap-2 pt-2">
              <Badge variant={followup.completed ? 'default' : 'secondary'}>
                {followup.completed ? 'Completed' : 'Pending'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
