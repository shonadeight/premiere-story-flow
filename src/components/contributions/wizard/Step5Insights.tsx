import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Plus, CheckCircle2 } from 'lucide-react';
import { InsightsAdder } from '../adders/InsightsAdder';
import { NegotiationAdder } from '../negotiation/NegotiationAdder';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectedSubtype } from '@/types/contribution';
import { getTemplatesBySubtype } from '@/lib/templates/contributionTemplates';
import { Badge } from '@/components/ui/badge';

interface Step5InsightsProps {
  selectedSubtypes: SelectedSubtype[];
  contributionId?: string;
}

export const Step5Insights = ({ 
  selectedSubtypes,
  contributionId 
}: Step5InsightsProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [currentSubtype, setCurrentSubtype] = useState<string>('');
  const [currentDirection, setCurrentDirection] = useState<'to_give' | 'to_receive'>('to_give');
  const [loadedInsights, setLoadedInsights] = useState<Record<string, any[]>>({});
  const [enabledTemplates, setEnabledTemplates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (contributionId) {
      loadInsights();
    }
  }, [contributionId]);

  const loadInsights = async () => {
    if (!contributionId) return;
    
    try {
      const { data, error } = await supabase
        .from('contribution_insights')
        .select('*')
        .eq('contribution_id', contributionId);
      
      if (error) throw error;
      
      const grouped = data?.reduce((acc: Record<string, any[]>, insight) => {
        const key = `${insight.subtype_name}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(insight);
        return acc;
      }, {}) || {};
      
      setLoadedInsights(grouped);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const handleSaveInsights = async (insights: any[]) => {
    if (!contributionId) return;
    
    try {
      const insightsToInsert = insights.map(insight => ({
        contribution_id: contributionId,
        subtype_name: currentSubtype,
        insight_type: insight.insight_type || insight.type,
        configuration: insight
      }));
      
      const { error } = await supabase
        .from('contribution_insights')
        .insert(insightsToInsert);
      
      if (error) throw error;
      
      toast.success('Insights saved successfully');
      setAdderOpen(false);
      loadInsights();
    } catch (error) {
      console.error('Error saving insights:', error);
      toast.error('Failed to save insights');
    }
  };

  const handleEnableTemplate = async (subtypeName: string, direction: string) => {
    if (!contributionId) return;
    
    const templates = getTemplatesBySubtype(subtypeName);
    const template = templates[0];
    
    if (!template?.presets?.insights) {
      toast.error('No template insights available');
      return;
    }
    
    try {
      const insightsToInsert = template.presets.insights.map((insight: any) => ({
        contribution_id: contributionId,
        subtype_name: subtypeName,
        insight_type: insight.insight_type,
        configuration: insight
      }));
      
      const { error } = await supabase
        .from('contribution_insights')
        .insert(insightsToInsert);
      
      if (error) throw error;
      
      setEnabledTemplates(prev => ({ ...prev, [`${subtypeName}-${direction}`]: true }));
      toast.success('Template enabled successfully');
      loadInsights();
    } catch (error) {
      console.error('Error enabling template:', error);
      toast.error('Failed to enable template');
    }
  };

  const renderSubtypeCard = (subtype: SelectedSubtype) => {
    const key = `${subtype.name}-${subtype.direction}`;
    const insights = loadedInsights[subtype.name] || [];
    const templates = getTemplatesBySubtype(subtype.name);
    const hasTemplate = templates.length > 0 && templates[0].presets?.insights;
    const isEnabled = enabledTemplates[key];
    
    return (
      <Card key={key} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{subtype.displayName}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {subtype.direction === 'to_give' ? 'To Give' : 'To Receive'}
              </Badge>
            </div>
            <div className="flex gap-2">
              {hasTemplate && !isEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEnableTemplate(subtype.name, subtype.direction)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Use Template
                </Button>
              )}
              {hasTemplate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNegotiationOpen(true)}
                >
                  Negotiate
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentSubtype(subtype.name);
                  setCurrentDirection(subtype.direction);
                  setAdderOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Custom
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {insights.length > 0 ? (
            <div className="space-y-2">
              {insights.map((insight: any, idx: number) => (
                <div key={idx} className="p-3 bg-muted rounded-md text-sm">
                  <div className="font-medium">{insight.insight_type}</div>
                  <div className="text-muted-foreground mt-1">
                    Source: {insight.configuration?.source || 'Not specified'}
                  </div>
                  {insight.configuration?.expected_output && (
                    <div className="text-muted-foreground">
                      Output: {insight.configuration.expected_output}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : hasTemplate ? (
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Template available with:</p>
              <ul className="list-disc list-inside space-y-1">
                {templates[0].presets.insights?.map((insight: any, idx: number) => (
                  <li key={idx}>{insight.insight_type} - {insight.source}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No insights configured yet.
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 min-h-0 flex-1 overflow-y-auto">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure insights for each selected subtype. Use templates or create custom configurations.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {selectedSubtypes.map(renderSubtypeCard)}
        
        {selectedSubtypes.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No subtypes selected. Please go back to Step 3 to select subtypes.
          </p>
        )}
      </div>

      {adderOpen && (
        <InsightsAdder
          open={adderOpen}
          onOpenChange={setAdderOpen}
          subtypeName={currentSubtype}
          direction={currentDirection}
          onSave={handleSaveInsights}
        />
      )}

      {contributionId && negotiationOpen && (
        <NegotiationAdder
          contributionId={contributionId}
          open={negotiationOpen}
          onOpenChange={setNegotiationOpen}
          mode="flexible"
          giverUserId=""
          receiverUserId=""
        />
      )}
    </div>
  );
};
