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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  MessageSquare,
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
  Camera,
  Mic,
  X,
  Plus,
  Trash2,
  Edit
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
  const [showSubConfig, setShowSubConfig] = useState(false);
  const [newCustomOutcome, setNewCustomOutcome] = useState({ toGive: '', toReceive: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [typeConfigData, setTypeConfigData] = useState<{
    [key: string]: {
      selectedSubtypes: string[];
      customSubtype: string;
      value: string;
      valuationMethod: string;
      notes: string;
      gainPercentage: number;
      negotiationRequested: boolean;
      amount?: string;
      dates?: { start: string; end: string };
      interestRate?: string;
      expectedReturns?: string;
    }
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
    { id: 'code', name: 'Code', description: 'Software development' },
    { id: 'consultations', name: 'Consultations', description: 'Expert advisory services' },
    { id: 'custom', name: 'Custom', description: 'Other intellectual contributions' }
  ];

  const networkSubtypes = [
    { id: 'introductions', name: 'Introductions', description: 'Professional introductions' },
    { id: 'referrals', name: 'Referrals', description: 'Customer referrals' },
    { id: 'leads', name: 'Leads', description: 'Sales leads generation' },
    { id: 'traffic', name: 'Traffic', description: 'Website/app traffic' },
    { id: 'likes', name: 'Likes', description: 'Social media engagement' },
    { id: 'comments', name: 'Comments', description: 'User engagement' },
    { id: 'views', name: 'Views', description: 'Content views' },
    { id: 'downloads', name: 'Downloads', description: 'App/content downloads' },
    { id: 'custom', name: 'Custom', description: 'Other network contributions' }
  ];

  const assetSubtypes = [
    { id: 'equipment', name: 'Equipment', description: 'Machinery and tools' },
    { id: 'property', name: 'Property', description: 'Real estate and property' },
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

  const handleSubtypeToggle = (type: string, subtypeId: string) => {
    setTypeConfigData(prev => {
      const currentData = prev[type] || {
        selectedSubtypes: [],
        customSubtype: '',
        value: '',
        valuationMethod: 'fixed',
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

  const updateTypeConfigField = (type: string, field: string, value: any) => {
    setTypeConfigData(prev => ({
      ...prev,
      [type]: {
        ...(prev[type] || {
          selectedSubtypes: [],
          customSubtype: '',
          value: '',
          valuationMethod: 'fixed',
          notes: '',
          gainPercentage: 0,
          negotiationRequested: false
        }),
        [field]: value
      }
    }));
  };

  const calculateGainPercentage = (type: string) => {
    // Simple calculation based on expected outcomes
    const totalOutcomes = data.expectedOutcomes.toReceive.length + data.expectedOutcomes.customToReceive.length;
    const typeConfig = typeConfigData[type];
    if (!typeConfig || !typeConfig.value) return 0;
    
    const basePercentage = Math.min(totalOutcomes * 2, 15); // Max 15%
    const valueMultiplier = parseFloat(typeConfig.value.replace(/[^0-9.]/g, '')) > 10000 ? 1.5 : 1;
    return Math.round(basePercentage * valueMultiplier * 100) / 100;
  };

  const saveTypeConfiguration = (type: string) => {
    const config = typeConfigData[type];
    if (config && (config.selectedSubtypes.length > 0 || config.customSubtype)) {
      // Update gain percentage before saving
      const gainPercentage = calculateGainPercentage(type);
      updateTypeConfigField(type, 'gainPercentage', gainPercentage);
      
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
      
      toast.success(`${type} contribution configured successfully!`);
    }
    setShowTypeConfig(null);
  };

  const handleTimelineSelection = (timelineId: string) => {
    setData(prev => ({
      ...prev,
      linkedTimelines: prev.linkedTimelines.map(t => 
        t.id === timelineId 
          ? { ...t, selected: !t.selected }
          : t
      )
    }));
  };

  const updateTimelinePercentage = (timelineId: string, percentage: number) => {
    setData(prev => ({
      ...prev,
      linkedTimelines: prev.linkedTimelines.map(t => 
        t.id === timelineId 
          ? { ...t, percentage }
          : t
      )
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const attachment = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      
      setData(prev => ({
        ...prev,
        attachments: [...prev.attachments, attachment]
      }));
    });
    
    toast.success(`${files.length} file(s) uploaded successfully!`);
  };

  const removeAttachment = (attachmentId: string) => {
    setData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  const addCustomField = () => {
    setData(prev => ({
      ...prev,
      customInputs: {
        ...prev.customInputs,
        additionalFields: [
          ...prev.customInputs.additionalFields,
          { label: '', value: '', type: 'text' }
        ]
      }
    }));
  };

  const updateCustomField = (index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      customInputs: {
        ...prev.customInputs,
        additionalFields: prev.customInputs.additionalFields.map((f, i) => 
          i === index ? { ...f, [field]: value } : f
        )
      }
    }));
  };

  const removeCustomField = (index: number) => {
    setData(prev => ({
      ...prev,
      customInputs: {
        ...prev.customInputs,
        additionalFields: prev.customInputs.additionalFields.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = () => {
    toast.success('Contribution submitted successfully!');
    navigate(`/timeline/${timelineId}`);
  };

  // Mock timeline data for linking
  const availableTimelines = mockTimelines.filter(t => t.id !== timelineId).map(t => ({
    id: t.id,
    name: t.title,
    percentage: 0,
    selected: false
  }));

  useEffect(() => {
    if (data.linkedTimelines.length === 0) {
      setData(prev => ({ ...prev, linkedTimelines: availableTimelines }));
    }
  }, []);

  const renderTypeConfigModal = (type: string, subtypes: any[]) => {
    const currentConfig = typeConfigData[type] || {
      selectedSubtypes: [],
      customSubtype: '',
      value: '',
      valuationMethod: 'fixed',
      notes: '',
      gainPercentage: 0,
      negotiationRequested: false,
      amount: '',
      dates: { start: '', end: '' },
      interestRate: '',
      expectedReturns: ''
    };
    
    const ConfigContent = (
      <div className="space-y-4 max-h-[80vh] overflow-y-auto">
        {/* Subtype Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Select Contribution Subtypes</Label>
          <div className="grid gap-2">
            {subtypes.map(subtype => (
              <Card 
                key={subtype.id} 
                className={`cursor-pointer transition-colors ${
                  currentConfig.selectedSubtypes.includes(subtype.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSubtypeToggle(type, subtype.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{subtype.name}</h4>
                      <p className="text-sm text-muted-foreground">{subtype.description}</p>
                    </div>
                    <Checkbox 
                      checked={currentConfig.selectedSubtypes.includes(subtype.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Subtype */}
        <div>
          <Label className="text-sm font-medium">Custom Subtype (Optional)</Label>
          <Input 
            placeholder={type === 'intellectual' ? "e.g., UX Design Framework, Technical Analysis..." : "e.g., Custom contribution type..."}
            value={currentConfig.customSubtype}
            onChange={(e) => updateTypeConfigField(type, 'customSubtype', e.target.value)}
          />
          {currentConfig.customSubtype && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Custom subtype "{currentConfig.customSubtype}" will be included
            </p>
          )}
        </div>
        
        {/* Valuation Section */}
        <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
          <h4 className="font-medium">Valuation & Terms</h4>
          
          <div>
            <Label>Contribution Value/Amount</Label>
            <Input 
              placeholder={type === 'financial' ? "Enter monetary amount (e.g., $10,000)" : "Enter value or quantity"}
              value={currentConfig.value}
              onChange={(e) => updateTypeConfigField(type, 'value', e.target.value)}
            />
          </div>

          {/* Financial-specific fields */}
          {type === 'financial' && currentConfig.selectedSubtypes.length > 0 && (
            <div className="space-y-3 p-3 border rounded-lg bg-blue-50">
              <h5 className="font-medium text-sm">Financial Terms</h5>
              
              {currentConfig.selectedSubtypes.includes('debt') && (
                <>
                  <div>
                    <Label className="text-xs">Interest Rate (%)</Label>
                    <Input 
                      placeholder="e.g., 5.5"
                      value={currentConfig.interestRate}
                      onChange={(e) => updateTypeConfigField(type, 'interestRate', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Start Date</Label>
                      <Input 
                        type="date"
                        value={currentConfig.dates?.start || ''}
                        onChange={(e) => updateTypeConfigField(type, 'dates', { 
                          ...currentConfig.dates, 
                          start: e.target.value 
                        })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">End Date</Label>
                      <Input 
                        type="date"
                        value={currentConfig.dates?.end || ''}
                        onChange={(e) => updateTypeConfigField(type, 'dates', { 
                          ...currentConfig.dates, 
                          end: e.target.value 
                        })}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <Label className="text-xs">Expected Returns</Label>
                <Input 
                  placeholder="e.g., 15% annual return"
                  value={currentConfig.expectedReturns}
                  onChange={(e) => updateTypeConfigField(type, 'expectedReturns', e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div>
            <Label>Valuation Method</Label>
            <Select 
              value={currentConfig.valuationMethod}
              onValueChange={(value) => updateTypeConfigField(type, 'valuationMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Value</SelectItem>
                <SelectItem value="negotiable">Negotiable</SelectItem>
                <SelectItem value="formula">Custom Formula</SelectItem>
                <SelectItem value="market">Market Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gain Summary */}
          {currentConfig.value && (
            <div className="p-2 bg-green-50 border border-green-200 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Expected Gain %:</span>
                <span className="text-green-600 font-bold">
                  {calculateGainPercentage(type)}%
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Based on your expected outcomes from Step 2
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={currentConfig.negotiationRequested}
              onCheckedChange={(checked) => updateTypeConfigField(type, 'negotiationRequested', checked)}
            />
            <Label className="text-sm">Request negotiation with parent timeline owner</Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => setShowTypeConfig(null)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => saveTypeConfiguration(type)}
            className="flex-1"
            disabled={!currentConfig.selectedSubtypes.length && !currentConfig.customSubtype}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    );

    if (isMobile) {
      return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTypeConfig(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold">Configure {type} Contribution</h2>
            </div>
            {ConfigContent}
          </div>
        </div>
      );
    }

    return (
      <Dialog open={!!showTypeConfig} onOpenChange={() => setShowTypeConfig(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure {type} Contribution</DialogTitle>
          </DialogHeader>
          {ConfigContent}
        </DialogContent>
      </Dialog>
    );
  };

  const renderLinkedTimelinesModal = () => {
    const filteredTimelines = data.linkedTimelines.filter(timeline =>
      timeline.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const LinkedTimelinesContent = (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Search Timelines</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search from your portfolio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredTimelines.map(timeline => (
            <Card 
              key={timeline.id}
              className={`cursor-pointer transition-colors ${
                timeline.selected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={timeline.selected}
                      onCheckedChange={() => handleTimelineSelection(timeline.id)}
                    />
                    <span className="font-medium">{timeline.name}</span>
                  </div>
                  {timeline.selected && (
                    <div className="flex items-center space-x-2">
                      <Label className="text-xs">%</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={timeline.percentage}
                        onChange={(e) => updateTimelinePercentage(timeline.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-xs"
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => setShowLinkedTimelines(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setShowLinkedTimelines(false);
              toast.success('Timeline linkages saved!');
            }}
            className="flex-1"
          >
            Save Linkages
          </Button>
        </div>
      </div>
    );

    if (isMobile) {
      return (
        <Drawer open={showLinkedTimelines} onOpenChange={setShowLinkedTimelines}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Link / Merge Timelines</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              {LinkedTimelinesContent}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={showLinkedTimelines} onOpenChange={setShowLinkedTimelines}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Link / Merge Timelines</DialogTitle>
          </DialogHeader>
          {LinkedTimelinesContent}
        </DialogContent>
      </Dialog>
    );
  };

  const renderSubContributionsModal = () => {
    const SubConfigContent = (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        <div className="space-y-4">
          <h4 className="font-medium">1. Allowed Contribution Types</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Financial', 'Intellectual', 'Network', 'Asset'].map(type => (
              <Card 
                key={type}
                className={`cursor-pointer transition-colors ${
                  data.subContributions.config.allowedTypes.includes(type.toLowerCase())
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  const typeKey = type.toLowerCase();
                  setData(prev => ({
                    ...prev,
                    subContributions: {
                      ...prev.subContributions,
                      config: {
                        ...prev.subContributions.config,
                        allowedTypes: prev.subContributions.config.allowedTypes.includes(typeKey)
                          ? prev.subContributions.config.allowedTypes.filter(t => t !== typeKey)
                          : [...prev.subContributions.config.allowedTypes, typeKey]
                      }
                    }
                  }));
                }}
              >
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {type === 'Financial' && <DollarSign className="h-4 w-4" />}
                    {type === 'Intellectual' && <Brain className="h-4 w-4" />}
                    {type === 'Network' && <Network className="h-4 w-4" />}
                    {type === 'Asset' && <Building className="h-4 w-4" />}
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">2. Outcome Sharing Mode</h4>
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
              <SelectValue placeholder="Select sharing mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent-child">Parent → Child (parent collects and redistributes)</SelectItem>
              <SelectItem value="child-parent">Child → Parent (child contributes back to parent)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">3. Access Level</h4>
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
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Private</span>
                </div>
              </SelectItem>
              <SelectItem value="members">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Members Only</span>
                </div>
              </SelectItem>
              <SelectItem value="public">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Public</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">4. Additional Features</h4>
          <div className="space-y-2">
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

        <div className="flex gap-2">
          <Button 
            onClick={() => setShowSubConfig(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setShowSubConfig(false);
              toast.success('Sub-contributions configuration saved!');
            }}
            className="flex-1"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    );

    if (isMobile) {
      return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubConfig(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold">Configure Sub-Contributions</h2>
            </div>
            {SubConfigContent}
          </div>
        </div>
      );
    }

    return (
      <Dialog open={showSubConfig} onOpenChange={setShowSubConfig}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Sub-Contributions</DialogTitle>
          </DialogHeader>
          {SubConfigContent}
        </DialogContent>
      </Dialog>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Access Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.accessGranted ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span>Access granted! You can proceed with your contribution.</span>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Verifying access permissions...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Expected Outcomes Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="give" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="give">What You'll Give</TabsTrigger>
                    <TabsTrigger value="receive">What You'll Receive</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="give" className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Select what you'll contribute:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {outcomeOptions.map(outcome => (
                          <Card 
                            key={outcome}
                            className={`cursor-pointer transition-colors ${
                              data.expectedOutcomes.toGive.includes(outcome) 
                                ? 'border-primary bg-primary/5' 
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleOutcomeToggle(outcome, 'toGive')}
                          >
                            <CardContent className="p-3 text-center">
                              <span className="text-sm">{outcome}</span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Add Custom Contribution:</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="e.g., Market analysis, Technical expertise..."
                          value={newCustomOutcome.toGive}
                          onChange={(e) => setNewCustomOutcome(prev => ({ ...prev, toGive: e.target.value }))}
                        />
                        <Button onClick={() => handleAddCustomOutcome('toGive')}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {data.expectedOutcomes.customToGive.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Custom Contributions:</Label>
                        <div className="space-y-2">
                          {data.expectedOutcomes.customToGive.map((outcome, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">{outcome}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveCustomOutcome(index, 'toGive')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="receive" className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Select what you expect to receive:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {outcomeOptions.map(outcome => (
                          <Card 
                            key={outcome}
                            className={`cursor-pointer transition-colors ${
                              data.expectedOutcomes.toReceive.includes(outcome) 
                                ? 'border-primary bg-primary/5' 
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleOutcomeToggle(outcome, 'toReceive')}
                          >
                            <CardContent className="p-3 text-center">
                              <span className="text-sm">{outcome}</span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Add Custom Expectation:</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="e.g., Industry connections, Mentorship..."
                          value={newCustomOutcome.toReceive}
                          onChange={(e) => setNewCustomOutcome(prev => ({ ...prev, toReceive: e.target.value }))}
                        />
                        <Button onClick={() => handleAddCustomOutcome('toReceive')}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {data.expectedOutcomes.customToReceive.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Custom Expectations:</Label>
                        <div className="space-y-2">
                          {data.expectedOutcomes.customToReceive.map((outcome, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">{outcome}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveCustomOutcome(index, 'toReceive')}
                              >
                                <X className="h-4 w-4" />
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Configure Contribution Types & Subtypes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'financial', name: 'Financial', icon: DollarSign, color: 'text-green-600', subtypes: financialSubtypes },
                    { key: 'intellectual', name: 'Intellectual', icon: Brain, color: 'text-blue-600', subtypes: intellectualSubtypes },
                    { key: 'network', name: 'Network/Marketing', icon: Network, color: 'text-purple-600', subtypes: networkSubtypes },
                    { key: 'asset', name: 'Asset', icon: Building, color: 'text-orange-600', subtypes: assetSubtypes }
                  ].map(({ key, name, icon: Icon, color, subtypes }) => (
                    <Card key={key} className={`transition-all ${data.contributionTypes[key as keyof typeof data.contributionTypes].enabled ? 'border-primary' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-5 w-5 ${color}`} />
                            <span className="font-medium">{name}</span>
                          </div>
                          <Switch
                            checked={data.contributionTypes[key as keyof typeof data.contributionTypes].enabled}
                            onCheckedChange={() => handleContributionTypeToggle(key as keyof typeof data.contributionTypes)}
                          />
                        </div>
                        
                        {data.contributionTypes[key as keyof typeof data.contributionTypes].enabled && (
                          <div className="space-y-3">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setShowTypeConfig(key)}
                            >
                              Configure {name}
                            </Button>
                            
                            {/* Display saved configuration summary */}
                            {data.contributionTypes[key as keyof typeof data.contributionTypes].subtypes.length > 0 && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <h5 className="font-medium text-sm text-green-800 mb-2">Configuration Summary</h5>
                                {data.contributionTypes[key as keyof typeof data.contributionTypes].subtypes.map((config: any, index: number) => (
                                  <div key={index} className="space-y-1 text-xs text-green-700">
                                    <div><strong>Subtypes:</strong> {config.selectedSubtypes.join(', ')}{config.customSubtype && `, ${config.customSubtype}`}</div>
                                    <div><strong>Value:</strong> {config.value}</div>
                                    <div><strong>Expected Gain:</strong> {config.gainPercentage}%</div>
                                    {config.negotiationRequested && <div className="text-orange-600">• Negotiation requested</div>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {showTypeConfig && renderTypeConfigModal(showTypeConfig, 
              showTypeConfig === 'financial' ? financialSubtypes :
              showTypeConfig === 'intellectual' ? intellectualSubtypes :
              showTypeConfig === 'network' ? networkSubtypes : assetSubtypes
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Link / Merge Timelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Link existing timelines from your portfolio to this contribution. Set percentage portions to affect valuation dynamically.
                  </p>
                  
                  <Button 
                    onClick={() => setShowLinkedTimelines(true)}
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Select Timelines to Link
                  </Button>
                  
                  {data.linkedTimelines.some(t => t.selected) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Selected Timelines:</Label>
                      {data.linkedTimelines.filter(t => t.selected).map(timeline => (
                        <div key={timeline.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm font-medium">{timeline.name}</span>
                          <Badge variant="secondary">{timeline.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {renderLinkedTimelinesModal()}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Capture Custom Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Required fields */}
                  <div className="space-y-3">
                    <div>
                      <Label>Title *</Label>
                      <Input 
                        placeholder="Contribution title"
                        value={data.customInputs.title}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          customInputs: { ...prev.customInputs, title: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Description *</Label>
                      <Textarea 
                        placeholder="Detailed description of your contribution"
                        value={data.customInputs.description}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          customInputs: { ...prev.customInputs, description: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Context *</Label>
                      <Textarea 
                        placeholder="Context and background information"
                        value={data.customInputs.context}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          customInputs: { ...prev.customInputs, context: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  
                  {/* Additional custom fields */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Additional Fields</Label>
                      <Button variant="outline" size="sm" onClick={addCustomField}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Field
                      </Button>
                    </div>
                    
                    {data.customInputs.additionalFields.map((field, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Input 
                          placeholder="Field label"
                          value={field.label}
                          onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                          className="flex-1"
                        />
                        <Select
                          value={field.type}
                          onValueChange={(value) => updateCustomField(index, 'type', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeCustomField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Capture Files & Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* File upload area */}
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Click to upload files or drag and drop</p>
                    <p className="text-xs text-muted-foreground">Supports all file types configured by parent timeline</p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>
                  
                  {/* Attachments list */}
                  {data.attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Uploaded Files:</Label>
                      {data.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            {attachment.type.startsWith('image/') && <FileImage className="h-5 w-5 text-blue-600" />}
                            {attachment.type.startsWith('video/') && <FileVideo className="h-5 w-5 text-red-600" />}
                            {attachment.type.startsWith('audio/') && <FileAudio className="h-5 w-5 text-green-600" />}
                            {!attachment.type.startsWith('image/') && !attachment.type.startsWith('video/') && !attachment.type.startsWith('audio/') && <FileText className="h-5 w-5 text-gray-600" />}
                            <div>
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(attachment.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {attachment.preview && (
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {attachment.type.startsWith('video/') && (
                              <Button variant="ghost" size="sm">
                                <PlayCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeAttachment(attachment.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Presentation Template Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose how your contribution will be displayed and presented to others.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { 
                        id: 'table', 
                        name: 'Table View', 
                        description: 'Structured data in table format',
                        icon: BarChart 
                      },
                      { 
                        id: 'list', 
                        name: 'List Items', 
                        description: 'Simple list format with details',
                        icon: FileText 
                      },
                      { 
                        id: 'cards', 
                        name: 'Card Layout', 
                        description: 'Visual cards with summaries',
                        icon: CreditCard 
                      }
                    ].map(template => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-colors ${
                          data.presentationTemplate === template.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setData(prev => ({ ...prev, presentationTemplate: template.id }))}
                      >
                        <CardContent className="p-4 text-center">
                          <template.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h4 className="font-medium mb-1">{template.name}</h4>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-medium mb-2">Preview</h5>
                    <p className="text-sm text-muted-foreground">
                      Selected template: <strong>{data.presentationTemplate}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The display will adapt based on your contribution structure and inputs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configure Sub-Contributions / Sub-Timelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable Sub-Contributions</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow other contributors to build on this contribution
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
                      <Button 
                        onClick={() => setShowSubConfig(true)}
                        className="w-full"
                        variant="outline"
                      >
                        Configure Sub-Contributions Settings
                      </Button>
                      
                      {/* Display configuration summary */}
                      <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <h5 className="font-medium text-sm">Configuration Summary</h5>
                        <div className="text-xs space-y-1">
                          <div><strong>Allowed Types:</strong> {data.subContributions.config.allowedTypes.join(', ') || 'None selected'}</div>
                          <div><strong>Sharing Mode:</strong> {data.subContributions.config.outcomeSharing.mode}</div>
                          <div><strong>Access Level:</strong> {data.subContributions.config.accessLevel}</div>
                          <div><strong>Custom Ratings:</strong> {data.subContributions.config.customRatings ? 'Enabled' : 'Disabled'}</div>
                          <div><strong>Follow-up Workflows:</strong> {data.subContributions.config.followUpWorkflows ? 'Enabled' : 'Disabled'}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {renderSubContributionsModal()}
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Review & Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Expected Outcomes Summary */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Expected Outcomes</h4>
                      <div className="p-3 bg-muted/30 rounded text-sm">
                        <div className="mb-2">
                          <strong>To Give:</strong> {[...data.expectedOutcomes.toGive, ...data.expectedOutcomes.customToGive].join(', ') || 'None specified'}
                        </div>
                        <div>
                          <strong>To Receive:</strong> {[...data.expectedOutcomes.toReceive, ...data.expectedOutcomes.customToReceive].join(', ') || 'None specified'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Contribution Types Summary */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Contribution Types</h4>
                      <div className="p-3 bg-muted/30 rounded text-sm space-y-1">
                        {Object.entries(data.contributionTypes).map(([type, config]) => 
                          config.enabled ? (
                            <div key={type}>
                              <strong className="capitalize">{type}:</strong> {config.subtypes.length} configured
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                    
                    {/* Linked Timelines */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Linked Timelines</h4>
                      <div className="p-3 bg-muted/30 rounded text-sm">
                        {data.linkedTimelines.filter(t => t.selected).length > 0 ? (
                          <div className="space-y-1">
                            {data.linkedTimelines.filter(t => t.selected).map(timeline => (
                              <div key={timeline.id}>
                                {timeline.name} ({timeline.percentage}%)
                              </div>
                            ))}
                          </div>
                        ) : (
                          'No timelines linked'
                        )}
                      </div>
                    </div>
                    
                    {/* Attachments */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Attachments</h4>
                      <div className="p-3 bg-muted/30 rounded text-sm">
                        {data.attachments.length > 0 ? (
                          <div>{data.attachments.length} file(s) attached</div>
                        ) : (
                          'No files attached'
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Financial Summary */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Financial Summary</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      {Object.entries(typeConfigData).map(([type, config]) => 
                        config.value ? (
                          <div key={type}>
                            <strong className="capitalize">{type}:</strong> {config.value} (Expected gain: {config.gainPercentage}%)
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">
                      Save as Draft
                    </Button>
                    <Button className="flex-1" onClick={handleSubmit}>
                      Submit Contribution
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

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
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">ShonaCoin Contribution</h1>
                <p className="text-sm text-muted-foreground">
                  {data.timeline?.title || 'Loading...'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Step {currentStep} of 9</div>
              <Progress value={(currentStep / 9) * 100} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Steps indicator */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
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
    </div>
  );
}