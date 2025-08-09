import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Share2, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Users, 
  Target,
  Calculator,
  Settings,
  Plus,
  Minus,
  BarChart3
} from 'lucide-react';
import { Timeline, Outcome } from '@/types/timeline';
import { mockTimelines, mockOutcomes } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface OutcomeSharingProps {
  timeline: Timeline;
}

interface SharingRule {
  id: string;
  targetTimelineId: string;
  targetTimelineName: string;
  shareType: 'percentage' | 'fixed' | 'milestone';
  shareValue: number;
  condition: string;
  description: string;
  isActive: boolean;
}

export const OutcomeSharing = ({ timeline }: OutcomeSharingProps) => {
  const [activeTab, setActiveTab] = useState('rules');
  const [selectedTargetTimeline, setSelectedTargetTimeline] = useState('');
  const [shareType, setShareType] = useState<'percentage' | 'fixed' | 'milestone'>('percentage');
  const [shareValue, setShareValue] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  // Mock sharing rules for this timeline
  const mockSharingRules: SharingRule[] = [
    {
      id: '1',
      targetTimelineId: '2',
      targetTimelineName: 'Sarah Chen Partnership',
      shareType: 'percentage',
      shareValue: 20,
      condition: 'ROI > 15%',
      description: 'Share 20% of returns when ROI exceeds 15%',
      isActive: true
    },
    {
      id: '2',
      targetTimelineId: '5',
      targetTimelineName: 'AI Model Training',
      shareType: 'fixed',
      shareValue: 5000,
      condition: 'Revenue > $50K',
      description: 'Fixed $5,000 bonus when revenue milestone is reached',
      isActive: true
    },
    {
      id: '3',
      targetTimelineId: '4',
      targetTimelineName: 'Q2 Revenue Growth',
      shareType: 'milestone',
      shareValue: 10000,
      condition: 'Project completion',
      description: 'One-time payment on successful project delivery',
      isActive: false
    }
  ];

  // Calculate potential outcomes based on current sharing rules
  const calculatePotentialOutcomes = () => {
    const currentValue = timeline.value;
    const currentROI = timeline.changePercent;
    let totalShared = 0;

    mockSharingRules.forEach(rule => {
      if (!rule.isActive) return;

      switch (rule.shareType) {
        case 'percentage':
          if (currentROI > 15) { // Simplified condition check
            totalShared += (currentValue * rule.shareValue) / 100;
          }
          break;
        case 'fixed':
          if (currentValue > 50000) { // Simplified condition check
            totalShared += rule.shareValue;
          }
          break;
        case 'milestone':
          // Milestone-based sharing would be triggered by specific events
          break;
      }
    });

    return {
      totalShared,
      netReturn: currentValue - totalShared,
      sharePercentage: (totalShared / currentValue) * 100
    };
  };

  const potentialOutcomes = calculatePotentialOutcomes();

  const handleCreateRule = () => {
    if (!selectedTargetTimeline || !shareValue || !condition || !description) {
      toast({ title: "Please fill in all required fields" });
      return;
    }

    toast({ 
      title: "Outcome sharing rule created",
      description: `New sharing rule has been added for ${description}`
    });

    // Reset form
    setSelectedTargetTimeline('');
    setShareValue('');
    setCondition('');
    setDescription('');
  };

  const availableTimelines = mockTimelines.filter(t => 
    t.id !== timeline.id && t.isPublic
  );

  const recentOutcomes = mockOutcomes.filter(outcome => 
    outcome.sharedWith.length > 0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Outcome Sharing System
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure automatic outcome distribution between timelines
          </p>
        </CardHeader>
        <CardContent>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium">Shared This Month</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                ${potentialOutcomes.totalShared.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-medium">Net Returns</span>
              </div>
              <div className="text-2xl font-bold text-success">
                ${potentialOutcomes.netReturn.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                <span className="font-medium">Share Rate</span>
              </div>
              <div className="text-2xl font-bold text-accent">
                {potentialOutcomes.sharePercentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Sharing Rules</TabsTrigger>
          <TabsTrigger value="create">Create Rule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sharing Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSharingRules.map((rule) => (
                  <div key={rule.id} className={`p-4 border rounded-lg ${
                    rule.isActive ? 'border-primary/20 bg-primary/5' : 'border-muted bg-muted/50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{rule.targetTimelineName}</h4>
                          <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rule.shareType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rule.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Condition: {rule.condition}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calculator className="h-3 w-3" />
                            Value: {rule.shareType === 'percentage' ? `${rule.shareValue}%` : `$${rule.shareValue.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button variant={rule.isActive ? 'outline' : 'default'} size="sm">
                          {rule.isActive ? 'Pause' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                    
                    {rule.isActive && (
                      <div className="pt-3 border-t border-muted">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Estimated monthly share:</span>
                          <span className="font-medium text-primary">
                            ${((timeline.value * rule.shareValue) / 100).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Sharing Rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Timeline</label>
                  <Select value={selectedTargetTimeline} onValueChange={setSelectedTargetTimeline}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline to share with" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimelines.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          <div className="flex items-center gap-2">
                            <span>{t.type === 'project' ? '🚀' : t.type === 'contact' ? '👤' : '💰'}</span>
                            <span>{t.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sharing Type</label>
                  <Select value={shareType} onValueChange={(value: any) => setShareType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Share</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="milestone">Milestone Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Share Value {shareType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <Input
                    type="number"
                    placeholder={shareType === 'percentage' ? '20' : '5000'}
                    value={shareValue}
                    onChange={(e) => setShareValue(e.target.value)}
                    min="0"
                    max={shareType === 'percentage' ? '100' : undefined}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trigger Condition</label>
                  <Input
                    placeholder="e.g., ROI > 15%, Revenue > $50K"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe when and why this sharing occurs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Preview */}
              {shareValue && condition && (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-medium mb-2 text-accent">Rule Preview</h4>
                  <p className="text-sm">
                    When <strong>{condition}</strong>, automatically share{' '}
                    <strong>
                      {shareType === 'percentage' ? `${shareValue}%` : `$${parseFloat(shareValue).toLocaleString()}`}
                    </strong>{' '}
                    of outcomes with the selected timeline.
                  </p>
                </div>
              )}

              <Button onClick={handleCreateRule} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Sharing Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Outcome Sharing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOutcomes.map((outcome) => (
                  <div key={outcome.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{outcome.description}</h4>
                        <div className="text-sm text-muted-foreground">
                          {new Date(outcome.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-success">
                          ${outcome.value.toLocaleString()}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {outcome.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Shared with:</div>
                      {outcome.sharedWith.map((sharedTimeline, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span>{sharedTimeline}</span>
                          <Badge variant="secondary" className="text-xs">
                            ${(outcome.value * 0.2).toLocaleString()} (20%)
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};