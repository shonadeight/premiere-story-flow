import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  Handshake
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
    linkedTimelines: [
      { id: '1', name: 'Solar Energy Project', type: 'financial', value: '$25,000', percentage: 0, selected: false },
      { id: '2', name: 'Marketing Campaign Q1', type: 'network', value: '$8,500', percentage: 0, selected: false },
      { id: '3', name: 'Research & Development', type: 'intellectual', value: '$15,000', percentage: 0, selected: false },
      { id: '4', name: 'Community Outreach', type: 'network', value: '$5,200', percentage: 0, selected: false },
      { id: '5', name: 'Tech Infrastructure', type: 'asset', value: '$18,000', percentage: 0, selected: false },
    ],
    customInputs: {
      title: '',
      description: '',
      context: '',
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
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Configure {type.charAt(0).toUpperCase() + type.slice(1)} Contribution
          </h3>
        </div>

        {/* Subtypes Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Subtypes</Label>
          <div className="grid grid-cols-1 gap-2">
            {subtypes.map(subtype => (
              <div 
                key={subtype.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  config.selectedSubtypes.includes(subtype.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleSubtypeToggle(type, subtype.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{subtype.name}</div>
                    <div className="text-sm text-muted-foreground">{subtype.description}</div>
                  </div>
                  <Checkbox 
                    checked={config.selectedSubtypes.includes(subtype.id)}
                    onCheckedChange={() => handleSubtypeToggle(type, subtype.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Subtype Input */}
        {config.selectedSubtypes.includes('custom') && (
          <div className="space-y-2">
            <Label htmlFor="customSubtype">Custom Subtype</Label>
            <Input
              id="customSubtype"
              placeholder="e.g., UX Design Framework"
              value={config.customSubtype}
              onChange={(e) => updateTypeConfigField(type, 'customSubtype', e.target.value)}
            />
          </div>
        )}

        {/* Valuation Method */}
        <div className="space-y-2">
          <Label>Valuation Method</Label>
          <Select 
            value={config.valuationMethod} 
            onValueChange={(value) => updateTypeConfigField(type, 'valuationMethod', value as 'fixed' | 'formula' | 'rule')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="fixed">Fixed Amount</SelectItem>
              <SelectItem value="formula">Custom Formula</SelectItem>
              <SelectItem value="rule">Custom Rule</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Gain Summary */}
        {config.gainPercentage > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-primary" />
              <span className="font-medium">Expected Gain Summary</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Based on parent timeline rate and your contribution: <strong>{config.gainPercentage}%</strong>
            </div>
          </div>
        )}

        {/* Negotiation Option */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            <span className="font-medium">Request Negotiation</span>
          </div>
          <Switch
            checked={config.negotiationRequested}
            onCheckedChange={(checked) => updateTypeConfigField(type, 'negotiationRequested', checked)}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional details..."
            value={config.notes}
            onChange={(e) => updateTypeConfigField(type, 'notes', e.target.value)}
          />
        </div>
      </div>
    );

    if (isMobile) {
      return (
        <Drawer open={showTypeConfig === type} onOpenChange={(open) => !open && setShowTypeConfig(null)}>
          <DrawerContent className="h-[95vh] max-h-[95vh] bg-background border-border z-50">
            <DrawerHeader className="border-b">
              <DrawerTitle>Configure {type.charAt(0).toUpperCase() + type.slice(1)} Contribution</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 px-4 py-6">
              <ConfigContent />
            </ScrollArea>
            <DrawerFooter className="flex-row gap-2 border-t bg-background">
              <Button variant="outline" onClick={() => setShowTypeConfig(null)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => saveTypeConfiguration(type)} 
                disabled={!isConfigComplete}
                className="flex-1"
              >
                Save Configuration
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={showTypeConfig === type} onOpenChange={(open) => !open && setShowTypeConfig(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden bg-background border-border z-50">
          <DialogHeader>
            <DialogTitle>Configure {type.charAt(0).toUpperCase() + type.slice(1)} Contribution</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[75vh] pr-6">
            <div className="space-y-6 pb-6">
              <ConfigContent />
            </div>
          </ScrollArea>
          <DialogFooter className="bg-background border-t pt-4">
            <Button variant="outline" onClick={() => setShowTypeConfig(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => saveTypeConfiguration(type)} 
              disabled={!isConfigComplete}
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
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search timelines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Timeline List */}
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {filteredTimelines.map(timeline => (
              <div 
                key={timeline.id}
                className={`p-3 border rounded-lg ${
                  timeline.selected ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={timeline.selected}
                      onCheckedChange={() => handleTimelineSelection(timeline.id)}
                    />
                    <div>
                      <div className="font-medium">{timeline.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {timeline.type} • {timeline.value}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{timeline.type}</Badge>
                </div>
                
                {timeline.selected && (
                  <div className="space-y-2">
                    <Label className="text-sm">Percentage Allocation (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={timeline.percentage}
                      onChange={(e) => updateTimelinePercentage(timeline.id, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Summary */}
        {selectedTimelines.length > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Selected Timelines: {selectedTimelines.length}</span>
              <span className={`font-medium ${totalPercentage > 100 ? 'text-destructive' : 'text-primary'}`}>
                Total: {totalPercentage}%
              </span>
            </div>
            {totalPercentage > 100 && (
              <div className="text-sm text-destructive">
                Warning: Total percentage exceeds 100%
              </div>
            )}
          </div>
        )}
      </div>
    );

    if (isMobile) {
      return (
        <Drawer open={showLinkedTimelines} onOpenChange={setShowLinkedTimelines}>
          <DrawerContent className="h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>Link/Merge Timelines</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 flex-1">
              <TimelinesContent />
            </div>
            <DrawerFooter className="flex-row gap-2">
              <Button variant="outline" onClick={() => setShowLinkedTimelines(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveLinkedTimelines} className="flex-1">
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={showLinkedTimelines} onOpenChange={setShowLinkedTimelines}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Link/Merge Timelines</DialogTitle>
          </DialogHeader>
          <TimelinesContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkedTimelines(false)}>
              Cancel
            </Button>
            <Button onClick={saveLinkedTimelines}>
              Save
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Link/Merge Timelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Link other timelines from your portfolio to enhance this contribution's value.
              </p>
              
              <Button 
                onClick={() => setShowLinkedTimelines(true)}
                className="w-full"
              >
                <Link className="h-4 w-4 mr-2" />
                Select Timelines to Link
              </Button>

              {/* Linked Timelines Summary */}
              {data.linkedTimelines.some(t => t.selected) && (
                <div className="space-y-3">
                  <h4 className="font-medium">Linked Timelines Summary</h4>
                  {data.linkedTimelines
                    .filter(t => t.selected)
                    .map(timeline => (
                      <div key={timeline.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{timeline.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {timeline.type} • {timeline.value}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{timeline.percentage}%</div>
                            <div className="text-xs text-muted-foreground">allocation</div>
                          </div>
                        </div>
                        {timeline.percentage > 0 && (
                          <div className="mt-2 text-sm text-primary">
                            Additional value: ${((parseFloat(timeline.value.replace(/[^0-9.]/g, '')) || 0) * timeline.percentage / 100).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Total linked value:</span>
                      <span className="font-medium">
                        ${data.linkedTimelines
                          .filter(t => t.selected && t.percentage > 0)
                          .reduce((sum, t) => {
                            const value = parseFloat(t.value.replace(/[^0-9.]/g, '')) || 0;
                            return sum + (value * t.percentage / 100);
                          }, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
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
                Capture Custom Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
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
                    value={data.customInputs.context}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      customInputs: { ...prev.customInputs, context: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Input Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Manual Entry</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Network className="h-6 w-6" />
                    <span>API Connection</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Excel Import</span>
                  </Button>
                </div>
              </div>
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