import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface ComparisonViewProps {
  contributionId: string;
  proposals: any[];
  mode: 'strict' | 'flexible';
}

export const ComparisonView = ({ contributionId, proposals, mode }: ComparisonViewProps) => {
  const [giverData, setGiverData] = useState<any>(null);
  const [receiverData, setReceiverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparisonData();
  }, [contributionId, proposals]);

  const loadComparisonData = async () => {
    try {
      setLoading(true);

      // Load contribution details with all configured data
      const { data: contribution } = await supabase
        .from('contributions')
        .select(`
          *,
          contribution_subtypes(*),
          contribution_valuations(*),
          contribution_insights(*),
          contribution_followups(*),
          contribution_smart_rules(*),
          contribution_ratings(*),
          contribution_files(*),
          contribution_knots(*)
        `)
        .eq('id', contributionId)
        .single();

      if (contribution) {
        // Separate "to give" and "to receive" data
        const giver = {
          subtypes: contribution.contribution_subtypes?.filter((s: any) => s.direction === 'give') || [],
          valuations: contribution.contribution_valuations?.filter((v: any) => v.direction === 'give') || [],
          insights: contribution.contribution_insights || [],
          followups: contribution.contribution_followups || [],
          smartRules: contribution.contribution_smart_rules || [],
          files: contribution.contribution_files || []
        };

        const receiver = {
          subtypes: contribution.contribution_subtypes?.filter((s: any) => s.direction === 'receive') || [],
          valuations: contribution.contribution_valuations?.filter((v: any) => v.direction === 'receive') || [],
          insights: contribution.contribution_insights || [],
          followups: contribution.contribution_followups || [],
          smartRules: contribution.contribution_smart_rules || [],
          files: contribution.contribution_files || []
        };

        setGiverData(giver);
        setReceiverData(receiver);
      }
    } catch (error) {
      console.error('Error loading comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderComparisonRow = (label: string, giverValue: any, receiverValue: any) => {
    const isMatch = JSON.stringify(giverValue) === JSON.stringify(receiverValue);

    return (
      <div className="grid grid-cols-3 gap-4 py-3 border-b">
        <div className="font-medium">{label}</div>
        <div className="flex items-center gap-2">
          {giverValue}
          {isMatch ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {receiverValue}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading comparison...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 font-semibold border-b-2 pb-2">
        <div>Field</div>
        <div>Giver</div>
        <div>Receiver</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Valuations</CardTitle>
        </CardHeader>
        <CardContent>
          {renderComparisonRow(
            'Amount',
            giverData?.valuations[0]?.amount || 'Not set',
            receiverData?.valuations[0]?.amount || 'Not set'
          )}
          {renderComparisonRow(
            'Currency',
            giverData?.valuations[0]?.currency || 'USD',
            receiverData?.valuations[0]?.currency || 'USD'
          )}
          {renderComparisonRow(
            'Type',
            giverData?.valuations[0]?.valuation_type || 'Not set',
            receiverData?.valuations[0]?.valuation_type || 'Not set'
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Subtypes</CardTitle>
        </CardHeader>
        <CardContent>
          {renderComparisonRow(
            'Count',
            giverData?.subtypes.length || 0,
            receiverData?.subtypes.length || 0
          )}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Giving:</h4>
              {giverData?.subtypes.map((s: any, i: number) => (
                <Badge key={i} variant="secondary" className="mr-2 mb-2">
                  {s.subtype_name}
                </Badge>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-2">Receiving:</h4>
              {receiverData?.subtypes.map((s: any, i: number) => (
                <Badge key={i} variant="secondary" className="mr-2 mb-2">
                  {s.subtype_name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Follow-ups</CardTitle>
        </CardHeader>
        <CardContent>
          {renderComparisonRow(
            'Count',
            giverData?.followups.length || 0,
            receiverData?.followups.length || 0
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Smart Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {renderComparisonRow(
            'Count',
            giverData?.smartRules.length || 0,
            receiverData?.smartRules.length || 0
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Files</CardTitle>
        </CardHeader>
        <CardContent>
          {renderComparisonRow(
            'Required Files',
            giverData?.files.length || 0,
            receiverData?.files.length || 0
          )}
        </CardContent>
      </Card>

      {mode === 'strict' && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Strict Mode:</strong> Terms are non-negotiable. Review the comparison above and accept or reject the contribution.
          </p>
        </div>
      )}
    </div>
  );
};
