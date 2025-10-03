import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface OverviewTabProps {
  contributionId: string;
}

interface SubtypeData {
  id: string;
  subtype_name: string;
  direction: string;
  step_completed: boolean;
  created_at: string;
}

export const OverviewTab = ({ contributionId }: OverviewTabProps) => {
  const [subtypes, setSubtypes] = useState<SubtypeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubtypes();
  }, [contributionId]);

  const fetchSubtypes = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_subtypes')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSubtypes(data || []);
    } catch (error) {
      console.error('Error fetching subtypes:', error);
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

  const toGiveSubtypes = subtypes.filter(s => s.direction === 'to_give');
  const toReceiveSubtypes = subtypes.filter(s => s.direction === 'to_receive');

  return (
    <div className="space-y-6">
      {/* To Give */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            To Give
            <Badge variant="outline">{toGiveSubtypes.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {toGiveSubtypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subtypes configured</p>
          ) : (
            <div className="space-y-3">
              {toGiveSubtypes.map((subtype) => (
                <div
                  key={subtype.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium capitalize">
                      {subtype.subtype_name.replace(/_/g, ' ')}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(subtype.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <Badge variant={subtype.step_completed ? 'default' : 'secondary'}>
                    {subtype.step_completed ? 'Configured' : 'Incomplete'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* To Receive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            To Receive
            <Badge variant="outline">{toReceiveSubtypes.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {toReceiveSubtypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subtypes configured</p>
          ) : (
            <div className="space-y-3">
              {toReceiveSubtypes.map((subtype) => (
                <div
                  key={subtype.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium capitalize">
                      {subtype.subtype_name.replace(/_/g, ' ')}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(subtype.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <Badge variant={subtype.step_completed ? 'default' : 'secondary'}>
                    {subtype.step_completed ? 'Configured' : 'Incomplete'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
