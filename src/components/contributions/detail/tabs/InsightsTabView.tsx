import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

interface InsightsTabViewProps {
  contributionId: string;
}

interface InsightData {
  id: string;
  insight_type: string;
  subtype_name: string | null;
  configuration: any;
  created_at: string;
}

export const InsightsTabView = ({ contributionId }: InsightsTabViewProps) => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [contributionId]);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_insights')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
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

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No insights configured yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base capitalize">
                {insight.insight_type.replace(/_/g, ' ')}
              </CardTitle>
              {insight.subtype_name && (
                <Badge variant="outline" className="capitalize">
                  {insight.subtype_name.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {insight.configuration && (
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {JSON.stringify(insight.configuration, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
