import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Users, 
  Brain,
  TrendingUp,
  Settings,
  Target
} from 'lucide-react';

interface CapitalFlowRule {
  id: string;
  type: 'financial' | 'network' | 'intellectual';
  direction: 'inbound' | 'outbound';
  percentage: number;
  condition: string;
  targetTimeline: string;
  status: 'active' | 'pending' | 'completed';
}

export const CapitalFlow = () => {
  const [newRule, setNewRule] = useState<Partial<CapitalFlowRule>>({});
  const [activeRules] = useState<CapitalFlowRule[]>([
    {
      id: '1',
      type: 'financial',
      direction: 'outbound',
      percentage: 20,
      condition: 'ROI > 15%',
      targetTimeline: 'Parent Timeline A',
      status: 'active'
    },
    {
      id: '2',
      type: 'network',
      direction: 'inbound',
      percentage: 10,
      condition: 'New connections > 5',
      targetTimeline: 'AI SaaS Platform',
      status: 'active'
    },
    {
      id: '3',
      type: 'intellectual',
      direction: 'outbound',
      percentage: 15,
      condition: 'Milestone completion',
      targetTimeline: 'Research Timeline B',
      status: 'pending'
    }
  ]);

  const [recentFlows] = useState([
    {
      id: '1',
      type: 'financial',
      amount: 2500,
      from: 'AI SaaS Platform',
      to: 'Parent Timeline A',
      date: '2024-07-28',
      status: 'completed'
    },
    {
      id: '2',
      type: 'network',
      amount: 450,
      from: 'Sarah Chen Partnership',
      to: 'Current Timeline',
      date: '2024-07-25',
      status: 'completed'
    },
    {
      id: '3',
      type: 'intellectual',
      amount: 1200,
      from: 'Current Timeline',
      to: 'AI Model Training',
      date: '2024-07-22',
      status: 'pending'
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCapitalIcon = (type: string) => {
    switch (type) {
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'network': return <Users className="h-4 w-4" />;
      case 'intellectual': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Capital Flow Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rules" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rules">Flow Rules</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="create">Create Rule</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="space-y-4">
              {activeRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      rule.direction === 'inbound' ? 'bg-success/10' : 'bg-primary/10'
                    }`}>
                      {rule.direction === 'inbound' ? (
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getCapitalIcon(rule.type)}
                        <span className="font-medium capitalize">{rule.type} Capital</span>
                        <Badge variant="outline" className="text-xs">
                          {rule.percentage}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rule.condition} → {rule.targetTimeline}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                      {rule.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              {recentFlows.map((flow) => (
                <div key={flow.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                      {getCapitalIcon(flow.type)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {formatCurrency(flow.amount)} {flow.type} capital
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flow.from} → {flow.to}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(flow.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={flow.status === 'completed' ? 'default' : 'secondary'}>
                    {flow.status}
                  </Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Capital Type</Label>
                  <Select onValueChange={(value) => setNewRule({...newRule, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select capital type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial Capital</SelectItem>
                      <SelectItem value="network">Network Capital</SelectItem>
                      <SelectItem value="intellectual">Intellectual Capital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Flow Direction</Label>
                  <Select onValueChange={(value) => setNewRule({...newRule, direction: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inbound">Inbound (To this timeline)</SelectItem>
                      <SelectItem value="outbound">Outbound (From this timeline)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Percentage (%)</Label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 20"
                    onChange={(e) => setNewRule({...newRule, percentage: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Timeline</Label>
                  <Select onValueChange={(value) => setNewRule({...newRule, targetTimeline: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent-a">Parent Timeline A</SelectItem>
                      <SelectItem value="ai-saas">AI SaaS Platform</SelectItem>
                      <SelectItem value="research-b">Research Timeline B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Trigger Condition</Label>
                  <Input 
                    placeholder="e.g. ROI > 15%, Milestone completion, New connections > 5"
                    onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                  />
                </div>
              </div>
              
              <Button className="w-full">
                Create Capital Flow Rule
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};