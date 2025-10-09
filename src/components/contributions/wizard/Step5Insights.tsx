import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, Plus, Settings, HandshakeIcon, Users } from 'lucide-react';
import { ContributionDirection, SelectedSubtype } from '@/types/contribution';
import { InsightsAdder } from '../adders/InsightsAdder';
import { NegotiationAdder } from '../negotiation/NegotiationAdder';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InsightConfig {
  id: string;
  insightType: string;
  source: 'timeline_schema' | 'api' | 'uploaded_report';
  apiEndpoint?: string;
  expectedOutput: string;
  description?: string;
}

interface SubtypeInsights {
  [subtypeName: string]: {
    to_give: InsightConfig[];
    to_receive: InsightConfig[];
  };
}

interface Step5InsightsProps {
  selectedSubtypes: SelectedSubtype[];
  currentTab: ContributionDirection;
  setCurrentTab: (tab: ContributionDirection) => void;
  contributionId?: string;
}

export const Step5Insights = ({
  selectedSubtypes,
  currentTab,
  setCurrentTab,
  contributionId,
}: Step5InsightsProps) => {
  const { toast } = useToast();
  const [adderOpen, setAdderOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [currentSubtype, setCurrentSubtype] = useState<string>('');
  const [currentDirection, setCurrentDirection] = useState<ContributionDirection>('to_give');
  const [subtypeInsights, setSubtypeInsights] = useState<SubtypeInsights>({});

  // Load existing insights from database
  useEffect(() => {
    if (contributionId) {
      loadInsights();
    }
  }, [contributionId]);

  const loadInsights = async () => {
    if (!contributionId) return;

    const { data, error } = await supabase
      .from('contribution_insights')
      .select('*')
      .eq('contribution_id', contributionId);

    if (error) {
      console.error('Error loading insights:', error);
      return;
    }

    // Organize insights by subtype and direction
    const organized: SubtypeInsights = {};
    data?.forEach((insight) => {
      const subtypeName = insight.subtype_name || 'general';
      if (!organized[subtypeName]) {
        organized[subtypeName] = { to_give: [], to_receive: [] };
      }
      
      const config = insight.configuration as any;
      const insightConfig: InsightConfig = {
        id: insight.id,
        insightType: insight.insight_type,
        source: config?.source || 'timeline_schema',
        apiEndpoint: config?.apiEndpoint,
        expectedOutput: config?.expectedOutput || '',
        description: config?.description,
      };

      // Determine direction from configuration or default to both
      const direction = config?.direction || 'to_give';
      organized[subtypeName][direction as ContributionDirection].push(insightConfig);
    });

    setSubtypeInsights(organized);
  };

  const openAdder = (subtypeName: string, direction: ContributionDirection) => {
    setCurrentSubtype(subtypeName);
    setCurrentDirection(direction);
    setAdderOpen(true);
  };

  const handleSaveInsights = async (insights: InsightConfig[]) => {
    if (!contributionId) {
      toast({
        title: 'Error',
        description: 'Contribution ID not found',
        variant: 'destructive',
      });
      return;
    }

    // Delete existing insights for this subtype and direction
    const { error: deleteError } = await supabase
      .from('contribution_insights')
      .delete()
      .eq('contribution_id', contributionId)
      .eq('subtype_name', currentSubtype);

    if (deleteError) {
      toast({
        title: 'Error',
        description: 'Failed to update insights',
        variant: 'destructive',
      });
      return;
    }

    // Insert new insights
    if (insights.length > 0) {
      const insightsToInsert = insights.map((insight) => ({
        contribution_id: contributionId,
        subtype_name: currentSubtype,
        insight_type: insight.insightType,
        configuration: {
          source: insight.source,
          apiEndpoint: insight.apiEndpoint,
          expectedOutput: insight.expectedOutput,
          description: insight.description,
          direction: currentDirection,
        },
      }));

      const { error: insertError } = await supabase
        .from('contribution_insights')
        .insert(insightsToInsert);

      if (insertError) {
        toast({
          title: 'Error',
          description: 'Failed to save insights',
          variant: 'destructive',
        });
        return;
      }
    }

    // Update local state
    setSubtypeInsights({
      ...subtypeInsights,
      [currentSubtype]: {
        ...subtypeInsights[currentSubtype],
        [currentDirection]: insights,
      },
    });

    toast({
      title: 'Success',
      description: 'Insights saved successfully',
    });
  };

  const getInsightsForSubtype = (subtypeName: string, direction: ContributionDirection) => {
    return subtypeInsights[subtypeName]?.[direction] || [];
  };

  const getSubtypesByDirection = (direction: ContributionDirection) => {
    return selectedSubtypes.filter((s) => s.direction === direction);
  };

  const renderSubtypeInsights = (direction: ContributionDirection) => {
    const subtypes = getSubtypesByDirection(direction);

    if (subtypes.length === 0) {
      return (
        <div className="p-8 border-2 border-dashed rounded-lg text-center">
          <p className="text-muted-foreground">
            No subtypes selected for {direction === 'to_give' ? 'giving' : 'receiving'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {subtypes.map((subtype) => {
          const insights = getInsightsForSubtype(subtype.name, direction);
          return (
            <div key={subtype.name} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{subtype.displayName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {insights.length} insight{insights.length !== 1 ? 's' : ''} configured
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAdder(subtype.name, direction)}
                >
                  {insights.length > 0 ? (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>
              </div>

              {insights.length > 0 && (
                <div className="space-y-2">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-2 bg-muted/50 rounded text-sm space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{insight.insightType}</span>
                        <Badge variant="secondary" className="text-xs">
                          {insight.source}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Output: {insight.expectedOutput}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 min-h-0 flex-1 overflow-y-auto">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure expected insights for your selected contribution types. You can skip this step and configure it later.
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

      <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as ContributionDirection)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="to_give">To Give</TabsTrigger>
          <TabsTrigger value="to_receive">To Receive</TabsTrigger>
        </TabsList>

        <TabsContent value="to_give" className="space-y-4 mt-6">
          {renderSubtypeInsights('to_give')}
        </TabsContent>

        <TabsContent value="to_receive" className="space-y-4 mt-6">
          {renderSubtypeInsights('to_receive')}
        </TabsContent>
      </Tabs>

      <InsightsAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        subtypeName={currentSubtype}
        direction={currentDirection}
        existingInsights={getInsightsForSubtype(currentSubtype, currentDirection)}
        onSave={handleSaveInsights}
      />

      {contributionId && (
        <NegotiationAdder
          open={negotiationOpen}
          onOpenChange={setNegotiationOpen}
          contributionId={contributionId}
          mode="flexible"
          giverUserId=""
          receiverUserId=""
        />
      )}
    </div>
  );
};
