import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Users, 
  DollarSign,
  Settings,
  CheckCircle,
  FileText,
  Calendar,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react';
import { TimelineType, ContributionType } from '@/types/timeline';

interface SharedCreationFlowProps {
  selectedType: TimelineType;
  onComplete: (timelineData: any) => void;
  onBack: () => void;
}

interface TimelineFormData {
  // Step 1: Basic Identity
  title: string;
  description: string;
  visibility: 'public' | 'private' | 'invite-only';
  
  // Step 2: Purpose & Scope
  purpose: string;
  scope: string;
  startDate: string;
  endDate: string;
  milestones: string[];
  
  // Step 3: Contribution Rules
  allowedContributionTypes: ContributionType[];
  
  // Step 4: Valuation Configuration
  valuationModel: 'fixed' | 'hourly' | 'market' | 'outcome' | 'hybrid' | 'custom';
  baseUnit: 'USD' | 'token' | 'credits';
  
  // Step 5: Tracking Configuration
  trackingInputs: ('manual' | 'files' | 'api')[];
  verificationMethod: 'self' | 'owner' | 'third-party' | 'smart-contract';
  
  // Step 6: Outcome Sharing
  rewardTypes: ('profit' | 'equity' | 'royalties' | 'credits' | 'access' | 'badges')[];
  distributionModel: 'pro-rata' | 'tiered' | 'milestone' | 'custom';
  payoutTriggers: string[];
  
  // Step 7: Subtimeline Rules
  allowSubtimelines: boolean;
  subtimelineCreation: 'auto' | 'template' | 'manual' | 'conditional';
  subtimelineInheritance: boolean;
  
  // Step 8: Governance
  approvalRequired: boolean;
  kycRequired: boolean;
  kycThreshold: number;
}

const totalSteps = 9;

