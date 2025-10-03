import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link2 } from 'lucide-react';

interface KnotsTabViewProps {
  contributionId: string;
}

interface KnotData {
  id: string;
  knot_type: string;
  linked_timeline_id: string | null;
  configuration: any;
  created_at: string;
}

export const KnotsTabView = ({ contributionId }: KnotsTabViewProps) => {
  const [knots, setKnots] = useState<KnotData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnots();
  }, [contributionId]);

  const fetchKnots = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_knots')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKnots(data || []);
    } catch (error) {
      console.error('Error fetching knots:', error);
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

  if (knots.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Link2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No knots configured yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {knots.map((knot) => (
        <Card key={knot.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base capitalize">
                {knot.knot_type.replace(/_/g, ' ')}
              </CardTitle>
              <Badge variant="outline">Knot</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {knot.linked_timeline_id && (
              <p className="text-sm text-muted-foreground">
                Linked Timeline ID: <code className="bg-muted px-1 py-0.5 rounded text-xs">{knot.linked_timeline_id}</code>
              </p>
            )}
            {knot.configuration && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  View Configuration
                </summary>
                <pre className="mt-2 bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(knot.configuration, null, 2)}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
