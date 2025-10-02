import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Plus, Trash2 } from 'lucide-react';
import { ContributionDirection } from '@/types/contribution';

interface InsightConfig {
  id: string;
  insightType: string;
  source: 'timeline_schema' | 'api' | 'uploaded_report';
  apiEndpoint?: string;
  expectedOutput: string;
  description?: string;
}

interface InsightsAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtypeName: string;
  direction: ContributionDirection;
  existingInsights?: InsightConfig[];
  onSave: (insights: InsightConfig[]) => void;
}

export const InsightsAdder = ({
  open,
  onOpenChange,
  subtypeName,
  direction,
  existingInsights = [],
  onSave,
}: InsightsAdderProps) => {
  const isMobile = useIsMobile();
  const [insights, setInsights] = useState<InsightConfig[]>(existingInsights);
  const [currentInsight, setCurrentInsight] = useState<Partial<InsightConfig>>({
    source: 'timeline_schema',
  });

  const addInsight = () => {
    if (!currentInsight.insightType || !currentInsight.expectedOutput) {
      return;
    }

    const newInsight: InsightConfig = {
      id: Math.random().toString(36).substr(2, 9),
      insightType: currentInsight.insightType,
      source: currentInsight.source || 'timeline_schema',
      apiEndpoint: currentInsight.apiEndpoint,
      expectedOutput: currentInsight.expectedOutput,
      description: currentInsight.description,
    };

    setInsights([...insights, newInsight]);
    setCurrentInsight({ source: 'timeline_schema' });
  };

  const removeInsight = (id: string) => {
    setInsights(insights.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    onSave(insights);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure insights for <strong>{subtypeName}</strong> ({direction === 'to_give' ? 'Giving' : 'Receiving'})
        </AlertDescription>
      </Alert>

      {/* Added Insights List */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <Label>Configured Insights</Label>
          <div className="space-y-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start justify-between p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{insight.insightType}</p>
                  <p className="text-xs text-muted-foreground">
                    Source: {insight.source} | Output: {insight.expectedOutput}
                  </p>
                  {insight.description && (
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInsight(insight.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Insight */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h4 className="text-sm font-semibold">Add New Insight</h4>

        <div className="space-y-2">
          <Label htmlFor="insightType">Insight Type*</Label>
          <Input
            id="insightType"
            placeholder="e.g., Conversion Rate, Traffic Analytics"
            value={currentInsight.insightType || ''}
            onChange={(e) =>
              setCurrentInsight({ ...currentInsight, insightType: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Data Source*</Label>
          <Select
            value={currentInsight.source}
            onValueChange={(value) =>
              setCurrentInsight({
                ...currentInsight,
                source: value as InsightConfig['source'],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timeline_schema">Timeline Schema</SelectItem>
              <SelectItem value="api">External API</SelectItem>
              <SelectItem value="uploaded_report">Uploaded Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {currentInsight.source === 'api' && (
          <div className="space-y-2">
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input
              id="apiEndpoint"
              placeholder="https://api.example.com/insights"
              value={currentInsight.apiEndpoint || ''}
              onChange={(e) =>
                setCurrentInsight({ ...currentInsight, apiEndpoint: e.target.value })
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="expectedOutput">Expected Output*</Label>
          <Input
            id="expectedOutput"
            placeholder="e.g., Chart, Table, Statistics"
            value={currentInsight.expectedOutput || ''}
            onChange={(e) =>
              setCurrentInsight({ ...currentInsight, expectedOutput: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Optional description for this insight"
            value={currentInsight.description || ''}
            onChange={(e) =>
              setCurrentInsight({ ...currentInsight, description: e.target.value })
            }
            rows={2}
          />
        </div>

        <Button
          onClick={addInsight}
          variant="outline"
          className="w-full"
          disabled={!currentInsight.insightType || !currentInsight.expectedOutput}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Insight
        </Button>
      </div>
    </div>
  );

  const footer = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save Insights ({insights.length})
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Configure Insights</DrawerTitle>
            <DrawerDescription>
              Define expected insights for this contribution subtype
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">{content}</div>
          <DrawerFooter className="flex flex-row gap-2">
            {footer}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Insights</DialogTitle>
          <DialogDescription>
            Define expected insights for this contribution subtype
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="gap-2">{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
