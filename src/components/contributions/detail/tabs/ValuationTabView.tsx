import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';

interface ValuationTabViewProps {
  contributionId: string;
}

interface ValuationData {
  id: string;
  valuation_type: string;
  direction: string;
  amount: number | null;
  currency: string | null;
  formula: string | null;
  subtype_name: string | null;
  breakdown: any;
  created_at: string;
}

export const ValuationTabView = ({ contributionId }: ValuationTabViewProps) => {
  const [valuations, setValuations] = useState<ValuationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchValuations();
  }, [contributionId]);

  const fetchValuations = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_valuations')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setValuations(data || []);
    } catch (error) {
      console.error('Error fetching valuations:', error);
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

  if (valuations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No valuations configured yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toGiveValuations = valuations.filter(v => v.direction === 'to_give');
  const toReceiveValuations = valuations.filter(v => v.direction === 'to_receive');

  return (
    <div className="space-y-6">
      {/* To Give */}
      {toGiveValuations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">To Give</h3>
          <div className="space-y-4">
            {toGiveValuations.map((valuation) => (
              <Card key={valuation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base capitalize">
                      {valuation.valuation_type.replace(/_/g, ' ')}
                    </CardTitle>
                    {valuation.subtype_name && (
                      <Badge variant="outline" className="capitalize">
                        {valuation.subtype_name.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {valuation.amount !== null && (
                    <p className="text-2xl font-bold mb-2">
                      {valuation.currency || 'USD'} {valuation.amount}
                    </p>
                  )}
                  {valuation.formula && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Formula: <code className="bg-muted px-1 py-0.5 rounded">{valuation.formula}</code>
                    </p>
                  )}
                  {valuation.breakdown && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View Breakdown
                      </summary>
                      <pre className="mt-2 bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(valuation.breakdown, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* To Receive */}
      {toReceiveValuations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">To Receive</h3>
          <div className="space-y-4">
            {toReceiveValuations.map((valuation) => (
              <Card key={valuation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base capitalize">
                      {valuation.valuation_type.replace(/_/g, ' ')}
                    </CardTitle>
                    {valuation.subtype_name && (
                      <Badge variant="outline" className="capitalize">
                        {valuation.subtype_name.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {valuation.amount !== null && (
                    <p className="text-2xl font-bold mb-2">
                      {valuation.currency || 'USD'} {valuation.amount}
                    </p>
                  )}
                  {valuation.formula && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Formula: <code className="bg-muted px-1 py-0.5 rounded">{valuation.formula}</code>
                    </p>
                  )}
                  {valuation.breakdown && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View Breakdown
                      </summary>
                      <pre className="mt-2 bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(valuation.breakdown, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