export const SharedCreationFlow = ({ selectedType, onComplete, onBack }: SharedCreationFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TimelineFormData>({
    title: '',
    description: '',
    visibility: 'public',
    purpose: '',
    scope: '',
    startDate: '',
    endDate: '',
    milestones: [],
    allowedContributionTypes: [],
    valuationModel: 'fixed',
    baseUnit: 'USD',
    trackingInputs: ['manual'],
    verificationMethod: 'self',
    rewardTypes: [],
    distributionModel: 'pro-rata',
    payoutTriggers: [],
    allowSubtimelines: true,
    subtimelineCreation: 'manual',
    subtimelineInheritance: true,
    approvalRequired: false,
    kycRequired: false,
    kycThreshold: 10000
  });

  const progress = (currentStep / totalSteps) * 100;

  const contributionTypesByTimeline = {
    project: ['cash', 'hours', 'assets', 'timeline'],
    profile: ['cash', 'timeline'],
    financial: ['cash', 'crypto', 'debt', 'pledge', 'equity'],
    followup: ['hours', 'maintenance', 'support'],
    intellectual: ['consulting', 'deliverable', 'royalty', 'ip'],
    network: ['referral', 'campaign', 'event', 'content'],
    assets: ['land', 'building', 'equipment', 'digital'],
    custom: ['cash', 'hours', 'assets', 'timeline', 'consulting', 'referral']
  };

  const stepTitles = [
    'Basic Identity & Visibility',
    'Purpose & Scope',
    'Contribution Rules',
    'Valuation Configuration',
    'Tracking Configuration',
    'Outcome Sharing',
    'Subtimeline Rules',
    'Governance & Compliance',
    'Preview & Publish'
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

  const addMilestone = () => {
    const milestone = prompt('Enter milestone description:');
    if (milestone) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, milestone]
      }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Timeline Title *</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title for your timeline"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what this timeline is about and its main objectives"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            
            <div>
              <Label>Visibility</Label>
              <Select 
                value={formData.visibility} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, visibility: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Public - Anyone can discover and view
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      Private - Only you can access
                    </div>
                  </SelectItem>
                  <SelectItem value="invite-only">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Invite Only - Specific members only
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="purpose">Main Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="What is the main goal of this timeline?"
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="scope">Scope</Label>
              <Textarea
                id="scope"
                placeholder="Define the scope and boundaries of this timeline"
                value={formData.scope}
                onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Milestones</Label>
                <Button onClick={addMilestone} variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
              {formData.milestones.length > 0 ? (
                <div className="space-y-2">
                  {formData.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{milestone}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No milestones added yet</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Allowed Contribution Types</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Select what types of contributions this timeline will accept
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {(contributionTypesByTimeline[selectedType] || []).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.allowedContributionTypes.includes(type as ContributionType)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            allowedContributionTypes: [...prev.allowedContributionTypes, type as ContributionType]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            allowedContributionTypes: prev.allowedContributionTypes.filter(t => t !== type)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={type} className="text-sm capitalize">
                      {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Valuation Model</Label>
              <Select
                value={formData.valuationModel}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, valuationModel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Unit - Set price per contribution</SelectItem>
                  <SelectItem value="hourly">Hourly Rate - Time-based valuation</SelectItem>
                  <SelectItem value="market">Market Index - Dynamic market-based pricing</SelectItem>
                  <SelectItem value="outcome">Outcome-based - Value based on results</SelectItem>
                  <SelectItem value="hybrid">Hybrid - Combination of methods</SelectItem>
                  <SelectItem value="custom">Custom Formula - Define your own rules</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Base Unit</Label>
              <Select
                value={formData.baseUnit}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, baseUnit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="token">Token - Custom timeline tokens</SelectItem>
                  <SelectItem value="credits">Credits - Point-based system</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Evidence Inputs</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How will contributions be tracked and evidenced?
              </p>
              
              <div className="space-y-3">
                {[
                  { key: 'manual', label: 'Manual Logs', desc: 'Contributors manually log their contributions' },
                  { key: 'files', label: 'File Uploads', desc: 'Require file attachments as proof' },
                  { key: 'api', label: 'API Integration', desc: 'Connect external services for automatic tracking' }
                ].map((input) => (
                  <div key={input.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={input.key}
                      checked={formData.trackingInputs.includes(input.key as any)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            trackingInputs: [...prev.trackingInputs, input.key as any]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            trackingInputs: prev.trackingInputs.filter(t => t !== input.key)
                          }));
                        }
                      }}
                    />
                    <div>
                      <Label htmlFor={input.key} className="text-sm font-medium">{input.label}</Label>
                      <p className="text-xs text-muted-foreground">{input.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Verification Method</Label>
              <Select
                value={formData.verificationMethod}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, verificationMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Self-attest - Contributors verify their own work</SelectItem>
                  <SelectItem value="owner">Owner-approved - Timeline owner reviews contributions</SelectItem>
                  <SelectItem value="third-party">Third-party - External auditor verification</SelectItem>
                  <SelectItem value="smart-contract">Smart Contract - Automated blockchain verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Reward Types</Label>
              <p className="text-sm text-muted-foreground mb-4">
                What types of rewards will contributors receive?
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'profit', label: 'Profit Share' },
                  { key: 'equity', label: 'Equity Stake' },
                  { key: 'royalties', label: 'Royalties' },
                  { key: 'credits', label: 'Credits/Points' },
                  { key: 'access', label: 'Access Rights' },
                  { key: 'badges', label: 'Badges/Recognition' }
                ].map((reward) => (
                  <div key={reward.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={reward.key}
                      checked={formData.rewardTypes.includes(reward.key as any)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            rewardTypes: [...prev.rewardTypes, reward.key as any]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            rewardTypes: prev.rewardTypes.filter(t => t !== reward.key)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={reward.key} className="text-sm">{reward.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Distribution Model</Label>
              <Select
                value={formData.distributionModel}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, distributionModel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pro-rata">Pro-rata - Proportional to contribution</SelectItem>
                  <SelectItem value="tiered">Tiered - Different rates for different levels</SelectItem>
                  <SelectItem value="milestone">Milestone-based - Rewards tied to achievements</SelectItem>
                  <SelectItem value="custom">Custom - Define your own distribution logic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Allow Subtimelines</Label>
                <p className="text-sm text-muted-foreground">
                  Enable contributors to create subtimelines under this timeline
                </p>
              </div>
              <Switch
                checked={formData.allowSubtimelines}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowSubtimelines: checked }))}
              />
            </div>
            
            {formData.allowSubtimelines && (
              <>
                <div>
                  <Label>Subtimeline Creation</Label>
                  <Select
                    value={formData.subtimelineCreation}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, subtimelineCreation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto - Each contribution spawns a subtimeline</SelectItem>
                      <SelectItem value="template">Template - Use preset subtimeline templates</SelectItem>
                      <SelectItem value="manual">Manual - Owner creates subtimelines on demand</SelectItem>
                      <SelectItem value="conditional">Conditional - Auto-create when conditions are met</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Inherit Parent Rules</Label>
                    <p className="text-sm text-muted-foreground">
                      Should subtimelines inherit this timeline's configuration?
                    </p>
                  </div>
                  <Switch
                    checked={formData.subtimelineInheritance}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, subtimelineInheritance: checked }))}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Require Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Should contributions need approval before being accepted?
                </p>
              </div>
              <Switch
                checked={formData.approvalRequired}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, approvalRequired: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">KYC Required</Label>
                <p className="text-sm text-muted-foreground">
                  Require identity verification for contributors
                </p>
              </div>
              <Switch
                checked={formData.kycRequired}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, kycRequired: checked }))}
              />
            </div>
            
            {formData.kycRequired && (
              <div>
                <Label htmlFor="kycThreshold">KYC Threshold ({formData.baseUnit})</Label>
                <Input
                  id="kycThreshold"
                  type="number"
                  placeholder="Minimum contribution value requiring KYC"
                  value={formData.kycThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, kycThreshold: Number(e.target.value) }))}
                />
              </div>
            )}
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Preview Your Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Review your timeline configuration before publishing
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{selectedType}</Badge>
                  {formData.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{formData.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Visibility:</span> {formData.visibility}
                  </div>
                  <div>
                    <span className="font-medium">Valuation:</span> {formData.valuationModel} in {formData.baseUnit}
                  </div>
                  <div>
                    <span className="font-medium">Contributions:</span> {formData.allowedContributionTypes.length} types
                  </div>
                  <div>
                    <span className="font-medium">Rewards:</span> {formData.rewardTypes.length} types
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Key Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {formData.allowSubtimelines && <li>• Subtimelines enabled</li>}
                    {formData.approvalRequired && <li>• Requires approval for contributions</li>}
                    {formData.kycRequired && <li>• KYC verification required</li>}
                    <li>• {formData.trackingInputs.length} tracking method(s)</li>
                    <li>• {formData.verificationMethod} verification</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.description.trim();
      case 2:
        return formData.purpose.trim();
      case 3:
        return formData.allowedContributionTypes.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Create {selectedType} Timeline</h2>
          <Badge variant="outline">{currentStep} of {totalSteps}</Badge>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <h3 className="text-lg font-medium">{stepTitles[currentStep - 1]}</h3>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          onClick={currentStep === 1 ? onBack : prevStep} 
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 1 ? 'Back to Type Selection' : 'Previous'}
        </Button>
        
        {currentStep === totalSteps ? (
          <Button 
            onClick={() => onComplete(formData)}
            className="bg-primary hover:bg-primary/90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Publish Timeline
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};