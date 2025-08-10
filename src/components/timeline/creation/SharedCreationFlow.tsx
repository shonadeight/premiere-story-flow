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
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft, 
  ArrowRight, 
  Settings, 
  DollarSign, 
  BarChart3, 
  Share2, 
  GitBranch,
  Calendar,
  Users,
  Shield,
  Plus,
  X,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TimelineType, ContributionType } from '@/types/timeline';
import { OfflineStorage } from '@/lib/storage';

interface SharedCreationFlowProps {
  selectedType: TimelineType;
  onComplete: (timelineData: any) => void;
  onBack: () => void;
}

export const SharedCreationFlow: React.FC<SharedCreationFlowProps> = ({
  selectedType,
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<any>({
    // Basic Identity & Visibility (Step 2)
    name: '',
    description: '',
    visibility: 'public',
    
    // Purpose & Scope (Step 3)
    mainGoal: '',
    startDate: '',
    endDate: '',
    milestones: [],
    
    // Contribution Rules (Step 4)
    allowedContributions: [],
    customFields: {},
    
    // Valuation Configuration (Step 5)
    valuationModel: 'fixed',
    baseUnit: 'USD',
    conversionRules: {},
    
    // Tracking Configuration (Step 6)
    trackingInputs: [],
    verificationMethod: 'self-attest',
    
    // Outcome Sharing Configuration (Step 7)
    rewardTypes: [],
    distributionModel: 'pro-rata',
    payoutTriggers: [],
    
    // Subtimeline Rules (Step 8)
    allowSubtimelines: false,
    subtimelineCreation: 'manual',
    inheritRules: true,
    
    // Governance & Compliance (Step 9)
    approvalProcess: 'owner',
    kycRequired: false,
    kycThreshold: 1000
  });

  const steps = [
    { id: 1, title: 'Timeline Type', description: 'Selected type and overview' },
    { id: 2, title: 'Basic Info', description: 'Name, description and visibility' },
    { id: 3, title: 'Purpose', description: 'Goals, dates and milestones' },
    { id: 4, title: 'Contributions', description: 'What you accept' },
    { id: 5, title: 'Valuation', description: 'How contributions are valued' },
    { id: 6, title: 'Tracking', description: 'Evidence and verification' },
    { id: 7, title: 'Outcomes', description: 'Rewards and distribution' },
    { id: 8, title: 'Subtimelines', description: 'Nested timeline rules' },
    { id: 9, title: 'Governance', description: 'Approval and compliance' },
    { id: 10, title: 'Preview', description: 'Review and publish' }
  ];

  const progressPercentage = (currentStep / steps.length) * 100;

  const contributionTypes = [
    'financial', 'intellectual', 'marketing', 'assets', 'followup'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: string, item: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), item]
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 2:
        return formData.name && formData.description;
      case 3:
        return formData.mainGoal;
      case 4:
        return formData.allowedContributions.length > 0;
      case 5:
        return formData.valuationModel && formData.baseUnit;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                {selectedType} Timeline Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2">Timeline Type: {selectedType}</h4>
                <p className="text-sm text-muted-foreground">
                  {getTimelineTypeDescription(selectedType)}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">What you'll configure:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Basic information and visibility settings</li>
                  <li>• Purpose, goals, and timeline scope</li>
                  <li>• Contribution types and custom capture forms</li>
                  <li>• Valuation methods and outcome sharing</li>
                  <li>• Tracking, verification, and governance rules</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Basic Identity & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Timeline Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter timeline name"
                  className="touch-manipulation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your timeline's purpose and goals"
                  rows={isMobile ? 3 : 4}
                  className="touch-manipulation resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                  <SelectTrigger className="touch-manipulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can view and contribute</SelectItem>
                    <SelectItem value="private">Private - Only you can manage</SelectItem>
                    <SelectItem value="invite-only">Invite Only - Controlled access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Purpose & Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainGoal">Main Goal *</Label>
                <Textarea
                  id="mainGoal"
                  value={formData.mainGoal}
                  onChange={(e) => handleInputChange('mainGoal', e.target.value)}
                  placeholder="What is the primary objective of this timeline?"
                  rows={isMobile ? 3 : 4}
                  className="touch-manipulation resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="touch-manipulation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="touch-manipulation"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Milestones</Label>
                <div className="space-y-2">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={milestone}
                        onChange={(e) => {
                          const newMilestones = [...formData.milestones];
                          newMilestones[index] = e.target.value;
                          handleInputChange('milestones', newMilestones);
                        }}
                        placeholder="Milestone description"
                        className="flex-1 touch-manipulation"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArrayRemove('milestones', index)}
                        className="touch-manipulation"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleArrayAdd('milestones', '')}
                    className="w-full touch-manipulation"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Contribution Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Allowed Contribution Types *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contributionTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        id={type}
                        checked={formData.allowedContributions.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('allowedContributions', [...formData.allowedContributions, type]);
                          } else {
                            handleInputChange('allowedContributions', formData.allowedContributions.filter(t => t !== type));
                          }
                        }}
                        className="touch-manipulation"
                      />
                      <Label htmlFor={type} className="capitalize cursor-pointer flex-1">
                        {type} Contributions
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.allowedContributions.length > 0 && (
                <div className="space-y-3">
                  <Label>Custom Capture Fields</Label>
                  <p className="text-sm text-muted-foreground">
                    Define additional fields contributors will fill for each contribution type.
                  </p>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">Custom fields configuration will be added based on selected contribution types.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Valuation Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Valuation Model *</Label>
                <Select value={formData.valuationModel} onValueChange={(value) => handleInputChange('valuationModel', value)}>
                  <SelectTrigger className="touch-manipulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Unit - Set rates per contribution</SelectItem>
                    <SelectItem value="hourly">Hourly Rate - Time-based valuation</SelectItem>
                    <SelectItem value="market">Market Index - External price feeds</SelectItem>
                    <SelectItem value="outcome">Outcome-based - Results-driven valuation</SelectItem>
                    <SelectItem value="hybrid">Hybrid - Multiple methods combined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Base Unit *</Label>
                <Select value={formData.baseUnit} onValueChange={(value) => handleInputChange('baseUnit', value)}>
                  <SelectTrigger className="touch-manipulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollars</SelectItem>
                    <SelectItem value="EUR">EUR - Euros</SelectItem>
                    <SelectItem value="TOKEN">TOKEN - Custom tokens</SelectItem>
                    <SelectItem value="CREDITS">CREDITS - Internal credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Conversion Rules</Label>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Conversion rules will be configured based on your valuation model selection.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 10:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Preview & Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-lg mb-2">{formData.name}</h3>
                <p className="text-muted-foreground mb-3">{formData.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedType} Timeline</Badge>
                  <Badge variant="outline">{formData.visibility}</Badge>
                  <Badge variant="outline">{formData.valuationModel} valuation</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contribution Types</h4>
                  <ul className="text-sm space-y-1">
                    {formData.allowedContributions.map((type, index) => (
                      <li key={index} className="capitalize">• {type}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Configuration</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Base Unit: {formData.baseUnit}</li>
                    <li>• Verification: {formData.verificationMethod}</li>
                    <li>• Subtimelines: {formData.allowSubtimelines ? 'Enabled' : 'Disabled'}</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Switch
                  checked={true}
                  disabled
                />
                <Label className="text-sm">Ready to publish timeline</Label>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Step {currentStep}</h3>
                <p className="text-muted-foreground">
                  {steps[currentStep - 1]?.description} configuration will be implemented here.
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  const getTimelineTypeDescription = (type: TimelineType): string => {
    const descriptions = {
      project: 'Manage deliverables, milestones, and project-specific contributions with team collaboration.',
      followup: 'Track ongoing activities, client interactions, and recurring tasks with systematic follow-up.',
      profile: 'Personal or professional profile that can accept sponsorships and manage reputation.',
      financial: 'Handle various financial contributions including cash, crypto, loans, and equity investments.',
      marketing: 'Manage marketing campaigns, referrals, events, and content creation with performance tracking.',
      intellectual: 'Manage intellectual property contributions including consulting, deliverables, and IP licensing.',
      assets: 'Track and manage physical or digital asset contributions including land, equipment, and licenses.'
    };
    return descriptions[type] || 'Custom timeline configuration for specialized use cases.';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Mobile-optimized Progress Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">
            Step {currentStep} of {steps.length}
          </h2>
          <Badge variant="outline" className="text-xs sm:text-sm">
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium">{steps[currentStep - 1]?.title}</span>
            <span className="text-muted-foreground">{steps[currentStep - 1]?.description}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Mobile-friendly step indicators */}
        {!isMobile && (
          <ScrollArea className="w-full">
            <div className="flex items-center space-x-2 pb-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <span className="font-medium">{step.id}</span>
                  <span>{step.title}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Step Content */}
      <div className="touch-manipulation">
        {renderStepContent()}
      </div>

      {/* Mobile-optimized Navigation */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t">
        {currentStep === 1 ? (
          <Button 
            variant="outline" 
            onClick={onBack}
            size={isMobile ? "sm" : "default"}
            className="touch-manipulation"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Types
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={prevStep}
            size={isMobile ? "sm" : "default"}
            className="touch-manipulation"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        )}

        <div className="flex items-center gap-2">
          {currentStep < steps.length ? (
            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              size={isMobile ? "sm" : "default"}
              className="touch-manipulation"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={() => onComplete(formData)}
              disabled={!canProceed()}
              size={isMobile ? "sm" : "default"}
              className="touch-manipulation"
            >
              Create Timeline
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};