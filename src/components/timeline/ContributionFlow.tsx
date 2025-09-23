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
  Settings,
  Search,
  Link
} from 'lucide-react';
import { Timeline, ContributionType } from '@/types/timeline';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';

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
    // Expected outcomes configuration - New structured format
    outcomes: {
      toGive: [],
      toReceive: []
    },
    // Linked timelines for Step 4
    linkedTimelines: []
  });

  // State for Step 2 Expected Outcomes - now directly embedded in step
  const [activeTab, setActiveTab] = useState<'toGive' | 'toReceive'>('toGive');
  const [customInput, setCustomInput] = useState({ toGive: '', toReceive: '' });
  const [tempOutcomes, setTempOutcomes] = useState({
    toGive: [],
    toReceive: []
  });

  // State for Step 4 Link/Merge Timelines
  const [showLinkTimelinesModal, setShowLinkTimelinesModal] = useState(false);
  const [timelineSearch, setTimelineSearch] = useState('');
  const [selectedTimelines, setSelectedTimelines] = useState<string[]>([]);
  const [timelineAllocations, setTimelineAllocations] = useState<{[key: string]: string}>({});

  // Initialize temp outcomes with saved data on mount and when switching to step 2
  useEffect(() => {
    if (currentStep === 2) {
      setTempOutcomes({
        toGive: [...(formData.outcomes.toGive || [])],
        toReceive: [...(formData.outcomes.toReceive || [])]
      });
    }
  }, [currentStep, formData.outcomes]);

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
    { id: 2, title: 'Expected Outcomes', description: 'Configure what you give/receive' },
    { id: 3, title: 'Choose Type', description: 'Select contribution type' },
    { id: 4, title: 'Link Timelines', description: 'Connect related timelines' },
    { id: 5, title: 'Configure Details', description: 'Set amount and specifics' },
    { id: 6, title: 'Valuation', description: 'Agree on value terms' },
    { id: 7, title: 'Legal Terms', description: 'Accept agreements' },
    { id: 8, title: 'Submit', description: 'Complete contribution' }
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
      case 2: return true; // Expected outcomes step is optional  
      case 3: return formData.contributionType && formData.subtype;
      case 4: return true; // Link timelines step is optional
      case 5: return formData.amount || formData.description;
      case 6: return formData.valuationPreference;
      case 7: return formData.acceptTerms;
      case 8: return true;
      default: return false;
    }
  };

  // Categorized outcome options for the new Step 2
  const outcomeCategories = [
    {
      category: "Financial / Business",
      options: [
        { id: 'equity-share', label: 'Equity share (ownership %)', requiresValue: true, valueType: 'percentage' },
        { id: 'profit-share', label: 'Profit share (net earnings %)', requiresValue: true, valueType: 'percentage' },
        { id: 'revenue-share', label: 'Revenue share (gross income split %)', requiresValue: true, valueType: 'percentage' },
        { id: 'milestones-wedge', label: 'Milestones wedge (amount)', requiresValue: true, valueType: 'amount' }
      ]
    },
    {
      category: "Marketing / Network",
      options: [
        { id: 'traffic', label: 'Traffic', requiresValue: false },
        { id: 'downloads', label: 'Downloads', requiresValue: false },
        { id: 'impressions', label: 'Impressions (likes, comments, reach)', requiresValue: false },
        { id: 'leads', label: 'Leads, referrals, mentions', requiresValue: false }
      ]
    },
    {
      category: "Usage & Assets",
      options: [
        { id: 'usage-rights', label: 'Usage / access rights', requiresValue: false },
        { id: 'asset-appreciation', label: 'Asset appreciation', requiresValue: false }
      ]
    },
    {
      category: "Intellectual",
      options: [
        { id: 'courses-tutoring', label: 'Courses and Tutoring', requiresValue: false },
        { id: 'research', label: 'Research', requiresValue: false },
        { id: 'ideas-strategies', label: 'Ideas, Perspective & Strategies', requiresValue: false },
        { id: 'code-algorithms', label: 'Code and Algorithm Snippets', requiresValue: false },
        { id: 'mentorship', label: 'Mentorship Program', requiresValue: false },
        { id: 'project-management', label: 'Project Planning & Management', requiresValue: false },
        { id: 'consultation', label: 'Consultation', requiresValue: false },
        { id: 'prime-reviews', label: 'Prime Reviews', requiresValue: false },
        { id: 'guide-counselling', label: 'Guide and Counselling', requiresValue: false },
        { id: 'customer-support', label: 'Customer Support', requiresValue: false },
        { id: 'capacity-building', label: 'Capacity Building', requiresValue: false }
      ]
    }
  ];

  // Helper functions for outcome management

  const findOutcomeById = (id: string) => {
    for (const category of outcomeCategories) {
      const outcome = category.options.find(opt => opt.id === id);
      if (outcome) return outcome;
    }
    return null;
  };

  const isOutcomeSelected = (type: 'toGive' | 'toReceive', outcomeId: string) => {
    return tempOutcomes[type].some((outcome: any) => outcome.id === outcomeId);
  };

  const handleOutcomeToggle = (type: 'toGive' | 'toReceive', outcomeId: string) => {
    const outcomeData = findOutcomeById(outcomeId);
    if (!outcomeData) return;
    
    setTempOutcomes(prev => {
      const currentOutcomes = prev[type];
      const existingIndex = currentOutcomes.findIndex((outcome: any) => outcome.id === outcomeId);
      
      if (existingIndex >= 0) {
        // Remove outcome
        return {
          ...prev,
          [type]: currentOutcomes.filter((_: any, index: number) => index !== existingIndex)
        };
      } else {
        // Add outcome
        const newOutcome = {
          id: outcomeId,
          label: outcomeData.label,
          type: outcomeData.requiresValue ? (outcomeData as any).valueType : 'none',
          value: null,
          custom: false
        };
        return {
          ...prev,
          [type]: [...currentOutcomes, newOutcome]
        };
      }
    });
  };

  const handleOutcomeValueChange = (type: 'toGive' | 'toReceive', outcomeId: string, value: string) => {
    setTempOutcomes(prev => ({
      ...prev,
      [type]: prev[type].map((outcome: any) => 
        outcome.id === outcomeId ? { ...outcome, value: value } : outcome
      )
    }));
  };

  const handleCustomOutcomeAdd = (type: 'toGive' | 'toReceive') => {
    const customText = customInput[type].trim();
    if (!customText) return;
    
    const customOutcome = {
      id: `custom-${Date.now()}`,
      label: customText,
      type: 'none',
      value: null,
      custom: true
    };
    
    setTempOutcomes(prev => ({
      ...prev,
      [type]: [...prev[type], customOutcome]
    }));
    
    setCustomInput(prev => ({ ...prev, [type]: '' }));
  };

  const handleCustomOutcomeRemove = (type: 'toGive' | 'toReceive', outcomeId: string) => {
    setTempOutcomes(prev => ({
      ...prev,
      [type]: prev[type].filter((outcome: any) => outcome.id !== outcomeId)
    }));
  };

  const handleCustomOutcomeEdit = (type: 'toGive' | 'toReceive', outcomeId: string, newLabel: string) => {
    setTempOutcomes(prev => ({
      ...prev,
      [type]: prev[type].map((outcome: any) => 
        outcome.id === outcomeId ? { ...outcome, label: newLabel.trim() } : outcome
      )
    }));
  };

  const validateOutcomes = () => {
    // Validate numeric inputs for outcomes that require values
    for (const type of ['toGive', 'toReceive'] as const) {
      for (const outcome of tempOutcomes[type]) {
        if (outcome.type === 'percentage' && outcome.value) {
          const numValue = parseFloat(outcome.value);
          if (isNaN(numValue) || numValue < 0 || numValue > 100) {
            return { valid: false, error: `${outcome.label} percentage must be between 0-100` };
          }
        }
        if (outcome.type === 'amount' && outcome.value) {
          const numValue = parseFloat(outcome.value);
          if (isNaN(numValue) || numValue <= 0) {
            return { valid: false, error: `${outcome.label} amount must be greater than 0` };
          }
        }
      }
    }
    return { valid: true, error: null };
  };

  // Removed old modal functions since tabs are now embedded directly in Step 2

  // Legacy helper function for backward compatibility 
  const findOutcomeLabel = (id: string): string => {
    const outcome = findOutcomeById(id);
    return outcome ? outcome.label : id;
  };

  // Mock timelines data for Step 4 - in real app, fetch from API
  const mockAvailableTimelines = [
    { id: 'timeline-1', title: 'Solar Installation Project', value: 50000, type: 'project' },
    { id: 'timeline-2', title: 'Marketing Campaign Q3', value: 25000, type: 'marketing' },
    { id: 'timeline-3', title: 'Code Development Timeline', value: 35000, type: 'intellectual' },
    { id: 'timeline-4', title: 'Equipment Purchase Fund', value: 40000, type: 'assets' },
    { id: 'timeline-5', title: 'Client Follow-up Services', value: 15000, type: 'followup' }
  ];

  // Step 4 Link Timelines Functions
  const filteredTimelines = mockAvailableTimelines.filter(timeline =>
    timeline.title.toLowerCase().includes(timelineSearch.toLowerCase())
  );

  const handleTimelineToggle = (timelineId: string) => {
    setSelectedTimelines(prev => 
      prev.includes(timelineId) 
        ? prev.filter(id => id !== timelineId)
        : [...prev, timelineId]
    );
  };

  const handleAllocationChange = (timelineId: string, allocation: string) => {
    setTimelineAllocations(prev => ({
      ...prev,
      [timelineId]: allocation
    }));
  };

  const getTotalAllocation = (): number => {
    return Object.values(timelineAllocations).reduce((total, allocation) => {
      const value = parseFloat(allocation) || 0;
      return total + value;
    }, 0);
  };

  const validateTimelineAllocations = (): { valid: boolean; error: string | null } => {
    const total = getTotalAllocation();
    if (total > 100) {
      return { valid: false, error: 'Total allocation cannot exceed 100%' };
    }
    return { valid: true, error: null };
  };

  const handleSaveLinkedTimelines = () => {
    const validation = validateTimelineAllocations();
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const linkedTimelineData = selectedTimelines.map(id => ({
      id,
      allocation: parseFloat(timelineAllocations[id] || '0') || 0
    }));

    setFormData(prev => ({
      ...prev,
      linkedTimelines: linkedTimelineData
    }));

    setShowLinkTimelinesModal(false);
  };

  const handleCancelLinkTimelines = () => {
    // Reset to saved state
    const savedTimelines = formData.linkedTimelines || [];
    setSelectedTimelines(savedTimelines.map((t: any) => t.id));
    setTimelineAllocations(
      savedTimelines.reduce((acc: any, t: any) => ({ ...acc, [t.id]: t.allocation.toString() }), {})
    );
    setShowLinkTimelinesModal(false);
  };

  // Initialize temp state when opening Step 4 modal
  useEffect(() => {
    if (showLinkTimelinesModal) {
      const savedTimelines = formData.linkedTimelines || [];
      setSelectedTimelines(savedTimelines.map((t: any) => t.id));
      setTimelineAllocations(
        savedTimelines.reduce((acc: any, t: any) => ({ ...acc, [t.id]: t.allocation.toString() }), {})
      );
    }
  }, [showLinkTimelinesModal, formData.linkedTimelines]);

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

          {/* Step 2: Configure Expected Outcomes */}
          {currentStep === 2 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Configure Expected Outcomes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Define what you will give and what you expect to receive from this contribution.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Direct tabs inside Step 2 - no modal/drawer needed */}
                <div className="border rounded-lg bg-background">
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'toGive' | 'toReceive')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-t-lg">
                      <TabsTrigger value="toGive" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                        To Give
                      </TabsTrigger>
                      <TabsTrigger value="toReceive" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                        To Receive
                      </TabsTrigger>
                    </TabsList>

                    <div className="p-4">
                      <TabsContent value="toGive" className="mt-0">
                        <ScrollArea className="h-64">
                          <div className="space-y-4">
                            {outcomeCategories.map((category) => (
                              <div key={category.category} className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground">
                                  {category.category}
                                </h4>
                                <div className="space-y-2 ml-2">
                                  {category.options.map((option) => {
                                    const isSelected = isOutcomeSelected('toGive', option.id);
                                    const selectedOutcome = tempOutcomes.toGive.find((o: any) => o.id === option.id);
                                    
                                    return (
                                      <div key={option.id} className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`toGive-${option.id}`}
                                            checked={isSelected}
                                            onCheckedChange={() => handleOutcomeToggle('toGive', option.id)}
                                          />
                                          <Label
                                            htmlFor={`toGive-${option.id}`}
                                            className="text-sm cursor-pointer flex-1"
                                          >
                                            {option.label}
                                          </Label>
                                        </div>
                                        
                                        {isSelected && option.requiresValue && (
                                          <div className="ml-6">
                                            <Input
                                              type="number"
                                              placeholder={option.valueType === 'percentage' ? 'Enter %' : 'Enter amount'}
                                              value={selectedOutcome?.value || ''}
                                              onChange={(e) => handleOutcomeValueChange('toGive', option.id, e.target.value)}
                                              className="w-32 h-8 text-sm"
                                              min="0"
                                              max={option.valueType === 'percentage' ? "100" : undefined}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}

                            {/* Custom outcomes for toGive */}
                            {tempOutcomes.toGive.filter((o: any) => o.custom).length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground">Custom</h4>
                                <div className="space-y-2 ml-2">
                                  {tempOutcomes.toGive.filter((o: any) => o.custom).map((outcome: any) => (
                                    <div key={outcome.id} className="flex items-center space-x-2">
                                      <Checkbox checked={true} disabled />
                                      <Input
                                        value={outcome.label}
                                        onChange={(e) => handleCustomOutcomeEdit('toGive', outcome.id, e.target.value)}
                                        className="flex-1 h-8 text-sm"
                                        placeholder="Custom outcome"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCustomOutcomeRemove('toGive', outcome.id)}
                                        className="h-8 w-8 p-0 text-destructive"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Add custom outcome */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-muted-foreground">Add Custom</h4>
                              <div className="flex items-center space-x-2 ml-2">
                                <Input
                                  value={customInput.toGive}
                                  onChange={(e) => setCustomInput(prev => ({ ...prev, toGive: e.target.value }))}
                                  placeholder="Add custom outcome"
                                  className="flex-1 h-8 text-sm"
                                  onKeyPress={(e) => e.key === 'Enter' && handleCustomOutcomeAdd('toGive')}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCustomOutcomeAdd('toGive')}
                                  disabled={!customInput.toGive.trim()}
                                  className="h-8"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="toReceive" className="mt-0">
                        <ScrollArea className="h-64">
                          <div className="space-y-4">
                            {outcomeCategories.map((category) => (
                              <div key={category.category} className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground">
                                  {category.category}
                                </h4>
                                <div className="space-y-2 ml-2">
                                  {category.options.map((option) => {
                                    const isSelected = isOutcomeSelected('toReceive', option.id);
                                    const selectedOutcome = tempOutcomes.toReceive.find((o: any) => o.id === option.id);
                                    
                                    return (
                                      <div key={option.id} className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`toReceive-${option.id}`}
                                            checked={isSelected}
                                            onCheckedChange={() => handleOutcomeToggle('toReceive', option.id)}
                                          />
                                          <Label
                                            htmlFor={`toReceive-${option.id}`}
                                            className="text-sm cursor-pointer flex-1"
                                          >
                                            {option.label}
                                          </Label>
                                        </div>
                                        
                                        {isSelected && option.requiresValue && (
                                          <div className="ml-6">
                                            <Input
                                              type="number"
                                              placeholder={option.valueType === 'percentage' ? 'Enter %' : 'Enter amount'}
                                              value={selectedOutcome?.value || ''}
                                              onChange={(e) => handleOutcomeValueChange('toReceive', option.id, e.target.value)}
                                              className="w-32 h-8 text-sm"
                                              min="0"
                                              max={option.valueType === 'percentage' ? "100" : undefined}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}

                            {/* Custom outcomes for toReceive */}
                            {tempOutcomes.toReceive.filter((o: any) => o.custom).length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground">Custom</h4>
                                <div className="space-y-2 ml-2">
                                  {tempOutcomes.toReceive.filter((o: any) => o.custom).map((outcome: any) => (
                                    <div key={outcome.id} className="flex items-center space-x-2">
                                      <Checkbox checked={true} disabled />
                                      <Input
                                        value={outcome.label}
                                        onChange={(e) => handleCustomOutcomeEdit('toReceive', outcome.id, e.target.value)}
                                        className="flex-1 h-8 text-sm"
                                        placeholder="Custom outcome"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCustomOutcomeRemove('toReceive', outcome.id)}
                                        className="h-8 w-8 p-0 text-destructive"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Add custom outcome */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-muted-foreground">Add Custom</h4>
                              <div className="flex items-center space-x-2 ml-2">
                                <Input
                                  value={customInput.toReceive}
                                  onChange={(e) => setCustomInput(prev => ({ ...prev, toReceive: e.target.value }))}
                                  placeholder="Add custom outcome"
                                  className="flex-1 h-8 text-sm"
                                  onKeyPress={(e) => e.key === 'Enter' && handleCustomOutcomeAdd('toReceive')}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCustomOutcomeAdd('toReceive')}
                                  disabled={!customInput.toReceive.trim()}
                                  className="h-8"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </div>

                    {/* Save/Cancel footer */}
                    <div className="flex items-center justify-end gap-2 p-4 border-t bg-muted/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTempOutcomes({
                            toGive: [...(formData.outcomes.toGive || [])],
                            toReceive: [...(formData.outcomes.toReceive || [])]
                          });
                          setCustomInput({ toGive: '', toReceive: '' });
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const validation = validateOutcomes();
                          if (validation.valid) {
                            setFormData(prev => ({
                              ...prev,
                              outcomes: {
                                toGive: [...tempOutcomes.toGive],
                                toReceive: [...tempOutcomes.toReceive]
                              }
                            }));
                          } else {
                            alert(validation.error);
                          }
                        }}
                      >
                        Save & Continue
                      </Button>
                    </div>
                  </Tabs>
                </div>

                {/* Summary of saved outcomes */}
                {(formData.outcomes.toGive.length > 0 || formData.outcomes.toReceive.length > 0) && (
                  <div className="mt-4 p-3 rounded-lg border bg-muted/30">
                    <h4 className="font-medium text-sm mb-2">Current Configuration:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.outcomes.toGive.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-green-700 mb-1">To Give:</h5>
                          <div className="space-y-1">
                            {formData.outcomes.toGive.map((outcome: any, index: number) => (
                              <div key={index} className="text-xs flex items-center justify-between">
                                <span>{outcome.label}</span>
                                {outcome.value && (
                                  <Badge variant="secondary" className="text-xs">
                                    {outcome.type === 'percentage' ? `${outcome.value}%` : `$${outcome.value}`}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formData.outcomes.toReceive.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-blue-700 mb-1">To Receive:</h5>
                          <div className="space-y-1">
                            {formData.outcomes.toReceive.map((outcome: any, index: number) => (
                              <div key={index} className="text-xs flex items-center justify-between">
                                <span>{outcome.label}</span>
                                {outcome.value && (
                                  <Badge variant="secondary" className="text-xs">
                                    {outcome.type === 'percentage' ? `${outcome.value}%` : `$${outcome.value}`}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Choose Type */}
          {currentStep === 3 && (
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

          {/* Step 4: Link/Merge Timelines */}
          {currentStep === 4 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  Link/Merge Timelines
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect related timelines to this contribution and set allocation percentages.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setShowLinkTimelinesModal(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Select Timelines to Link
                </Button>

                {/* Summary of linked timelines */}
                {formData.linkedTimelines && formData.linkedTimelines.length > 0 && (
                  <div className="p-3 rounded-lg border bg-muted/30">
                    <h4 className="font-medium text-sm mb-2">Linked Timelines:</h4>
                    <div className="space-y-2">
                      {formData.linkedTimelines.map((timeline: any) => {
                        const timelineData = mockAvailableTimelines.find(t => t.id === timeline.id);
                        return (
                          <div key={timeline.id} className="flex items-center justify-between text-sm">
                            <span>{timelineData?.title || timeline.id}</span>
                            <div className="flex items-center gap-2">
                              {timeline.allocation > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {timeline.allocation}%
                                </Badge>
                              )}
                              <span className="text-muted-foreground">
                                ${(timelineData?.value || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t text-xs text-muted-foreground">
                        Total Allocation: {formData.linkedTimelines.reduce((sum: number, t: any) => sum + t.allocation, 0)}%
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 5: Configure Details */}
          {currentStep === 5 && selectedSubtype && (
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

          {/* Step 6: Valuation */}
          {currentStep === 6 && (
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
                              {findOutcomeLabel(id)}
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
                              {findOutcomeLabel(id)}
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

      {/* Link Timelines Modal/Drawer */}
      {isMobile ? (
        <Drawer open={showLinkTimelinesModal} onOpenChange={setShowLinkTimelinesModal}>
          <DrawerContent className="h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>Link Timelines</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search timelines..."
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Timeline List */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {filteredTimelines.map((timeline) => {
                    const isSelected = selectedTimelines.includes(timeline.id);
                    const allocation = timelineAllocations[timeline.id] || '';
                    
                    return (
                      <div key={timeline.id} className="border rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleTimelineToggle(timeline.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div>
                              <h4 className="font-medium text-sm">{timeline.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {timeline.type}
                                </Badge>
                                <span>${timeline.value.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Allocation %:</Label>
                                <Input
                                  type="number"
                                  value={allocation}
                                  onChange={(e) => handleAllocationChange(timeline.id, e.target.value)}
                                  placeholder="0"
                                  className="w-20 h-7 text-xs"
                                  min="0"
                                  max="100"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Validation Info */}
              {selectedTimelines.length > 0 && (
                <div className="p-4 border-t bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Allocation:</span>
                    <span className={getTotalAllocation() > 100 ? 'text-destructive font-medium' : ''}>
                      {getTotalAllocation()}%
                    </span>
                  </div>
                  {getTotalAllocation() > 100 && (
                    <p className="text-xs text-destructive mt-1">
                      Total allocation cannot exceed 100%
                    </p>
                  )}
                </div>
              )}
            </div>

            <DrawerFooter>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelLinkTimelines} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveLinkedTimelines} className="flex-1">
                  Save & Continue
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showLinkTimelinesModal} onOpenChange={setShowLinkTimelinesModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Link Timelines</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 flex flex-col min-h-0">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search timelines..."
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Timeline List */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-3">
                  {filteredTimelines.map((timeline) => {
                    const isSelected = selectedTimelines.includes(timeline.id);
                    const allocation = timelineAllocations[timeline.id] || '';
                    
                    return (
                      <div key={timeline.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleTimelineToggle(timeline.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="font-medium">{timeline.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {timeline.type}
                                </Badge>
                                <span>${timeline.value.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <Label className="text-sm">Allocation %:</Label>
                                <Input
                                  type="number"
                                  value={allocation}
                                  onChange={(e) => handleAllocationChange(timeline.id, e.target.value)}
                                  placeholder="0"
                                  className="w-24 h-8"
                                  min="0"
                                  max="100"
                                />
                                <span className="text-xs text-muted-foreground">
                                  (Optional)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Validation Info */}
              {selectedTimelines.length > 0 && (
                <div className="mt-4 p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Allocation:</span>
                    <span className={getTotalAllocation() > 100 ? 'text-destructive font-medium' : ''}>
                      {getTotalAllocation()}%
                    </span>
                  </div>
                  {getTotalAllocation() > 100 && (
                    <p className="text-xs text-destructive mt-1">
                      Total allocation cannot exceed 100%
                    </p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleCancelLinkTimelines}>
                Cancel
              </Button>
              <Button onClick={handleSaveLinkedTimelines}>
                Save & Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};