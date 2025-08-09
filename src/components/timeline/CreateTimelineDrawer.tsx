import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { toast } from 'sonner';
import { OfflineStorage } from '@/lib/storage';
import { 
  ArrowLeft, 
  ArrowRight,
  Rocket, 
  DollarSign, 
  Brain, 
  Share2,
  Settings,
  Target,
  Link,
  FileText,
  Calendar,
  Users,
  Eye,
  CreditCard,
  BarChart3,
  CheckCircle,
  Plus,
  Upload,
  X
} from 'lucide-react';

interface CreateTimelineDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTimelineDrawer: React.FC<CreateTimelineDrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    contributionType: '',
    expectedOutcome: '',
    outcomeType: '',
    sharingOption: '',
    linkedTimelines: [] as string[],
    contributions: [] as any[],
    followupEnabled: false,
    expectedDate: '',
    customTags: [] as string[],
    members: [] as any[],
    isPublic: false,
    customFields: [] as any[],
    subscriptionEnabled: false,
    accessSummary: '',
    subscriptionPeriod: '',
    subscriptionAmount: '',
    requiresDeposit: false,
    depositAmount: '',
    enableReports: false,
    selectedReports: [] as string[],
    externalAPIReports: [] as any[],
  });

  // Load draft on open
  useEffect(() => {
    if (open) {
      const draft = OfflineStorage.getDraft();
      if (draft) {
        setFormData(prev => ({ ...prev, ...(draft as any) }));
      }
    }
  }, [open]);

  // Auto-save draft
  useEffect(() => {
    if (open && formData.title) {
      OfflineStorage.saveDraft(formData as any);
    }
  }, [formData, open]);

  const totalSteps = 12;
  const progress = (currentStep / totalSteps) * 100;

  const contributionTypes = [
    { value: 'project', label: 'New Project Timeline', icon: Rocket, description: 'Start a new project initiative' },
    { value: 'financial', label: 'Financial Contribution Timeline', icon: DollarSign, description: 'Capital investment and funding' },
    { value: 'intellectual', label: 'Intellectual Timeline', icon: Brain, description: 'Knowledge, research, and IP contributions' },
    { value: 'network', label: 'Network & Marketing Timeline', icon: Share2, description: 'Connections, partnerships, and marketing' },
    { value: 'assets', label: 'Assets Contributions Timeline', icon: Settings, description: 'Physical or digital asset contributions' },
  ];

  const expectedOutcomes = [
    'Revenue Growth', 'Market Expansion', 'Product Development', 'Team Building', 
    'Brand Awareness', 'Technology Innovation', 'Partnership Formation', 'Cost Reduction'
  ];

  const financialEffects = ['Equity Share', 'Profit Share', 'Revenue Share', 'Fixed Returns', 'Performance Bonus'];
  const networkEffects = ['Referral Network', 'Partnership Access', 'Market Connections', 'Industry Expertise', 'Customer Base'];
  const intellectualEffects = ['Knowledge Transfer', 'Patent Rights', 'Research Access', 'Training Materials', 'Best Practices'];

  const reportTypes = [
    'Financial Performance', 'ROI Analysis', 'Contribution Breakdown', 'Timeline Progress',
    'Member Activity', 'Market Analysis', 'Risk Assessment', 'Outcome Tracking'
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addContribution = () => {
    const newContribution = {
      id: Date.now().toString(),
      title: '',
      description: '',
      files: [],
      recordings: []
    };
    setFormData(prev => ({
      ...prev,
      contributions: [...prev.contributions, newContribution]
    }));
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false
    };
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
  };

  const simulatePayment = () => {
    toast.success('Payment processed successfully!');
    nextStep();
  };

  const handlePublish = () => {
    const newTimeline = {
      id: Date.now().toString(),
      title: formData.title,
      type: (formData.contributionType || 'project') as any,
      description: formData.description,
      value: parseFloat(formData.depositAmount) || 0,
      currency: 'USD',
      change: 0,
      changePercent: 0,
      invested: formData.requiresDeposit,
      investedAmount: parseFloat(formData.depositAmount) || 0,
      subtimelines: 0,
      rating: 0,
      views: 0,
      investedMembers: formData.members.length,
      matchedTimelines: 0,
      status: 'active' as const,
      userId: '1',
      tags: formData.customTags,
      isPublic: formData.isPublic,
      collaborators: formData.members.map((m: any) => m.email || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    OfflineStorage.saveTimeline(newTimeline);
    OfflineStorage.clearDraft();
    
    toast.success('Timeline published successfully!');
    onOpenChange(false);
    setCurrentStep(1);
    setFormData({
      title: '',
      description: '',
      type: '',
      contributionType: '',
      expectedOutcome: '',
      outcomeType: '',
      sharingOption: '',
      linkedTimelines: [],
      contributions: [],
      followupEnabled: false,
      expectedDate: '',
      customTags: [],
      members: [],
      isPublic: false,
      customFields: [],
      subscriptionEnabled: false,
      accessSummary: '',
      subscriptionPeriod: '',
      subscriptionAmount: '',
      requiresDeposit: false,
      depositAmount: '',
      enableReports: false,
      selectedReports: [],
      externalAPIReports: [],
    });
  };

  const getStepTitle = (step: number) => {
    const titles = [
      'Select Timeline Type',
      'Expected Outcome', 
      'Outcome Sharing',
      'Link Timelines',
      'Collect Contributions',
      'Schedule & Follow-up',
      'Members & Access',
      'Custom Fields',
      'Subscription Access',
      'Payment Processing',
      'Reports Configuration',
      'Preview & Publish'
    ];
    return titles[step - 1];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Timeline Title</Label>
              <Input
                placeholder="Enter timeline title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your timeline"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>Select Timeline Contribution Type</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {contributionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.contributionType === type.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, contributionType: type.value }))}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium text-sm">{type.label}</h4>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Expected Outcome</Label>
              <Select value={formData.expectedOutcome} onValueChange={(value) => setFormData(prev => ({ ...prev, expectedOutcome: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose expected outcome" />
                </SelectTrigger>
                <SelectContent>
                  {expectedOutcomes.map((outcome) => (
                    <SelectItem key={outcome} value={outcome}>{outcome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Outcome Type</Label>
              <Select value={formData.outcomeType} onValueChange={(value) => setFormData(prev => ({ ...prev, outcomeType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="intellectual">Intellectual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label>Outcome Sharing Configuration</Label>
            {formData.outcomeType === 'financial' && (
              <div>
                <Label className="text-sm">Financial Effects</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {financialEffects.map((effect) => (
                    <div key={effect} className="flex items-center space-x-2">
                      <Checkbox 
                        id={effect} 
                        checked={formData.sharingOption === effect}
                        onCheckedChange={() => setFormData(prev => ({ ...prev, sharingOption: effect }))}
                      />
                      <Label htmlFor={effect} className="text-sm">{effect}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.outcomeType === 'network' && (
              <div>
                <Label className="text-sm">Network Effects</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {networkEffects.map((effect) => (
                    <div key={effect} className="flex items-center space-x-2">
                      <Checkbox 
                        id={effect}
                        checked={formData.sharingOption === effect}
                        onCheckedChange={() => setFormData(prev => ({ ...prev, sharingOption: effect }))}
                      />
                      <Label htmlFor={effect} className="text-sm">{effect}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.outcomeType === 'intellectual' && (
              <div>
                <Label className="text-sm">Intellectual Effects</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {intellectualEffects.map((effect) => (
                    <div key={effect} className="flex items-center space-x-2">
                      <Checkbox 
                        id={effect}
                        checked={formData.sharingOption === effect}
                        onCheckedChange={() => setFormData(prev => ({ ...prev, sharingOption: effect }))}
                      />
                      <Label htmlFor={effect} className="text-sm">{effect}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Label>Link Supporting Timelines</Label>
            <div className="space-y-2">
              {['Marketing Timeline Alpha', 'Development Resources', 'Financial Backing'].map((timeline) => (
                <div key={timeline} className="flex items-center space-x-2 p-2 border rounded">
                  <Checkbox id={timeline} />
                  <Label htmlFor={timeline} className="text-sm">{timeline}</Label>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Browse More Timelines
            </Button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Label>Collect Contributions</Label>
            {formData.contributions.map((contribution, index) => (
              <div key={contribution.id} className="p-3 border rounded-lg space-y-2">
                <Input
                  placeholder="Contribution Title"
                  value={contribution.title}
                  onChange={(e) => {
                    const updated = [...formData.contributions];
                    updated[index].title = e.target.value;
                    setFormData(prev => ({ ...prev, contributions: updated }));
                  }}
                />
                <Textarea
                  placeholder="Contribution Description"
                  value={contribution.description}
                  onChange={(e) => {
                    const updated = [...formData.contributions];
                    updated[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, contributions: updated }));
                  }}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Files
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Recording
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={addContribution} variant="outline" className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Contribution
            </Button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Follow-up</Label>
              <Switch
                checked={formData.followupEnabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, followupEnabled: checked }))}
              />
            </div>
            
            {formData.followupEnabled && (
              <div>
                <Label>Expected Date</Label>
                <Input
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedDate: e.target.value }))}
                />
              </div>
            )}
            
            <div>
              <Label>Custom Tags</Label>
              <Input placeholder="Add custom tags (comma separated)" />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <Label>Invite Members</Label>
              <div className="flex gap-2">
                <Input placeholder="Enter email address" />
                <Button variant="outline" size="sm">Invite</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Public Access</Label>
                <p className="text-xs text-muted-foreground">Allow public discovery</p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <Label>Custom Fields Configuration</Label>
            {formData.customFields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded-lg space-y-2">
                <Input
                  placeholder="Field Label"
                  value={field.label}
                  onChange={(e) => {
                    const updated = [...formData.customFields];
                    updated[index].label = e.target.value;
                    setFormData(prev => ({ ...prev, customFields: updated }));
                  }}
                />
                <Select
                  value={field.type}
                  onValueChange={(value) => {
                    const updated = [...formData.customFields];
                    updated[index].type = value;
                    setFormData(prev => ({ ...prev, customFields: updated }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button onClick={addCustomField} variant="outline" className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Field
            </Button>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Subscription Access</Label>
              <Switch
                checked={formData.subscriptionEnabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, subscriptionEnabled: checked }))}
              />
            </div>
            
            {formData.subscriptionEnabled && (
              <>
                <div>
                  <Label>Access Summary</Label>
                  <Textarea
                    placeholder="Describe what subscribers get access to"
                    value={formData.accessSummary}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessSummary: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Period</Label>
                    <Select value={formData.subscriptionPeriod} onValueChange={(value) => setFormData(prev => ({ ...prev, subscriptionPeriod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount (USD)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.subscriptionAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, subscriptionAmount: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Requires Initial Deposit</Label>
              <Switch
                checked={formData.requiresDeposit}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresDeposit: checked }))}
              />
            </div>
            
            {formData.requiresDeposit && (
              <>
                <div>
                  <Label>Deposit Amount (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, depositAmount: e.target.value }))}
                  />
                </div>
                <Button onClick={simulatePayment} className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              </>
            )}
          </div>
        );

      case 11:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Reports</Label>
              <Switch
                checked={formData.enableReports}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableReports: checked }))}
              />
            </div>
            
            {formData.enableReports && (
              <div>
                <Label>Select Report Types</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {reportTypes.map((report) => (
                    <div key={report} className="flex items-center space-x-2">
                      <Checkbox
                        id={report}
                        checked={formData.selectedReports.includes(report)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ ...prev, selectedReports: [...prev.selectedReports, report] }));
                          } else {
                            setFormData(prev => ({ ...prev, selectedReports: prev.selectedReports.filter(r => r !== report) }));
                          }
                        }}
                      />
                      <Label htmlFor={report} className="text-sm">{report}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 12:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Timeline Preview</h4>
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{formData.contributionType}</Badge>
                  {formData.isPublic && <Badge variant="secondary">Public</Badge>}
                </div>
                <h5 className="font-medium">{formData.title || 'Untitled Timeline'}</h5>
                <p className="text-sm text-muted-foreground">
                  {formData.description || 'No description provided'}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Outcome: {formData.expectedOutcome || 'Not set'}</span>
                  <span>Members: {formData.members.length}</span>
                  <span>Contributions: {formData.contributions.length}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handlePublish} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Publish Timeline
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-lg">{getStepTitle(currentStep)}</DrawerTitle>
              <DrawerDescription className="text-sm">
                Step {currentStep} of {totalSteps}
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSummary(!showSummary)}
              >
                Summary
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                Preview
              </Button>
            </div>
          </div>
          <Progress value={progress} className="w-full h-1" />
        </DrawerHeader>

        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {currentStep}/{totalSteps}
            </span>
          </div>
          
          <Button
            onClick={currentStep === totalSteps ? handlePublish : nextStep}
            disabled={!formData.title && currentStep === 1}
            size="sm"
          >
            {currentStep === totalSteps ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Publish
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};