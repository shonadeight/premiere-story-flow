import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft, 
  ArrowRight, 
  DollarSign, 
  FileText, 
  Users,
  Brain,
  Network,
  Building,
  MessageSquare,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Settings
} from 'lucide-react';
import { Timeline, ContributionType } from '@/types/timeline';

interface ContributionFlowProps {
  targetTimeline: Timeline;
  onComplete: (contributionData: any) => void;
  onCancel: () => void;
}

export const ContributionFlow: React.FC<ContributionFlowProps> = ({
  targetTimeline,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<any>({
    contributionType: '',
    subtype: '',
    amount: '',
    units: '',
    description: '',
    attachments: [],
    valuationPreference: 'accept-default',
    customValuation: '',
    negotiationNotes: '',
    acceptTerms: false,
    kycCompleted: false,
    expectedOutcome: '',
    lockInPeriod: '',
    useParentConfig: true,
    overrideConfig: {},
    // Expected outcomes configuration
    toGiveOutcomes: [],
    toReceiveOutcomes: [],
    customToGive: [],
    customToReceive: []
  });

  const contributionTypes = [
    {
      id: 'financial',
      name: 'Financial Contribution',
      icon: DollarSign,
      subtypes: [
        { id: 'cash', name: 'Cash Investment', description: 'One-time cash contribution' },
        { id: 'crypto', name: 'Cryptocurrency', description: 'Digital currency investment' },
        { id: 'debt', name: 'Debt/Loan', description: 'Loan with repayment terms' },
        { id: 'pledge', name: 'Pledge', description: 'Commitment to future payment' },
        { id: 'equity', name: 'Equity Purchase', description: 'Buy ownership stake' }
      ]
    },
    {
      id: 'intellectual',
      name: 'Intellectual Contribution',
      icon: Brain,
      subtypes: [
        { id: 'consulting', name: 'Consulting Hours', description: 'Professional advisory services' },
        { id: 'deliverable', name: 'Deliverable', description: 'Specific work output' },
        { id: 'ip', name: 'Intellectual Property', description: 'Patents, designs, licenses' },
        { id: 'training', name: 'Training Material', description: 'Educational content' }
      ]
    },
    {
      id: 'network',
      name: 'Network & Marketing',
      icon: Network,
      subtypes: [
        { id: 'referrals', name: 'Referrals', description: 'Customer/partner introductions' },
        { id: 'campaign', name: 'Marketing Campaign', description: 'Promotional activities' },
        { id: 'event', name: 'Event Hosting', description: 'Organize networking events' },
        { id: 'content', name: 'Content Creation', description: 'Social media, articles' }
      ]
    },
    {
      id: 'assets',
      name: 'Assets Contribution',
      icon: Building,
      subtypes: [
        { id: 'real-estate', name: 'Real Estate', description: 'Land, buildings, property' },
        { id: 'equipment', name: 'Equipment', description: 'Machinery, tools, devices' },
        { id: 'vehicles', name: 'Vehicles', description: 'Cars, trucks, aircraft' },
        { id: 'digital', name: 'Digital Assets', description: 'Software, domains, NFTs' }
      ]
    },
    {
      id: 'followup',
      name: 'Follow-up Services',
      icon: MessageSquare,
      subtypes: [
        { id: 'onboarding', name: 'Onboarding Support', description: 'Help new users get started' },
        { id: 'maintenance', name: 'Maintenance', description: 'Ongoing system upkeep' },
        { id: 'support', name: 'Customer Support', description: 'Help desk services' },
        { id: 'monitoring', name: 'Monitoring', description: 'Performance tracking' }
      ]
    },
    {
      id: 'timeline',
      name: 'Timeline Investment',
      icon: FileText,
      subtypes: [
        { id: 'full-timeline', name: 'Full Timeline', description: 'Invest entire timeline value' },
        { id: 'partial-timeline', name: 'Partial Timeline', description: 'Invest portion of timeline' },
        { id: 'timeline-merger', name: 'Timeline Merger', description: 'Merge two timelines' }
      ]
    }
  ];

  const steps = [
    { id: 1, title: 'Review Timeline', description: 'Understand target timeline' },
    { id: 2, title: 'Choose Type', description: 'Select contribution type' },
    { id: 3, title: 'Expected Outcomes', description: 'Configure what you give/receive' },
    { id: 4, title: 'Configure', description: 'Set amount and details' },
    { id: 5, title: 'Valuation', description: 'Agree on value terms' },
    { id: 6, title: 'Legal Terms', description: 'Accept agreements' },
    { id: 7, title: 'Submit', description: 'Complete contribution' }
  ];

  const selectedType = contributionTypes.find(t => t.id === formData.contributionType);
  const selectedSubtype = selectedType?.subtypes.find(s => s.id === formData.subtype);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete({
      ...formData,
      targetTimelineId: targetTimeline.id,
      submittedAt: new Date().toISOString()
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true;
      case 2: return formData.contributionType && formData.subtype;
      case 3: return true; // Expected outcomes step is optional
      case 4: return formData.amount || formData.description;
      case 5: return formData.valuationPreference;
      case 6: return formData.acceptTerms;
      case 7: return true;
      default: return false;
    }
  };

  // Predefined outcome options
  const predefinedOutcomes = {
    toGive: [
      { id: 'funding', label: 'Financial Support' },
      { id: 'expertise', label: 'Technical Expertise' },
      { id: 'network', label: 'Network Connections' },
      { id: 'mentorship', label: 'Mentorship' },
      { id: 'resources', label: 'Physical Resources' },
      { id: 'time', label: 'Time Commitment' },
      { id: 'promotion', label: 'Marketing/Promotion' },
      { id: 'custom', label: 'Custom Option' }
    ],
    toReceive: [
      { id: 'roi', label: 'Return on Investment' },
      { id: 'equity', label: 'Equity Stake' },
      { id: 'revenue-share', label: 'Revenue Share' },
      { id: 'access', label: 'Early Access' },
      { id: 'recognition', label: 'Public Recognition' },
      { id: 'learning', label: 'Learning Opportunity' },
      { id: 'network-growth', label: 'Network Growth' },
      { id: 'custom', label: 'Custom Option' }
    ]
  };

  const handleOutcomeToggle = (type: 'toGive' | 'toReceive', outcomeId: string) => {
    const fieldName = type === 'toGive' ? 'toGiveOutcomes' : 'toReceiveOutcomes';
    const currentOutcomes = formData[fieldName] || [];
    
    if (currentOutcomes.includes(outcomeId)) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: currentOutcomes.filter((id: string) => id !== outcomeId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...currentOutcomes, outcomeId]
      }));
    }
  };

  const handleCustomOutcomeAdd = (type: 'toGive' | 'toReceive', customText: string) => {
    if (!customText.trim()) return;
    
    const fieldName = type === 'toGive' ? 'customToGive' : 'customToReceive';
    const currentCustom = formData[fieldName] || [];
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...currentCustom, customText.trim()]
    }));
  };

  const handleCustomOutcomeRemove = (type: 'toGive' | 'toReceive', index: number) => {
    const fieldName = type === 'toGive' ? 'customToGive' : 'customToReceive';
    const currentCustom = formData[fieldName] || [];
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: currentCustom.filter((_: any, i: number) => i !== index)
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-card/50">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="touch-manipulation p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Contribute</h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {targetTimeline.title}
        </Badge>
      </div>

      {/* Progress */}
      <div className="p-3 border-b">
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {steps[currentStep - 1]?.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {/* Step 1: Review Timeline */}
          {currentStep === 1 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Timeline Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{targetTimeline.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {targetTimeline.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-primary">
                        ${targetTimeline.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Current Value</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-green-600">
                        +{targetTimeline.changePercent}%
                      </div>
                      <div className="text-xs text-muted-foreground">Growth</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Accepted Contribution Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {contributionTypes.map(type => (
                      <Badge key={type.id} variant="secondary" className="text-xs">
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Outcome Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Contributors receive pro-rata share of outcomes based on contribution value. 
                    Payouts triggered by milestone completion and verified results.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Choose Type */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Select Contribution Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {contributionTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <Card 
                          key={type.id}
                          className={`cursor-pointer transition-all touch-manipulation ${
                            formData.contributionType === type.id 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            contributionType: type.id,
                            subtype: '' 
                          }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-primary" />
                              <div>
                                <h3 className="font-medium">{type.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {type.subtypes.length} options available
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Subtypes */}
              {selectedType && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Choose Specific Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedType.subtypes.map(subtype => (
                        <Card 
                          key={subtype.id}
                          className={`cursor-pointer transition-all touch-manipulation ${
                            formData.subtype === subtype.id 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            subtype: subtype.id 
                          }))}
                        >
                          <CardContent className="p-3">
                            <h4 className="font-medium">{subtype.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {subtype.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Expected Outcomes */}
          {currentStep === 3 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Configure Expected Outcomes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Define what you will give and what you expect to receive from this contribution.
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="to-give" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="to-give">To Give</TabsTrigger>
                    <TabsTrigger value="to-receive">To Receive</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="to-give" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">What will you contribute?</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {predefinedOutcomes.toGive.map(outcome => (
                          <div key={outcome.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`give-${outcome.id}`}
                              checked={formData.toGiveOutcomes?.includes(outcome.id) || false}
                              onCheckedChange={() => handleOutcomeToggle('toGive', outcome.id)}
                            />
                            <Label htmlFor={`give-${outcome.id}`} className="text-sm">
                              {outcome.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {/* Custom outcomes for To Give */}
                      {formData.toGiveOutcomes?.includes('custom') && (
                        <div className="mt-4 space-y-3">
                          <Label className="text-sm font-medium">Custom contributions:</Label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Describe your custom contribution..."
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const target = e.target as HTMLInputElement;
                                    handleCustomOutcomeAdd('toGive', target.value);
                                    target.value = '';
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                                  if (input) {
                                    handleCustomOutcomeAdd('toGive', input.value);
                                    input.value = '';
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                            
                            {/* Display added custom outcomes */}
                            {formData.customToGive?.map((custom: string, index: number) => (
                              <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                                <span className="text-sm">{custom}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCustomOutcomeRemove('toGive', index)}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="to-receive" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">What do you expect to receive?</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {predefinedOutcomes.toReceive.map(outcome => (
                          <div key={outcome.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`receive-${outcome.id}`}
                              checked={formData.toReceiveOutcomes?.includes(outcome.id) || false}
                              onCheckedChange={() => handleOutcomeToggle('toReceive', outcome.id)}
                            />
                            <Label htmlFor={`receive-${outcome.id}`} className="text-sm">
                              {outcome.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {/* Custom outcomes for To Receive */}
                      {formData.toReceiveOutcomes?.includes('custom') && (
                        <div className="mt-4 space-y-3">
                          <Label className="text-sm font-medium">Custom expectations:</Label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Describe what you want to gain..."
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const target = e.target as HTMLInputElement;
                                    handleCustomOutcomeAdd('toReceive', target.value);
                                    target.value = '';
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                                  if (input) {
                                    handleCustomOutcomeAdd('toReceive', input.value);
                                    input.value = '';
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                            
                            {/* Display added custom outcomes */}
                            {formData.customToReceive?.map((custom: string, index: number) => (
                              <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                                <span className="text-sm">{custom}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCustomOutcomeRemove('toReceive', index)}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Configure */}
          {currentStep === 4 && selectedSubtype && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Configure Contribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount/Value</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount or estimated value"
                    className="touch-manipulation"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your contribution in detail..."
                    className="touch-manipulation min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Configuration Settings</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Use Parent Timeline Configuration</p>
                      <p className="text-xs text-muted-foreground">
                        Inherit valuation and tracking rules from parent timeline
                      </p>
                    </div>
                    <Switch
                      checked={formData.useParentConfig}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, useParentConfig: checked }))
                      }
                    />
                  </div>
                </div>

                {!formData.useParentConfig && (
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="h-4 w-4 text-orange-600" />
                        <p className="text-sm font-medium text-orange-800">Custom Configuration</p>
                      </div>
                      <p className="text-xs text-orange-700">
                        You can override parent settings for valuation method, tracking requirements, 
                        and outcome sharing rules specific to this contribution.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <Label>Attach Supporting Documents</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload receipts, contracts, photos, or other proof
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 touch-manipulation">
                      Choose Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Valuation */}
          {currentStep === 5 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Valuation & Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Valuation Preference</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      {
                        id: 'accept-default',
                        title: 'Accept Default Valuation',
                        description: 'Use timeline\'s standard valuation method'
                      },
                      {
                        id: 'negotiate',
                        title: 'Negotiate Terms',
                        description: 'Propose custom valuation and terms'
                      },
                      {
                        id: 'market-rate',
                        title: 'Market Rate',
                        description: 'Use current market valuation'
                      }
                    ].map(option => (
                      <Card 
                        key={option.id}
                        className={`cursor-pointer transition-all touch-manipulation ${
                          formData.valuationPreference === option.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          valuationPreference: option.id 
                        }))}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium">{option.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {formData.valuationPreference === 'negotiate' && (
                  <div>
                    <Label htmlFor="negotiationNotes">Negotiation Notes</Label>
                    <Textarea
                      id="negotiationNotes"
                      value={formData.negotiationNotes}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        negotiationNotes: e.target.value 
                      }))}
                      placeholder="Explain your proposed terms..."
                      className="touch-manipulation"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="expectedOutcome">Expected Outcome</Label>
                  <Select
                    value={formData.expectedOutcome}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      expectedOutcome: value 
                    }))}
                  >
                    <SelectTrigger className="touch-manipulation">
                      <SelectValue placeholder="What do you expect in return?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profit-share">Profit Share</SelectItem>
                      <SelectItem value="equity">Equity Stake</SelectItem>
                      <SelectItem value="royalties">Royalties</SelectItem>
                      <SelectItem value="credits">Platform Credits</SelectItem>
                      <SelectItem value="access">Special Access</SelectItem>
                      <SelectItem value="recognition">Recognition/Badges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Legal Terms */}
          {currentStep === 6 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Legal Terms & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, acceptTerms: checked }))
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="terms" className="text-sm font-medium">
                        I accept the contribution terms and conditions
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By checking this box, you agree to the timeline's contribution terms, 
                        outcome sharing rules, and dispute resolution process.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="kyc"
                      checked={formData.kycCompleted}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, kycCompleted: checked }))
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="kyc" className="text-sm font-medium">
                        KYC verification completed (if required)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        For contributions above $1,000, identity verification may be required.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Contribution Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{selectedSubtype?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>{formData.amount || 'To be valued'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Return:</span>
                      <span>{formData.expectedOutcome || 'Default terms'}</span>
                    </div>
                    
                    {/* Show selected outcomes */}
                    {(formData.toGiveOutcomes?.length > 0 || formData.customToGive?.length > 0) && (
                      <div className="pt-2 border-t">
                        <span className="font-medium">To Give:</span>
                        <div className="mt-1">
                          {formData.toGiveOutcomes?.filter((id: string) => id !== 'custom').map((id: string) => (
                            <Badge key={id} variant="secondary" className="mr-1 mb-1 text-xs">
                              {predefinedOutcomes.toGive.find(o => o.id === id)?.label}
                            </Badge>
                          ))}
                          {formData.customToGive?.map((custom: string, index: number) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                              {custom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(formData.toReceiveOutcomes?.length > 0 || formData.customToReceive?.length > 0) && (
                      <div className="pt-2 border-t">
                        <span className="font-medium">To Receive:</span>
                        <div className="mt-1">
                          {formData.toReceiveOutcomes?.filter((id: string) => id !== 'custom').map((id: string) => (
                            <Badge key={id} variant="secondary" className="mr-1 mb-1 text-xs">
                              {predefinedOutcomes.toReceive.find(o => o.id === id)?.label}
                            </Badge>
                          ))}
                          {formData.customToReceive?.map((custom: string, index: number) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                              {custom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Submit */}
          {currentStep === 7 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Ready to Submit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">
                    Your contribution is ready for submission
                  </h4>
                  <p className="text-sm text-green-700">
                    Once submitted, your contribution will be recorded and the timeline 
                    owner will be notified for verification. You'll receive confirmation 
                    and tracking details.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Next Steps:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Contribution logged in timeline ledger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Verification process initiated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Contribution Units (CUs) issued upon approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Subtimeline created (if configured)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t bg-card/50">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="touch-manipulation"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="touch-manipulation"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="touch-manipulation"
          >
            Submit Contribution
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};