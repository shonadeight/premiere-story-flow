import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import * as mockData from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
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
  Edit,
  Zap,
  Building,
  Link,
  Upload,
  Eye,
  Settings,
  Users,
  FileText,
  BarChart,
  Gift,
  Target,
  Search,
  Star,
  PlayCircle,
  FileImage,
  FileAudio,
  FileVideo,
  Calendar,
  Percent,
  Shield,
  Lock,
  Globe,
  X,
  Plus,
  Trash2,
  Calculator,
  MessageSquare,
  Handshake,
  CheckCircle,
  TrendingUp
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
  linkedTimelines: Array<{
    id: string;
    name: string;
    type: string;
    value: string;
    percentage: number;
    selected: boolean;
  }>;
  customInputs: {
    title: string;
    description: string;
    context: string;
    inputMethod: string;
    additionalData: any;
    additionalFields: Array<{
      label: string;
      value: string;
      type: string;
    }>;
  };
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    preview?: string;
  }>;
  presentationTemplate: string;
  subContributions: {
    enabled: boolean;
    config: {
      allowedTypes: string[];
      outcomeSharing: {
        mode: string;
        rules: any[];
      };
      accessLevel: string;
      subscriptions: Array<{
        name: string;
        price: number;
        duration: string;
        description: string;
      }>;
      customRatings: boolean;
      followUpWorkflows: boolean;
      fileUploadRules: {
        types: string[];
        maxSize: number;
      };
    };
  };
}

