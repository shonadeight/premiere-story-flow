import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockTimelines } from '@/data/mockData';
import { Timeline } from '@/types/timeline';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  DollarSign, 
  Brain, 
  Network, 
  Building,
  Link,
  Upload,
  Eye,
  Settings,
  Users,
  CreditCard,
  FileText,
  BarChart,
  Gift,
  Target,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface ContributionData {
  timeline: Timeline | null;
  accessGranted: boolean;
  expectedOutcomes: {
    toGive: string[];
    toReceive: string[];
    customToGive: string[];
    customToReceive: string[];
  };
  contributionTypes: {
    financial: { enabled: boolean; subtypes: any[]; },
    intellectual: { enabled: boolean; subtypes: any[]; },
    network: { enabled: boolean; subtypes: any[]; },
    asset: { enabled: boolean; subtypes: any[]; }
  };
  linkedTimelines: any[];
  customInputs: any;
  attachments: any[];
  presentationTemplate: string;
  subContributions: {
    enabled: boolean;
    config: any;
  };
}

export function ShonaCoinContribution() {
  const { timelineId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ContributionData>({
    timeline: null,
    accessGranted: false,
    expectedOutcomes: { 
      toGive: [], 
      toReceive: [], 
      customToGive: [], 
      customToReceive: [] 
    },
    contributionTypes: {
      financial: { enabled: false, subtypes: [] },
      intellectual: { enabled: false, subtypes: [] },
      network: { enabled: false, subtypes: [] },
      asset: { enabled: false, subtypes: [] }
    },
    linkedTimelines: [],
    customInputs: {},
    attachments: [],
    presentationTemplate: 'table',
    subContributions: { enabled: false, config: {} }
  });

  const [showTypeConfig, setShowTypeConfig] = useState<string | null>(null);
  const [newCustomOutcome, setNewCustomOutcome] = useState({ toGive: '', toReceive: '' });

  useEffect(() => {
    // Load timeline data
    const timeline = mockTimelines.find(t => t.id === timelineId);
    if (timeline) {
      setData(prev => ({ ...prev, timeline }));
      // For demo, assume access is granted
      setData(prev => ({ ...prev, accessGranted: true }));
    }
  }, [timelineId]);

  const steps = [
    { id: 1, title: 'Access Check', icon: Users },
    { id: 2, title: 'Expected Outcomes', icon: Target },
    { id: 3, title: 'Contribution Types', icon: Gift },
    { id: 4, title: 'Link Timelines', icon: Link },
    { id: 5, title: 'Custom Inputs', icon: FileText },
    { id: 6, title: 'Attachments', icon: Upload },
    { id: 7, title: 'Presentation', icon: BarChart },
    { id: 8, title: 'Sub-Contributions', icon: Settings },
    { id: 9, title: 'Review & Submit', icon: Check }
  ];

  const outcomeOptions = [
    'Equity share', 'Profit share', 'Revenue share', 'Milestones',
    'Traffic', 'Downloads', 'Impressions', 'Leads', 'Usage rights',
    'Asset appreciation', 'Custom option'
  ];

  const financialSubtypes = [
    { id: 'cash', name: 'Cash', description: 'Direct cash contribution' },
    { id: 'debt', name: 'Debt', description: 'Loan with repayment terms' },
    { id: 'pledge', name: 'Pledge', description: 'Commitment to future payment' }
  ];

  const intellectualSubtypes = [
    { id: 'ideas', name: 'Ideas', description: 'Creative concepts and strategies' },
    { id: 'research', name: 'Research', description: 'Market research and analysis' },
    { id: 'code', name: 'Code', description: 'Software development' },
    { id: 'consultations', name: 'Consultations', description: 'Expert advisory services' },
    { id: 'custom', name: 'Custom', description: 'Other intellectual contributions' }
  ];

  const networkSubtypes = [
    { id: 'referrals', name: 'Referrals', description: 'Customer referrals' },
    { id: 'leads', name: 'Leads', description: 'Sales leads generation' },
    { id: 'traffic', name: 'Traffic', description: 'Website/app traffic' },
    { id: 'likes', name: 'Likes', description: 'Social media engagement' },
    { id: 'comments', name: 'Comments', description: 'User engagement' },
    { id: 'downloads', name: 'Downloads', description: 'App/content downloads' },
    { id: 'custom', name: 'Custom', description: 'Other network contributions' }
  ];

  const assetSubtypes = [
    { id: 'equipment', name: 'Equipment', description: 'Machinery and tools' },
    { id: 'property', name: 'Property', description: 'Real estate and land' },
    { id: 'software', name: 'Software Usage', description: 'Software licenses' },
    { id: 'digital', name: 'Digital Assets', description: 'Digital properties' },
    { id: 'office', name: 'Office Space', description: 'Physical workspace' },
    { id: 'land', name: 'Land', description: 'Land and property' },
    { id: 'tools', name: 'Tools', description: 'Professional tools' },
    { id: 'custom', name: 'Custom', description: 'Other asset contributions' }
  ];

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOutcomeToggle = (outcome: string, type: 'toGive' | 'toReceive') => {
    setData(prev => ({
      ...prev,
      expectedOutcomes: {
        ...prev.expectedOutcomes,
        [type]: prev.expectedOutcomes[type].includes(outcome)
          ? prev.expectedOutcomes[type].filter(o => o !== outcome)
          : [...prev.expectedOutcomes[type], outcome]
      }
    }));
  };

  const handleAddCustomOutcome = (type: 'toGive' | 'toReceive') => {
    const value = newCustomOutcome[type].trim();
    if (value) {
      const customKey = type === 'toGive' ? 'customToGive' : 'customToReceive';
      setData(prev => ({
        ...prev,
        expectedOutcomes: {
          ...prev.expectedOutcomes,
          [customKey]: [...prev.expectedOutcomes[customKey], value]
        }
      }));
      setNewCustomOutcome(prev => ({ ...prev, [type]: '' }));
    }
  };

  const handleRemoveCustomOutcome = (index: number, type: 'toGive' | 'toReceive') => {
    const customKey = type === 'toGive' ? 'customToGive' : 'customToReceive';
    setData(prev => ({
      ...prev,
      expectedOutcomes: {
        ...prev.expectedOutcomes,
        [customKey]: prev.expectedOutcomes[customKey].filter((_, i) => i !== index)
      }
    }));
  };

  const handleContributionTypeToggle = (type: keyof typeof data.contributionTypes) => {
    setData(prev => ({
      ...prev,
      contributionTypes: {
        ...prev.contributionTypes,
        [type]: {
          ...prev.contributionTypes[type],
          enabled: !prev.contributionTypes[type].enabled
        }
      }
    }));
  };

  const handleSubmit = () => {
    toast.success('Contribution submitted successfully!');
    navigate(`/timeline/${timelineId}`);
  };

  const renderTypeConfigModal = (type: string, subtypes: any[]) => {
    const ConfigContent = (
      <div className="space-y-4">
        <div className="grid gap-3">
          {subtypes.map(subtype => (
            <Card key={subtype.id} className="cursor-pointer hover:bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{subtype.name}</h4>
                    <p className="text-sm text-muted-foreground">{subtype.description}</p>
                  </div>
                  <Checkbox />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-3">
          <div>
            <Label>Value/Amount</Label>
            <Input placeholder="Enter value" />
          </div>
          <div>
            <Label>Valuation Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Value</SelectItem>
                <SelectItem value="negotiable">Negotiable</SelectItem>
                <SelectItem value="formula">Custom Formula</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Additional Notes</Label>
            <Textarea placeholder="Any additional details..." />
          </div>
        </div>
      </div>
    );

    if (isMobile) {
      return (
        <Drawer open={showTypeConfig === type} onOpenChange={() => setShowTypeConfig(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Configure {type} Contribution</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              {ConfigContent}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return showTypeConfig === type ? (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
          <CardHeader>
            <CardTitle>Configure {type} Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              {ConfigContent}
            </ScrollArea>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setShowTypeConfig(null)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setShowTypeConfig(null)} className="flex-1">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    ) : null;
  };

  if (!data.timeline) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">ShonaCoin Contribution</h1>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 9</p>
          </div>
        </div>
        <Badge variant="outline">{data.timeline.title}</Badge>
      </div>

      {/* Progress */}
      <div className="p-4 border-b">
        <Progress value={(currentStep / 9) * 100} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{steps[currentStep - 1]?.title}</span>
          <span>{Math.round((currentStep / 9) * 100)}%</span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {/* Step 1: Access Check */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Timeline Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-medium text-green-800">Access Granted</h3>
                    <p className="text-sm text-green-600">You have permission to contribute to this timeline</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">{data.timeline.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{data.timeline.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold">${data.timeline.value.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Current Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">+{data.timeline.changePercent}%</div>
                        <div className="text-xs text-muted-foreground">Growth</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Expected Outcomes */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Configure Expected Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="toGive">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="toGive">To Give</TabsTrigger>
                  <TabsTrigger value="toReceive">To Receive</TabsTrigger>
                </TabsList>
                
                <TabsContent value="toGive" className="space-y-3">
                  <p className="text-sm text-muted-foreground">Select what you plan to contribute:</p>
                  <div className="grid gap-2">
                    {outcomeOptions.map(outcome => (
                      <div key={outcome} className="flex items-center space-x-2">
                        <Checkbox
                          checked={data.expectedOutcomes.toGive.includes(outcome)}
                          onCheckedChange={() => handleOutcomeToggle(outcome, 'toGive')}
                        />
                        <label className="text-sm">{outcome}</label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Outcomes Section */}
                  {data.expectedOutcomes.toGive.includes('Custom option') && (
                    <div className="mt-4 p-3 border rounded-lg bg-muted/30">
                      <Label className="text-sm font-medium">Custom Outcomes to Give</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g., Brand visibility in local market"
                            value={newCustomOutcome.toGive}
                            onChange={(e) => setNewCustomOutcome(prev => ({ ...prev, toGive: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomOutcome('toGive')}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleAddCustomOutcome('toGive')}
                            disabled={!newCustomOutcome.toGive.trim()}
                          >
                            Add
                          </Button>
                        </div>
                        {data.expectedOutcomes.customToGive.map((custom, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                            <span className="text-sm">{custom}</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleRemoveCustomOutcome(index, 'toGive')}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="toReceive" className="space-y-3">
                  <p className="text-sm text-muted-foreground">Select what you expect to receive:</p>
                  <div className="grid gap-2">
                    {outcomeOptions.map(outcome => (
                      <div key={outcome} className="flex items-center space-x-2">
                        <Checkbox
                          checked={data.expectedOutcomes.toReceive.includes(outcome)}
                          onCheckedChange={() => handleOutcomeToggle(outcome, 'toReceive')}
                        />
                        <label className="text-sm">{outcome}</label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Outcomes Section */}
                  {data.expectedOutcomes.toReceive.includes('Custom option') && (
                    <div className="mt-4 p-3 border rounded-lg bg-muted/30">
                      <Label className="text-sm font-medium">Custom Outcomes to Receive</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g., Beta testing feedback, Access to mentorship"
                            value={newCustomOutcome.toReceive}
                            onChange={(e) => setNewCustomOutcome(prev => ({ ...prev, toReceive: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomOutcome('toReceive')}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleAddCustomOutcome('toReceive')}
                            disabled={!newCustomOutcome.toReceive.trim()}
                          >
                            Add
                          </Button>
                        </div>
                        {data.expectedOutcomes.customToReceive.map((custom, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                            <span className="text-sm">{custom}</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleRemoveCustomOutcome(index, 'toReceive')}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Contribution Types */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Select Contribution Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'financial', name: 'Financial', icon: DollarSign, subtypes: financialSubtypes },
                  { key: 'intellectual', name: 'Intellectual', icon: Brain, subtypes: intellectualSubtypes },
                  { key: 'network', name: 'Network/Marketing', icon: Network, subtypes: networkSubtypes },
                  { key: 'asset', name: 'Asset', icon: Building, subtypes: assetSubtypes }
                ].map(({ key, name, icon: Icon, subtypes }) => (
                  <Card key={key} className={`cursor-pointer transition-all ${
                    data.contributionTypes[key as keyof typeof data.contributionTypes].enabled 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">{name}</h3>
                            <p className="text-sm text-muted-foreground">{subtypes.length} options</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={data.contributionTypes[key as keyof typeof data.contributionTypes].enabled}
                            onCheckedChange={() => handleContributionTypeToggle(key as keyof typeof data.contributionTypes)}
                          />
                          {data.contributionTypes[key as keyof typeof data.contributionTypes].enabled && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setShowTypeConfig(key)}
                            >
                              Configure
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Link Timelines */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Link/Merge Timelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect other timelines from your portfolio to this contribution
              </p>
              
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Link className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">
                  Search and select timelines to link
                </p>
                <Button variant="outline">Browse Portfolio</Button>
              </div>

              <div className="space-y-2">
                <Label>Auto-update Valuation</Label>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-sm">Update contribution value based on linked timeline performance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Custom Inputs */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Capture Custom Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input placeholder="Contribution title" />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Detailed description of your contribution" />
              </div>
              
              <div>
                <Label>Context</Label>
                <Textarea placeholder="Additional context or background information" />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Brain className="h-4 w-4 mr-1" />
                  AI Generate
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Import Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Attachments */}
        {currentStep === 6 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Capture Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium mb-2">Upload Files</h3>
                  <p className="text-sm text-muted-foreground">
                    Documents, images, audio, video files supported
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    Documents
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Audio/Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Presentation Template */}
        {currentStep === 7 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Contribution Presentation Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose how your contribution will be displayed
              </p>
              
              <div className="grid gap-3">
                {[
                  { id: 'table', name: 'Table View', description: 'Structured data in table format' },
                  { id: 'list', name: 'List View', description: 'Simple list with details' },
                  { id: 'cards', name: 'Card View', description: 'Visual cards with summaries' },
                  { id: 'post', name: 'Post Style', description: 'Social media post format' },
                  { id: 'trading', name: 'Trading View', description: 'Financial trading interface' },
                  { id: 'contact', name: 'Contact Card', description: 'Business card style' }
                ].map(template => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      data.presentationTemplate === template.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setData(prev => ({ ...prev, presentationTemplate: template.id }))}
                  >
                    <CardContent className="p-3">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                AI Generate Template
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 8: Sub-Contributions */}
        {currentStep === 8 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configure Sub-Contributions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Enable Sub-Timelines</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow child contributions under this contribution
                  </p>
                </div>
                <Switch 
                  checked={data.subContributions.enabled}
                  onCheckedChange={(checked) => 
                    setData(prev => ({ 
                      ...prev, 
                      subContributions: { ...prev.subContributions, enabled: checked }
                    }))
                  }
                />
              </div>

              {data.subContributions.enabled && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                  <h4 className="font-medium">Sub-Timeline Configuration</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Contribution types</span>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Outcome-sharing rules</span>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Valuation strategy</span>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Access levels</span>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 9: Review & Submit */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Review & Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Contribution Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Target Timeline:</span>
                      <span className="font-medium">{data.timeline.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contribution Types:</span>
                      <span className="font-medium">
                        {Object.entries(data.contributionTypes)
                          .filter(([_, config]) => config.enabled)
                          .map(([type]) => type)
                          .join(', ') || 'None selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Outcomes:</span>
                      <span className="font-medium">
                        {data.expectedOutcomes.toReceive.length + data.expectedOutcomes.toGive.length} selected
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save Draft
                  </Button>
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Submit Contribution
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>

      {/* Navigation */}
      <div className="flex justify-between p-4 border-t">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNext} 
          disabled={currentStep === 9}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Type Configuration Modals */}
      {renderTypeConfigModal('financial', financialSubtypes)}
      {renderTypeConfigModal('intellectual', intellectualSubtypes)}
      {renderTypeConfigModal('network', networkSubtypes)}
      {renderTypeConfigModal('asset', assetSubtypes)}
    </div>
  );
}