interface TypeConfig {
  selectedSubtypes: string[];
  customSubtype: string;
  value: string;
  valuationMethod: 'fixed' | 'formula' | 'rule';
  notes: string;
  gainPercentage: number;
  negotiationRequested: boolean;
  amount?: string;
  dates?: { start: string; end: string };
  interestRate?: string;
  expectedReturns?: string;
  formula?: string;
  rule?: string;
  linkedValue?: number;
  totalValue?: number;
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
    linkedTimelines: mockData.mockTimelines.map(timeline => ({
      id: timeline.id,
      name: timeline.title,
      type: timeline.type,
      value: `$${timeline.value.toLocaleString()}`,
      percentage: 0,
      selected: false
    })),
    customInputs: {
      title: '',
      description: '',
      context: '',
      inputMethod: '',
      additionalData: {},
      additionalFields: []
    },
    attachments: [],
    presentationTemplate: 'table',
    subContributions: { 
      enabled: false, 
      config: {
        allowedTypes: [],
        outcomeSharing: { mode: 'parent-child', rules: [] },
        accessLevel: 'private',
        subscriptions: [],
        customRatings: false,
        followUpWorkflows: false,
        fileUploadRules: { types: ['pdf', 'doc', 'image'], maxSize: 10 }
      }
    }
  });

  const [showTypeConfig, setShowTypeConfig] = useState<string | null>(null);
  const [showLinkedTimelines, setShowLinkedTimelines] = useState(false);
  const [showCustomInputs, setShowCustomInputs] = useState<string | null>(null);
  const [newCustomOutcome, setNewCustomOutcome] = useState({ toGive: '', toReceive: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [typeConfigData, setTypeConfigData] = useState<{
    [key: string]: TypeConfig;
  }>({});

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
    { id: 'code', name: 'Code/Algorithms', description: 'Software development' },
    { id: 'consultations', name: 'Consultations', description: 'Expert advisory services' },
    { id: 'custom', name: 'Custom Option', description: 'Other intellectual contributions' }
  ];

  const networkSubtypes = [
    { id: 'introductions', name: 'Introductions', description: 'Professional introductions' },
    { id: 'referrals', name: 'Referrals', description: 'Customer referrals' },
    { id: 'leads', name: 'Leads', description: 'Sales leads generation' },
    { id: 'traffic', name: 'Traffic', description: 'Website/app traffic' },
    { id: 'likes', name: 'Likes', description: 'Social media likes' },
    { id: 'comments', name: 'Comments', description: 'User engagement' },
    { id: 'views', name: 'Views', description: 'Content views' },
    { id: 'downloads', name: 'Downloads', description: 'App/content downloads' },
    { id: 'custom', name: 'Custom Option', description: 'Other network contributions' }
  ];

  const assetSubtypes = [
    { id: 'equipment', name: 'Equipment', description: 'Machinery and tools' },
    { id: 'property', name: 'Property', description: 'Real estate and property' },
    { id: 'software', name: 'Software Usage', description: 'Software licenses' },
    { id: 'digital', name: 'Digital Assets', description: 'Digital properties' },
    { id: 'office', name: 'Office Space', description: 'Physical workspace' },
    { id: 'land', name: 'Land', description: 'Land and property' },
    { id: 'tools', name: 'Tools', description: 'Professional tools' },
    { id: 'custom', name: 'Custom Option', description: 'Other asset contributions' }
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

  const calculateGainPercentage = (type: string, amount: string) => {
    const totalOutcomes = data.expectedOutcomes.toReceive.length + data.expectedOutcomes.customToReceive.length;
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
    
    // Base percentage calculation
    let basePercentage = Math.min(totalOutcomes * 1.5, 12);
    
    // Adjust based on amount
    if (numericAmount > 50000) basePercentage *= 2;
    else if (numericAmount > 10000) basePercentage *= 1.5;
    else if (numericAmount > 1000) basePercentage *= 1.2;
    
    return Math.round(basePercentage * 100) / 100;
  };

  const updateTypeConfigField = (type: string, field: keyof TypeConfig, value: any) => {
    setTypeConfigData(prev => {
      const currentData = prev[type] || {
        selectedSubtypes: [],
        customSubtype: '',
        value: '',
        valuationMethod: 'fixed' as const,
        notes: '',
        gainPercentage: 0,
        negotiationRequested: false
      };

      const updated = {
        ...prev,
        [type]: {
          ...currentData,
          [field]: value
        }
      };

      // Recalculate gain percentage when value changes
      if (field === 'value' || field === 'amount') {
        const amount = field === 'amount' ? value : updated[type].value;
        updated[type].gainPercentage = calculateGainPercentage(type, amount);
      }

      return updated;
    });
  };

  const handleSubtypeToggle = (type: string, subtypeId: string) => {
    setTypeConfigData(prev => {
      const currentData = prev[type] || {
        selectedSubtypes: [],
        customSubtype: '',
        value: '',
        valuationMethod: 'fixed' as const,
        notes: '',
        gainPercentage: 0,
        negotiationRequested: false
      };
      
      const updatedSubtypes = currentData.selectedSubtypes.includes(subtypeId)
        ? currentData.selectedSubtypes.filter(s => s !== subtypeId)
        : [...currentData.selectedSubtypes, subtypeId];
        
      return {
        ...prev,
        [type]: {
          ...currentData,
          selectedSubtypes: updatedSubtypes
        }
      };
    });
  };

  const saveTypeConfiguration = (type: string) => {
    const config = typeConfigData[type];
    if (config && (config.selectedSubtypes.length > 0 || config.customSubtype)) {
      setData(prev => ({
        ...prev,
        contributionTypes: {
          ...prev.contributionTypes,
          [type]: {
            ...prev.contributionTypes[type],
            subtypes: [config]
          }
        }
      }));
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} contribution configured successfully!`);
    }
    setShowTypeConfig(null);
  };

  const handleTimelineSelection = (timelineId: string) => {
    setData(prev => {
      const updatedLinkedTimelines = prev.linkedTimelines.map(t => 
        t.id === timelineId 
          ? { ...t, selected: !t.selected, percentage: t.selected ? 0 : t.percentage }
          : t
      );
      
      updateValuationsFromLinkedTimelines(updatedLinkedTimelines);
      
      return {
        ...prev,
        linkedTimelines: updatedLinkedTimelines
      };
    });
  };

  const updateTimelinePercentage = (timelineId: string, percentage: number) => {
    if (percentage < 0 || percentage > 100) {
      toast.error('Percentage must be between 0 and 100');
      return;
    }

    setData(prev => {
      const updatedLinkedTimelines = prev.linkedTimelines.map(t => 
        t.id === timelineId ? { ...t, percentage } : t
      );
      
      const totalPercentage = updatedLinkedTimelines
        .filter(t => t.selected)
        .reduce((sum, t) => sum + t.percentage, 0);
      
      if (totalPercentage > 100) {
        toast.error('Total percentage allocation cannot exceed 100%');
        return prev;
      }
      
      updateValuationsFromLinkedTimelines(updatedLinkedTimelines);
      
      return {
        ...prev,
        linkedTimelines: updatedLinkedTimelines
      };
    });
  };

  const updateValuationsFromLinkedTimelines = (linkedTimelines: any[]) => {
    const linkedValue = linkedTimelines
      .filter(t => t.selected && t.percentage > 0)
      .reduce((sum, t) => {
        const timelineValue = parseFloat(t.value.replace(/[^0-9.]/g, '')) || 0;
        return sum + (timelineValue * t.percentage / 100);
      }, 0);

    setTypeConfigData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(type => {
        if (updated[type]) {
          const baseValue = parseFloat(updated[type].value.replace(/[^0-9.]/g, '')) || 0;
          updated[type] = {
            ...updated[type],
            linkedValue: linkedValue,
            totalValue: baseValue + linkedValue
          };
        }
      });
      return updated;
    });
  };

  const getFilteredTimelines = () => {
    return data.linkedTimelines.filter(timeline => 
      timeline.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const saveLinkedTimelines = () => {
    const selectedTimelines = data.linkedTimelines.filter(t => t.selected);
    toast.success(`${selectedTimelines.length} timeline(s) linked successfully!`);
    setShowLinkedTimelines(false);
  };

  // Render configuration modal/drawer for contribution types
  const renderTypeConfigModal = (type: string) => {
    const config = typeConfigData[type] || {
      selectedSubtypes: [],
      customSubtype: '',
      value: '',
      valuationMethod: 'fixed' as const,
      notes: '',
      gainPercentage: 0,
      negotiationRequested: false
    };

    const getSubtypes = () => {
      switch (type) {
        case 'financial': return financialSubtypes;
        case 'intellectual': return intellectualSubtypes;
        case 'network': return networkSubtypes;
        case 'asset': return assetSubtypes;
        default: return [];
      }
    };

    const subtypes = getSubtypes();
    const isConfigComplete = config.selectedSubtypes.length > 0 || config.customSubtype;

    const ConfigContent = () => (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            {type === 'financial' && <DollarSign className="h-5 w-5 text-primary" />}
            {type === 'intellectual' && <Brain className="h-5 w-5 text-primary" />}
            {type === 'network' && <Network className="h-5 w-5 text-primary" />}
            {type === 'asset' && <Building className="h-5 w-5 text-primary" />}
            <h3 className="text-lg font-semibold">
              {type.charAt(0).toUpperCase() + type.slice(1)} Contribution Options
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Select and configure your contribution subtypes below
          </p>
        </div>

        {/* Subtypes Selection */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Available Subtypes
          </Label>
          <div className="grid gap-3">
            {subtypes.map(subtype => (
              <div 
                key={subtype.id}
                className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  config.selectedSubtypes.includes(subtype.id) 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:shadow-sm'
                }`}
                onClick={() => handleSubtypeToggle(type, subtype.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-base mb-1">{subtype.name}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {subtype.description}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Checkbox 
                      checked={config.selectedSubtypes.includes(subtype.id)}
                      onCheckedChange={() => handleSubtypeToggle(type, subtype.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                </div>
                {config.selectedSubtypes.includes(subtype.id) && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-5 w-5 text-primary fill-current" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Subtype Input */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Custom Subtype (Optional)
          </Label>
          <Input
            placeholder="e.g., UX Design Framework, Patent Research, etc."
            value={config.customSubtype}
            onChange={(e) => updateTypeConfigField(type, 'customSubtype', e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Add your own contribution type if none of the above options fit your needs
          </p>
        </div>

        {/* Valuation Method */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Valuation Method
          </Label>
          <div className="grid gap-3">
            {[
              { value: 'fixed', label: 'Fixed Amount', desc: 'Set a specific dollar amount' },
              { value: 'formula', label: 'Custom Formula', desc: 'Use a calculation formula' },
              { value: 'rule', label: 'Custom Rule', desc: 'Define custom valuation rules' }
            ].map(method => (
              <div 
                key={method.value}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  config.valuationMethod === method.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => updateTypeConfigField(type, 'valuationMethod', method.value as 'fixed' | 'formula' | 'rule')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{method.label}</div>
                    <div className="text-sm text-muted-foreground">{method.desc}</div>
                  </div>
                  <input
                    type="radio"
                    checked={config.valuationMethod === method.value}
                    onChange={() => updateTypeConfigField(type, 'valuationMethod', method.value as 'fixed' | 'formula' | 'rule')}
                    className="text-primary focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Input Based on Method */}
        {config.valuationMethod === 'fixed' && (
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="$0.00"
              value={config.amount || ''}
              onChange={(e) => updateTypeConfigField(type, 'amount', e.target.value)}
            />
          </div>
        )}

        {config.valuationMethod === 'formula' && (
          <div className="space-y-2">
            <Label htmlFor="formula">Custom Formula</Label>
            <Textarea
              id="formula"
              placeholder="e.g., base_amount * performance_multiplier + bonus"
              value={config.formula || ''}
              onChange={(e) => updateTypeConfigField(type, 'formula', e.target.value)}
            />
          </div>
        )}

        {config.valuationMethod === 'rule' && (
          <div className="space-y-2">
            <Label htmlFor="rule">Custom Rule</Label>
            <Textarea
              id="rule"
              placeholder="Describe the valuation rule..."
              value={config.rule || ''}
              onChange={(e) => updateTypeConfigField(type, 'rule', e.target.value)}
            />
          </div>
        )}

        {/* Financial-specific fields */}
        {type === 'financial' && config.selectedSubtypes.includes('debt') && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Expected Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={config.dates?.start || ''}
                onChange={(e) => updateTypeConfigField(type, 'dates', { 
                  ...config.dates, 
                  start: e.target.value 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Expected Repayment Date</Label>
              <Input
                id="endDate"
                type="date"
                value={config.dates?.end || ''}
                onChange={(e) => updateTypeConfigField(type, 'dates', { 
                  ...config.dates, 
                  end: e.target.value 
                })}
              />
            </div>
          </div>
        )}

        {type === 'financial' && config.selectedSubtypes.includes('debt') && (
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              placeholder="5.0"
              value={config.interestRate || ''}
              onChange={(e) => updateTypeConfigField(type, 'interestRate', e.target.value)}
            />
          </div>
        )}

        {/* Expected Returns */}
        <div className="space-y-2">
          <Label htmlFor="expectedReturns">Expected Returns</Label>
          <Textarea
            id="expectedReturns"
            placeholder="Describe expected returns..."
            value={config.expectedReturns || ''}
            onChange={(e) => updateTypeConfigField(type, 'expectedReturns', e.target.value)}
          />
        </div>

        {/* Expected Gain Summary */}
        <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold text-base">Expected Gain Summary</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Base contribution:</span>
              <span className="font-medium">${config.totalValue?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expected return rate:</span>
              <span className="text-primary font-semibold">{config.gainPercentage || 12}%</span>
            </div>
            <div className="border-t border-primary/20 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Projected payout:</span>
                <span className="text-primary font-bold text-lg">
                  ${((config.totalValue || 0) * ((config.gainPercentage || 12) / 100)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Negotiation Option */}
        <div className="p-4 border-2 border-muted rounded-xl bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Handshake className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium">Request Negotiation</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Request to negotiate terms with the timeline owner
                </p>
              </div>
            </div>
            <Switch
              checked={config.negotiationRequested}
              onCheckedChange={(checked) => updateTypeConfigField(type, 'negotiationRequested', checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Add any additional details about your contribution, terms, or special requirements..."
            value={config.notes}
            onChange={(e) => updateTypeConfigField(type, 'notes', e.target.value)}
            rows={4}
            className="w-full resize-none"
          />
        </div>
      </div>
    );

    // Mobile: Bottom Drawer with full-screen on very small screens
    if (isMobile) {
      return (
        <Drawer open={showTypeConfig === type} onOpenChange={(open) => !open && setShowTypeConfig(null)}>
          <DrawerContent className="h-[95vh] max-h-[95vh] bg-background border-border z-[100] rounded-t-xl shadow-2xl">
            <DrawerHeader className="border-b border-border bg-background px-6 py-4 rounded-t-xl">
              <DrawerTitle className="text-xl font-semibold text-center">
                Configure {type.charAt(0).toUpperCase() + type.slice(1)} Contribution
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 px-6 py-4">
              <ConfigContent />
            </ScrollArea>
            <DrawerFooter className="flex-row gap-3 border-t border-border bg-background p-6">
              <Button 
                variant="outline" 
                onClick={() => setShowTypeConfig(null)} 
                className="flex-1 h-12"
                size="lg"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => saveTypeConfiguration(type)} 
                disabled={!isConfigComplete}
                className="flex-1 h-12"
                size="lg"
              >
                Save Configuration
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    // Desktop/Tablet: Modal Dialog
    return (
      <Dialog open={showTypeConfig === type} onOpenChange={(open) => !open && setShowTypeConfig(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-background border-border z-[100] shadow-2xl">
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-2xl font-semibold">
              Configure {type.charAt(0).toUpperCase() + type.slice(1)} Contribution
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="py-6">
              <ConfigContent />
            </div>
          </ScrollArea>
          <DialogFooter className="bg-background border-t border-border pt-4 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowTypeConfig(null)}
              className="min-w-[120px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => saveTypeConfiguration(type)} 
              disabled={!isConfigComplete}
              className="min-w-[120px]"
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render linked timelines modal/drawer
  const renderLinkedTimelinesModal = () => {
    const filteredTimelines = getFilteredTimelines();
    const selectedTimelines = data.linkedTimelines.filter(t => t.selected);
    const totalPercentage = selectedTimelines.reduce((sum, t) => sum + t.percentage, 0);

    const TimelinesContent = () => (
      <div className="space-y-6">
        {/* Header Info */}
        <div className="text-center pb-4 border-b">
          <p className="text-sm text-muted-foreground">
            Select timelines from your portfolio to link with this contribution. Linked timelines can contribute a percentage of their value to enhance your total contribution.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by timeline name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Timeline List */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span>Available Timelines ({filteredTimelines.length})</span>
            <span>Select & Set %</span>
          </div>
          
          <ScrollArea className={`${isMobile ? 'h-64' : 'h-80'} pr-2`}>
            <div className="space-y-3">
              {filteredTimelines.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No timelines found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
                </div>
              ) : (
                filteredTimelines.map(timeline => (
                  <div 
                    key={timeline.id}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                      timeline.selected 
                        ? 'border-primary bg-primary/10 shadow-sm' 
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Timeline Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={timeline.selected}
                            onCheckedChange={() => handleTimelineSelection(timeline.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{timeline.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {timeline.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Current Value: {timeline.value}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Percentage Input (shown when selected) */}
                      {timeline.selected && (
                        <div className="ml-7 space-y-2 pt-2 border-t border-primary/20">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Allocation Percentage</Label>
                            <span className="text-xs text-muted-foreground">Max: 100%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={timeline.percentage || ''}
                              onChange={(e) => updateTimelinePercentage(timeline.id, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="h-10"
                            />
                            <span className="text-sm font-medium">%</span>
                          </div>
                          
                          {timeline.percentage > 0 && (
                            <div className="text-sm text-primary font-medium">
                              Contribution: ${((parseFloat(timeline.value.replace(/[^0-9.]/g, '')) || 0) * timeline.percentage / 100).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Summary Section */}
        {selectedTimelines.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Selection Summary
              </h4>
              <Badge variant={totalPercentage > 100 ? "destructive" : "secondary"}>
                {selectedTimelines.length} selected
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Allocation:</span>
                <div className={`font-bold text-lg ${totalPercentage > 100 ? 'text-destructive' : 'text-primary'}`}>
                  {totalPercentage}%
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Additional Value:</span>
                <div className="font-bold text-lg text-green-600">
                  ${selectedTimelines.reduce((sum, t) => {
                    if (t.percentage > 0) {
                      const value = parseFloat(t.value.replace(/[^0-9.]/g, '')) || 0;
                      return sum + (value * t.percentage / 100);
                    }
                    return sum;
                  }, 0).toLocaleString()}
                </div>
              </div>
            </div>
            
            {totalPercentage > 100 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Warning: Total allocation exceeds 100%</span>
                </div>
                <p className="text-xs text-destructive/80 mt-1">
                  Please adjust your percentages to stay within the allowed limits.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );

    // Mobile Implementation with Bottom Drawer
    if (isMobile) {
      return (
        <Drawer open={showLinkedTimelines} onOpenChange={setShowLinkedTimelines}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="text-left">
              <DrawerTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Link/Merge Timelines
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 flex-1 overflow-hidden">
              <TimelinesContent />
            </div>
            <DrawerFooter className="flex-row gap-3 px-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLinkedTimelines(false)} 
                className="flex-1"
                disabled={totalPercentage > 100}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveLinkedTimelines} 
                className="flex-1"
                disabled={totalPercentage > 100}
              >
                <Check className="h-4 w-4 mr-2" />
                Save Links
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    // Desktop Implementation with Modal Dialog
    return (
      <Dialog open={showLinkedTimelines} onOpenChange={setShowLinkedTimelines}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Link/Merge Timelines
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <TimelinesContent />
          </div>
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowLinkedTimelines(false)}
              disabled={totalPercentage > 100}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveLinkedTimelines}
              disabled={totalPercentage > 100}
            >
              <Check className="h-4 w-4 mr-2" />
              Save Links
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Access Check
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Access Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.timeline ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold">{data.timeline.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{data.timeline.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="secondary">{data.timeline.type}</Badge>
                      <span className="text-sm">Created: {data.timeline.createdAt}</span>
                    </div>
                  </div>
                  
                  {data.accessGranted ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                      <Check className="h-4 w-4" />
                      <span className="font-medium">Access Granted</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg">
                      <p className="font-medium">Access Pending</p>
                      <p className="text-sm mt-1">Please contact the timeline owner for access.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Timeline not found</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2: // Expected Outcomes
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Expected Outcomes Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* What to Give */}
              <div className="space-y-3">
                <Label className="text-base font-medium">What I Plan to Give</Label>
                <div className="grid grid-cols-2 gap-2">
                  {outcomeOptions.map(outcome => (
                    <div 
                      key={outcome}
                      className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                        data.expectedOutcomes.toGive.includes(outcome) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleOutcomeToggle(outcome, 'toGive')}
                    >
                      {outcome}
                    </div>
                  ))}
                </div>
                
                {/* Custom outcomes for giving */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom outcome..."
                      value={newCustomOutcome.toGive}
                      onChange={(e) => setNewCustomOutcome(prev => ({ ...prev, toGive: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomOutcome('toGive')}
                    />
                    <Button 
                      onClick={() => handleAddCustomOutcome('toGive')}
                      disabled={!newCustomOutcome.toGive.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {data.expectedOutcomes.customToGive.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data.expectedOutcomes.customToGive.map((outcome, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {outcome}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveCustomOutcome(index, 'toGive')}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* What to Receive */}
              <div className="space-y-3">
                <Label className="text-base font-medium">What I Expect to Receive</Label>
                <div className="grid grid-cols-2 gap-2">
                  {outcomeOptions.map(outcome => (
                    <div 
                      key={outcome}
                      className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                        data.expectedOutcomes.toReceive.includes(outcome) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleOutcomeToggle(outcome, 'toReceive')}
                    >
                      {outcome}
                    </div>
                  ))}
                </div>
                
                {/* Custom outcomes for receiving */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom outcome..."
                      value={newCustomOutcome.toReceive}
                      onChange={(e) => setNewCustomOutcome(prev => ({ ...prev, toReceive: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomOutcome('toReceive')}
                    />
                    <Button 
                      onClick={() => handleAddCustomOutcome('toReceive')}
                      disabled={!newCustomOutcome.toReceive.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {data.expectedOutcomes.customToReceive.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data.expectedOutcomes.customToReceive.map((outcome, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {outcome}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveCustomOutcome(index, 'toReceive')}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3: // Contribution Types
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Configure Contribution Types & Subtypes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Financial Contributions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base font-medium">Financial Contribution</Label>
                      <p className="text-sm text-muted-foreground">Cash, debt, or pledge contributions</p>
                    </div>
                  </div>
                  <Switch
                    checked={data.contributionTypes.financial.enabled}
                    onCheckedChange={() => handleContributionTypeToggle('financial')}
                  />
                </div>
                
                {data.contributionTypes.financial.enabled && (
                  <div className="ml-7 space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTypeConfig('financial')}
                      className="w-full justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Financial Subtypes
                    </Button>
                    
                    {/* Financial Summary */}
                    {data.contributionTypes.financial.subtypes.length > 0 && (
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">Financial Contribution Summary</h4>
                        {data.contributionTypes.financial.subtypes.map((subtype, index) => (
                          <div key={index} className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Subtypes:</span>
                              <span>{subtype.selectedSubtypes.join(', ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Amount:</span>
                              <span>{subtype.amount || subtype.value}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expected Gain:</span>
                              <span className="text-primary font-medium">{subtype.gainPercentage}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Method:</span>
                              <span className="capitalize">{subtype.valuationMethod}</span>
                            </div>
                            {subtype.negotiationRequested && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <Handshake className="h-3 w-3" />
                                <span>Negotiation Requested</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Intellectual Contributions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base font-medium">Intellectual Contribution</Label>
                      <p className="text-sm text-muted-foreground">Ideas, research, code, consultations</p>
                    </div>
                  </div>
                  <Switch
                    checked={data.contributionTypes.intellectual.enabled}
                    onCheckedChange={() => handleContributionTypeToggle('intellectual')}
                  />
                </div>
                
                {data.contributionTypes.intellectual.enabled && (
                  <div className="ml-7 space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTypeConfig('intellectual')}
                      className="w-full justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Intellectual Subtypes
                    </Button>
                    
                    {/* Intellectual Summary */}
                    {data.contributionTypes.intellectual.subtypes.length > 0 && (
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">Intellectual Contribution Summary</h4>
                        {data.contributionTypes.intellectual.subtypes.map((subtype, index) => (
                          <div key={index} className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Subtypes:</span>
                              <span>{subtype.selectedSubtypes.join(', ')}</span>
                            </div>
                            {subtype.customSubtype && (
                              <div className="flex justify-between">
                                <span>Custom:</span>
                                <span>{subtype.customSubtype}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Expected Gain:</span>
                              <span className="text-primary font-medium">{subtype.gainPercentage}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Method:</span>
                              <span className="capitalize">{subtype.valuationMethod}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Network/Marketing Contributions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base font-medium">Network/Marketing Contribution</Label>
                      <p className="text-sm text-muted-foreground">Referrals, leads, traffic, social engagement</p>
                    </div>
                  </div>
                  <Switch
                    checked={data.contributionTypes.network.enabled}
                    onCheckedChange={() => handleContributionTypeToggle('network')}
                  />
                </div>
                
                {data.contributionTypes.network.enabled && (
                  <div className="ml-7 space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTypeConfig('network')}
                      className="w-full justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Network Subtypes
                    </Button>
                    
                    {/* Network Summary */}
                    {data.contributionTypes.network.subtypes.length > 0 && (
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">Network/Marketing Summary</h4>
                        {data.contributionTypes.network.subtypes.map((subtype, index) => (
                          <div key={index} className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Subtypes:</span>
                              <span>{subtype.selectedSubtypes.join(', ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expected Gain:</span>
                              <span className="text-primary font-medium">{subtype.gainPercentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Asset Contributions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base font-medium">Asset Contribution</Label>
                      <p className="text-sm text-muted-foreground">Equipment, property, software, digital assets</p>
                    </div>
                  </div>
                  <Switch
                    checked={data.contributionTypes.asset.enabled}
                    onCheckedChange={() => handleContributionTypeToggle('asset')}
                  />
                </div>
                
                {data.contributionTypes.asset.enabled && (
                  <div className="ml-7 space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTypeConfig('asset')}
                      className="w-full justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Asset Subtypes
                    </Button>
                    
                    {/* Asset Summary */}
                    {data.contributionTypes.asset.subtypes.length > 0 && (
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2">Asset Contribution Summary</h4>
                        {data.contributionTypes.asset.subtypes.map((subtype, index) => (
                          <div key={index} className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Subtypes:</span>
                              <span>{subtype.selectedSubtypes.join(', ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expected Gain:</span>
                              <span className="text-primary font-medium">{subtype.gainPercentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 4: // Link Timelines
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Link/Merge Timelines
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Connect other timelines from your portfolio to enhance this contribution's value through strategic linking.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instructions */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 text-white rounded-lg">
                    <Link className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Timeline Linking Benefits</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Cross-timeline value amplification</li>
                      <li>• Percentage-based contribution allocation</li>
                      <li>• Dynamic valuation updates</li>
                      <li>• Portfolio synergy enhancement</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Main Action Button */}
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowLinkedTimelines(true)}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Link className="h-5 w-5 mr-2" />
                  Select Timelines to Link
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  Choose from {data.linkedTimelines.length} available timelines in your portfolio
                </p>
              </div>

              {/* Linked Timelines Summary */}
              {data.linkedTimelines.some(t => t.selected) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Linked Timelines Summary
                    </h4>
                    <Badge variant="secondary" className="px-3 py-1">
                      {data.linkedTimelines.filter(t => t.selected).length} linked
                    </Badge>
                  </div>
                  
                  <div className="grid gap-3">
                    {data.linkedTimelines
                      .filter(t => t.selected)
                      .map(timeline => (
                        <div key={timeline.id} className="p-4 border-2 border-primary/20 bg-primary/5 rounded-xl">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-foreground">{timeline.name}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {timeline.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Base Value: {timeline.value}
                              </p>
                            </div>
                            <div className="flex flex-col sm:text-right gap-1">
                              <div className="flex items-center gap-2 sm:justify-end">
                                <Percent className="h-4 w-4 text-primary" />
                                <span className="font-bold text-primary">{timeline.percentage}%</span>
                                <span className="text-sm text-muted-foreground">allocation</span>
                              </div>
                              {timeline.percentage > 0 && (
                                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                  +${((parseFloat(timeline.value.replace(/[^0-9.]/g, '')) || 0) * timeline.percentage / 100).toLocaleString()} contribution
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Timeline Preview */}
                          <div className="mt-3 pt-3 border-t border-primary/10">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Timeline Status: Active</span>
                              <span>Last Updated: Today</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  {/* Total Summary Card */}
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-lg">Total Linked Value</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${data.linkedTimelines
                            .filter(t => t.selected && t.percentage > 0)
                            .reduce((sum, t) => {
                              const value = parseFloat(t.value.replace(/[^0-9.]/g, '')) || 0;
                              return sum + (value * t.percentage / 100);
                            }, 0)
                            .toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          from {data.linkedTimelines.filter(t => t.selected).length} linked timeline(s)
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Allocation</span>
                        <span>{data.linkedTimelines.filter(t => t.selected).reduce((sum, t) => sum + t.percentage, 0)}%</span>
                      </div>
                      <Progress 
                        value={data.linkedTimelines.filter(t => t.selected).reduce((sum, t) => sum + t.percentage, 0)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowLinkedTimelines(true)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Links
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setData(prev => ({
                          ...prev,
                          linkedTimelines: prev.linkedTimelines.map(t => ({ ...t, selected: false, percentage: 0 }))
                        }));
                        toast.success('All timeline links cleared');
                      }}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {!data.linkedTimelines.some(t => t.selected) && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Link className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-lg mb-2">No Timelines Linked Yet</h4>
                  <p className="text-muted-foreground mb-4">
                    Start by selecting timelines from your portfolio to amplify your contribution value.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLinkedTimelines(true)}
                  >
                    Browse Available Timelines
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 5: // Custom Inputs
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Capture Custom Contribution Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Required Fields */}
              <div className="space-y-4">
                <h4 className="font-medium">Required Information</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Contribution title..."
                      value={data.customInputs.title}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        customInputs: { ...prev.customInputs, title: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your contribution..."
                      rows={3}
                      value={data.customInputs.description}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        customInputs: { ...prev.customInputs, description: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="context">Context *</Label>
                    <Textarea
                      id="context"
                      placeholder="Provide context for your contribution..."
                      rows={3}
                      value={data.customInputs.context}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        customInputs: { ...prev.customInputs, context: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Input Methods */}
              <div className="space-y-4">
                <h4 className="font-medium">Choose Input Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => setShowCustomInputs('manual')}
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-sm font-medium">Manual Entry</span>
                    <span className="text-xs text-muted-foreground">Fill forms manually</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => setShowCustomInputs('api')}
                  >
                    <Network className="h-6 w-6" />
                    <span className="text-sm font-medium">API Connection</span>
                    <span className="text-xs text-muted-foreground">Connect external APIs</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => setShowCustomInputs('excel')}
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm font-medium">Excel Import</span>
                    <span className="text-xs text-muted-foreground">Import from spreadsheet</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => setShowCustomInputs('ai')}
                  >
                    <Zap className="h-6 w-6" />
                    <span className="text-sm font-medium">AI Generated</span>
                    <span className="text-xs text-muted-foreground">Auto-generate inputs</span>
                  </Button>
                </div>
              </div>

              {/* Current Input Summary */}
              {data.customInputs.inputMethod && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Current Input Method</h5>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowCustomInputs(data.customInputs.inputMethod)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {data.customInputs.inputMethod} - 
                    {data.customInputs.inputMethod === 'manual' && ' Form-based data entry'}
                    {data.customInputs.inputMethod === 'api' && ' External API integration'}
                    {data.customInputs.inputMethod === 'excel' && ' Spreadsheet import'}
                    {data.customInputs.inputMethod === 'ai' && ' AI-generated content'}
                  </p>
                  {data.customInputs.additionalData && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {Object.keys(data.customInputs.additionalData).length} additional fields configured
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 6: // Attachments
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Files & Attachments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Drop files here or click to upload</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Support for documents, images, audio, and video files
                </p>
                <Button>Choose Files</Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm">Images</span>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm">Documents</span>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <FileAudio className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm">Audio</span>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <FileVideo className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm">Video</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 7: // Presentation Template
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Presentation Template Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Choose how your contribution will be displayed.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    data.presentationTemplate === 'table' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, presentationTemplate: 'table' }))}
                >
                  <h4 className="font-medium mb-2">Table View</h4>
                  <p className="text-sm text-muted-foreground">Structured data in rows and columns</p>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    data.presentationTemplate === 'list' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, presentationTemplate: 'list' }))}
                >
                  <h4 className="font-medium mb-2">List Items</h4>
                  <p className="text-sm text-muted-foreground">Sequential list format</p>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    data.presentationTemplate === 'cards' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, presentationTemplate: 'cards' }))}
                >
                  <h4 className="font-medium mb-2">Card Layout</h4>
                  <p className="text-sm text-muted-foreground">Visual cards with key information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 8: // Sub-Contributions
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configure Sub-Contributions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Enable Sub-Contributions</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to build on this contribution
                  </p>
                </div>
                <Switch
                  checked={data.subContributions.enabled}
                  onCheckedChange={(checked) => setData(prev => ({
                    ...prev,
                    subContributions: { ...prev.subContributions, enabled: checked }
                  }))}
                />
              </div>

              {data.subContributions.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Access Level</Label>
                      <Select
                        value={data.subContributions.config.accessLevel}
                        onValueChange={(value) => setData(prev => ({
                          ...prev,
                          subContributions: {
                            ...prev.subContributions,
                            config: { ...prev.subContributions.config, accessLevel: value }
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="members">Members Only</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Outcome Sharing Mode</Label>
                      <Select
                        value={data.subContributions.config.outcomeSharing.mode}
                        onValueChange={(value) => setData(prev => ({
                          ...prev,
                          subContributions: {
                            ...prev.subContributions,
                            config: {
                              ...prev.subContributions.config,
                              outcomeSharing: { ...prev.subContributions.config.outcomeSharing, mode: value }
                            }
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent-child">Parent → Child</SelectItem>
                          <SelectItem value="child-parent">Child → Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Additional Features</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Custom Ratings (0-10 scale)</Label>
                        <Switch
                          checked={data.subContributions.config.customRatings}
                          onCheckedChange={(checked) => setData(prev => ({
                            ...prev,
                            subContributions: {
                              ...prev.subContributions,
                              config: { ...prev.subContributions.config, customRatings: checked }
                            }
                          }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Follow-up Workflows</Label>
                        <Switch
                          checked={data.subContributions.config.followUpWorkflows}
                          onCheckedChange={(checked) => setData(prev => ({
                            ...prev,
                            subContributions: {
                              ...prev.subContributions,
                              config: { ...prev.subContributions.config, followUpWorkflows: checked }
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 9: // Review & Submit
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                Review & Submit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Contribution Summary</h4>
                
                {/* Timeline Info */}
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium">Timeline: {data.timeline?.title}</h5>
                  <p className="text-sm text-muted-foreground">{data.timeline?.description}</p>
                </div>

                {/* Expected Outcomes */}
                {(data.expectedOutcomes.toGive.length > 0 || data.expectedOutcomes.toReceive.length > 0) && (
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Expected Outcomes</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">To Give:</span>
                        <ul className="list-disc list-inside">
                          {[...data.expectedOutcomes.toGive, ...data.expectedOutcomes.customToGive].map((outcome, i) => (
                            <li key={i}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">To Receive:</span>
                        <ul className="list-disc list-inside">
                          {[...data.expectedOutcomes.toReceive, ...data.expectedOutcomes.customToReceive].map((outcome, i) => (
                            <li key={i}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contribution Types */}
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Contribution Types</h5>
                  <div className="space-y-2">
                    {Object.entries(data.contributionTypes).map(([type, config]) => 
                      config.enabled && (
                        <div key={type} className="flex items-center gap-2">
                          <Badge variant="secondary">{type}</Badge>
                          {config.subtypes.length > 0 && (
                            <span className="text-sm text-muted-foreground">
                              ({config.subtypes[0].selectedSubtypes.join(', ')})
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Linked Timelines */}
                {data.linkedTimelines.some(t => t.selected) && (
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Linked Timelines</h5>
                    <div className="space-y-1">
                      {data.linkedTimelines.filter(t => t.selected).map(timeline => (
                        <div key={timeline.id} className="flex justify-between text-sm">
                          <span>{timeline.name}</span>
                          <span>{timeline.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Financial Value */}
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h5 className="font-medium">Total Estimated Value</h5>
                  <div className="text-2xl font-bold text-primary">
                    ${Object.values(typeConfigData).reduce((sum, config) => {
                      const baseValue = parseFloat((config.amount || config.value || '0').replace(/[^0-9.]/g, '')) || 0;
                      const linkedValue = config.linkedValue || 0;
                      return sum + baseValue + linkedValue;
                    }, 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button className="flex-1" onClick={() => {
                  toast.success('Contribution submitted successfully!');
                  navigate('/portfolio');
                }}>
                  Submit Contribution
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (!data.timeline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Timeline Not Found</h1>
          <Button onClick={() => navigate('/portfolio')}>
            Return to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/portfolio')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolio
              </Button>
              <div>
                <h1 className="text-xl font-semibold">ShonaCoin Contribution</h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      {!isMobile && (
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <ScrollArea className="w-full">
              <div className="flex gap-6">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.id} className="flex items-center gap-2 whitespace-nowrap">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        isCompleted ? 'bg-primary text-primary-foreground' :
                        isActive ? 'bg-primary/20 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {renderStep()}
          
          {/* Navigation */}
          <div className="flex justify-between mt-6">
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
        </div>
      </div>

      {/* Modals */}
      {renderTypeConfigModal('financial')}
      {renderTypeConfigModal('intellectual')}
      {renderTypeConfigModal('network')}
      {renderTypeConfigModal('asset')}
      {renderLinkedTimelinesModal()}
    </div>
  );
}