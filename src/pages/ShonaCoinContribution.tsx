import React, { useState, useEffect, useRef } from 'react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
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
  TrendingUp,
  Info,
  Table,
  Loader2,
  AlertTriangle,
  AlertCircle
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
  customSubtypes: string[];
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
  
  // Debug responsive state
  React.useEffect(() => {
    console.log('isMobile state changed:', isMobile, 'window width:', window.innerWidth);
  }, [isMobile]);
  
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
  const [showOutcomesModal, setShowOutcomesModal] = useState(false);
  const [activeOutcomeTab, setActiveOutcomeTab] = useState<'toGive' | 'toReceive'>('toGive');
  const [selectedOutcomes, setSelectedOutcomes] = useState({
    toGive: {
      financial: [] as string[],
      intellectual: [] as string[],
      network: [] as string[],
      asset: [] as string[]
    },
    toReceive: {
      financial: [] as string[],
      intellectual: [] as string[],
      network: [] as string[],
      asset: [] as string[]
    }
  });
  const [customOutcomes, setCustomOutcomes] = useState({
    toGive: {
      financial: [] as string[],
      intellectual: [] as string[],
      network: [] as string[],
      asset: [] as string[]
    },
    toReceive: {
      financial: [] as string[],
      intellectual: [] as string[],
      network: [] as string[],
      asset: [] as string[]
    }
  });
  const [newCustomInputs, setNewCustomInputs] = useState({
    financial: '',
    intellectual: '',
    network: '',
    asset: ''
  });
  
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

  // Categorized outcome options
  const outcomeCategories = {
    financial: [
      'Equity share (ownership % on timeline)',
      'Profit share (net earnings % on timeline revenues)',
      'Revenue share (gross income split % on timeline revenues)',
      'Milestones wedge (amount)'
    ],
    intellectual: [
      'Usage / Access rights',
      'Asset appreciations'
    ],
    network: [
      'Traffic',
      'Downloads',
      'Impressions (likes, comments, reach)',
      'Leads, referrals, mentions'
    ],
    asset: []
  };

  const financialSubtypes = [
    { id: 'cash', name: 'Cash', description: 'Direct cash contribution' },
    { id: 'debt', name: 'Debt', description: 'Loan with repayment terms' },
    { id: 'pledge', name: 'Pledge', description: 'Commitment to future payment' }
  ];

  const intellectualSubtypes = [
    { id: 'courses_tutoring', name: 'Courses and Tutoring', description: 'Educational courses and personal tutoring' },
    { id: 'research', name: 'Research', description: 'Research studies and analysis' },
    { id: 'ideas_perspectives', name: 'Ideas, Perspective & Strategies', description: 'Strategic insights and innovative perspectives' },
    { id: 'code_algorithms', name: 'Code and Algorithm Snippets', description: 'Software code and algorithm contributions' },
    { id: 'mentorship', name: 'Mentorship Program', description: 'Structured mentorship and guidance' },
    { id: 'project_planning', name: 'Project Planning & Management', description: 'Project coordination and management expertise' },
    { id: 'consultation', name: 'Consultation', description: 'Expert advisory and consultation services' },
    { id: 'prime_reviews', name: 'Prime Reviews', description: 'Comprehensive reviews and evaluations' },
    { id: 'guide_counselling', name: 'Guide and Counselling', description: 'Professional guidance and counselling' },
    { id: 'customer_support', name: 'Customer Support', description: 'Customer service and support' },
    { id: 'capacity_building', name: 'Capacity Building', description: 'Skills development and capacity enhancement' },
    { id: 'knowledge_sessions', name: 'Knowledge Sharing Sessions', description: 'Workshops, seminars, and webinars' },
    { id: 'technical_documentation', name: 'Technical Documentation & Writing', description: 'Technical writing and documentation' },
    { id: 'design_thinking', name: 'Design Thinking / Innovation Frameworks', description: 'Innovation methodologies and frameworks' },
    { id: 'training_modules', name: 'Training Modules & Educational Materials', description: 'Educational content and training materials' },
    { id: 'policy_governance', name: 'Policy & Governance Advisory', description: 'Policy development and governance advice' },
    { id: 'content_creation', name: 'Content Creation', description: 'Blogs, whitepapers, case studies' },
    { id: 'open_source', name: 'Open Source Contributions', description: 'Open source project contributions' },
    { id: 'intellectual_property', name: 'Intellectual Property Contributions', description: 'Patents, designs, copyrights' },
    { id: 'expert_reviews', name: 'Expert Reviews & Evaluations', description: 'Professional reviews and assessments' }
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

  const handleCategoryOutcomeToggle = (outcome: string, category: 'financial' | 'intellectual' | 'network' | 'asset', type: 'toGive' | 'toReceive') => {
    setSelectedOutcomes(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: prev[type][category].includes(outcome)
          ? prev[type][category].filter(o => o !== outcome)
          : [...prev[type][category], outcome]
      }
    }));
  };

  const handleAddCustomCategoryOutcome = (category: 'financial' | 'intellectual' | 'network' | 'asset', type: 'toGive' | 'toReceive', value: string) => {
    if (value.trim()) {
      setCustomOutcomes(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [category]: [...prev[type][category], value.trim()]
        }
      }));
    }
  };

  const handleRemoveCustomCategoryOutcome = (index: number, category: 'financial' | 'intellectual' | 'network' | 'asset', type: 'toGive' | 'toReceive') => {
    setCustomOutcomes(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: prev[type][category].filter((_, i) => i !== index)
      }
    }));
  };

  const saveOutcomesConfiguration = () => {
    // Persist all selected and custom outcomes
    const allToGive = [
      ...selectedOutcomes.toGive.financial,
      ...selectedOutcomes.toGive.intellectual,
      ...selectedOutcomes.toGive.network,
      ...selectedOutcomes.toGive.asset
    ];
    const allToReceive = [
      ...selectedOutcomes.toReceive.financial,
      ...selectedOutcomes.toReceive.intellectual,
      ...selectedOutcomes.toReceive.network,
      ...selectedOutcomes.toReceive.asset
    ];
    const allCustomToGive = [
      ...customOutcomes.toGive.financial,
      ...customOutcomes.toGive.intellectual,
      ...customOutcomes.toGive.network,
      ...customOutcomes.toGive.asset
    ];
    const allCustomToReceive = [
      ...customOutcomes.toReceive.financial,
      ...customOutcomes.toReceive.intellectual,
      ...customOutcomes.toReceive.network,
      ...customOutcomes.toReceive.asset
    ];

    setData(prev => ({
      ...prev,
      expectedOutcomes: {
        toGive: allToGive,
        toReceive: allToReceive,
        customToGive: allCustomToGive,
        customToReceive: allCustomToReceive
      }
    }));
    
    setShowOutcomesModal(false);
    toast.success('Outcomes configuration saved successfully!');
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
        customSubtypes: [],
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
        customSubtypes: [],
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

  const addCustomSubtype = (type: string) => {
    const config = typeConfigData[type];
    if (config && config.customSubtype.trim()) {
      setTypeConfigData(prev => {
        const currentData = prev[type] || {
          selectedSubtypes: [],
          customSubtype: '',
          customSubtypes: [],
          value: '',
          valuationMethod: 'fixed' as const,
          notes: '',
          gainPercentage: 0,
          negotiationRequested: false
        };
        
        return {
          ...prev,
          [type]: {
            ...currentData,
            customSubtypes: [...currentData.customSubtypes, currentData.customSubtype.trim()],
            customSubtype: ''
          }
        };
      });
    }
  };

  const removeCustomSubtype = (type: string, index: number) => {
    setTypeConfigData(prev => {
      const currentData = prev[type];
      if (!currentData) return prev;
      
      return {
        ...prev,
        [type]: {
          ...currentData,
          customSubtypes: currentData.customSubtypes.filter((_, i) => i !== index)
        }
      };
    });
  };

  const saveTypeConfiguration = (type: string) => {
    const config = typeConfigData[type];
    if (config && (config.selectedSubtypes.length > 0 || config.customSubtype.trim() || config.customSubtypes.length > 0)) {
      // Add current custom subtype if not empty
      let finalCustomSubtypes = [...config.customSubtypes];
      if (config.customSubtype.trim()) {
        finalCustomSubtypes.push(config.customSubtype.trim());
      }
      
      const finalConfig = {
        ...config,
        customSubtypes: finalCustomSubtypes,
        customSubtype: ''
      };
      
      setData(prev => ({
        ...prev,
        contributionTypes: {
          ...prev.contributionTypes,
          [type]: {
            ...prev.contributionTypes[type],
            subtypes: [finalConfig]
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
          ? { ...t, selected: !t.selected, percentage: t.selected ? 0 : t.percentage || 0 }
          : t
      );
      
      // Update valuations immediately when selection changes
      updateValuationsFromLinkedTimelines(updatedLinkedTimelines);
      
      return {
        ...prev,
        linkedTimelines: updatedLinkedTimelines
      };
    });
  };

  const updateTimelinePercentage = (timelineId: string, percentage: number) => {
    // Validate input - ensure it's between 0 and 100
    const validPercentage = Math.max(0, Math.min(100, percentage || 0));

    setData(prev => {
      const updatedLinkedTimelines = prev.linkedTimelines.map(t => 
        t.id === timelineId ? { ...t, percentage: validPercentage } : t
      );
      
      // Check total allocation doesn't exceed 100%
      const totalPercentage = updatedLinkedTimelines
        .filter(t => t.selected)
        .reduce((sum, t) => sum + (t.percentage || 0), 0);
      
      if (totalPercentage > 100) {
        toast.error('Total percentage allocation cannot exceed 100%');
        return prev;
      }
      
      // Update valuations in real-time
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
    if (!data.linkedTimelines || data.linkedTimelines.length === 0) {
      return [];
    }
    
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return data.linkedTimelines;
    }
    
    return data.linkedTimelines.filter(timeline => 
      timeline.name.toLowerCase().includes(query) ||
      timeline.type.toLowerCase().includes(query) ||
      timeline.value.toLowerCase().includes(query)
    );
  };

  const saveLinkedTimelines = () => {
    const selectedTimelines = data.linkedTimelines.filter(t => t.selected);
    const totalPercentage = selectedTimelines.reduce((sum, t) => sum + (t.percentage || 0), 0);
    
    if (totalPercentage > 100) {
      toast.error('Cannot save: Total allocation exceeds 100%');
      return;
    }
    
    // Persist timeline links and update Step 3 valuation
    updateValuationsFromLinkedTimelines(data.linkedTimelines);
    
    toast.success(`${selectedTimelines.length} timeline(s) linked successfully!`);
    setShowLinkedTimelines(false);
    
    // Clear search when closing
    setSearchQuery('');
  };

  // Render configuration modal/drawer for contribution types
  const renderTypeConfigModal = (type: string) => {
    const config = typeConfigData[type] || {
      selectedSubtypes: [],
      customSubtype: '',
      customSubtypes: [],
      value: '',
      valuationMethod: 'fixed' as const,
      notes: '',
      gainPercentage: 0,
      negotiationRequested: false,
      amount: '',
      dates: { start: '', end: '' },
      interestRate: '',
      expectedReturns: '',
      formula: '',
      rule: '',
      linkedValue: 0,
      totalValue: 0
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
    const isConfigComplete = config.selectedSubtypes.length > 0 || config.customSubtype.trim() || config.customSubtypes.length > 0;

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
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add More (Custom Subtypes)
          </Label>
          
          {/* Display added custom subtypes */}
          {config.customSubtypes.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Added Custom Subtypes:</div>
              <div className="space-y-2">
                {config.customSubtypes.map((customSubtype, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">{customSubtype}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomSubtype(type, index)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Input for new custom subtype */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g., UX Design Framework, Patent Research, etc."
              value={config.customSubtype}
              onChange={(e) => updateTypeConfigField(type, 'customSubtype', e.target.value)}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && config.customSubtype.trim()) {
                  addCustomSubtype(type);
                }
              }}
            />
            <Button
              onClick={() => addCustomSubtype(type)}
              disabled={!config.customSubtype.trim()}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Add your own contribution types that aren't listed above. Press Enter or click + to add.
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

  // Save custom inputs method
  const saveCustomInputsMethod = (method: string, inputData: any) => {
    let displayName = method.charAt(0).toUpperCase() + method.slice(1);
    
    // For API connections, show specific type in the summary
    if (method === 'api' && inputData) {
      if (inputData.type === 'available_api') {
        displayName = `API Connection (${inputData.apiName})`;
      } else if (inputData.type === 'custom_api') {
        displayName = `Custom API (${inputData.apiName})`;
      } else if (inputData.activeTab === 'custom' && inputData.customAPIData) {
        displayName = `Custom API (${inputData.customAPIData.name})`;
      } else if (inputData.activeTab === 'available' && inputData.selectedAPI) {
        const selectedApiData = [
          { id: 'google-sheets', name: 'Google Sheets' },
          { id: 'airtable', name: 'Airtable' },
          { id: 'notion', name: 'Notion' },
          { id: 'zapier', name: 'Zapier' }
        ].find(api => api.id === inputData.selectedAPI);
        displayName = `API Connection (${selectedApiData?.name || 'Unknown'})`;
      }
    }
    
    setData(prev => ({
      ...prev,
      customInputs: {
        ...prev.customInputs,
        inputMethod: method,
        displayName,
        additionalData: inputData,
        lastUpdated: new Date().toISOString()
      }
    }));
    setShowCustomInputs(null);
    toast.success(`${displayName} configured successfully!`);
  };

  // Render custom inputs modal/drawer
  const renderCustomInputsModal = () => {
    if (!showCustomInputs) return null;

    const mockParentTimelineFields = [
      { id: 'project_title', label: 'Project Title', type: 'text', required: true },
      { id: 'description', label: 'Description', type: 'textarea', required: true },
      { id: 'budget', label: 'Budget Estimate', type: 'number', required: false },
      { id: 'timeline', label: 'Timeline', type: 'date', required: true },
      { id: 'category', label: 'Category', type: 'select', options: ['Development', 'Marketing', 'Research'], required: true },
      { id: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'], required: false }
    ];

    const mockAPIs = [
      { 
        id: 'google-sheets', 
        name: 'Google Sheets', 
        icon: '📊', 
        description: 'Import data from Google Sheets',
        fields: ['spreadsheet_id', 'sheet_name', 'range']
      },
      { 
        id: 'airtable', 
        name: 'Airtable', 
        icon: '🗃️', 
        description: 'Connect to Airtable database',
        fields: ['base_id', 'table_name', 'api_key']
      },
      { 
        id: 'notion', 
        name: 'Notion', 
        icon: '📝', 
        description: 'Sync with Notion database',
        fields: ['database_id', 'integration_token']
      },
      { 
        id: 'zapier', 
        name: 'Zapier', 
        icon: '⚡', 
        description: 'Connect via Zapier webhook',
        fields: ['webhook_url', 'trigger_event']
      }
    ];

    const ContentComponent = () => {
      const [isLoading, setIsLoading] = useState(false);
      const [formData, setFormData] = useState<any>({});
      const [selectedAPI, setSelectedAPI] = useState<string | null>(null);
      const [uploadedFile, setUploadedFile] = useState<File | null>(null);
      const [columnMapping, setColumnMapping] = useState<any>({});
      const [aiPrompt, setAiPrompt] = useState('');
      const [generatedData, setGeneratedData] = useState<any>(null);

      const handleSave = async () => {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let saveData: any = {};
        
        switch (showCustomInputs) {
          case 'manual':
            saveData = { formData, fieldsCount: Object.keys(formData).length };
            break;
          case 'api':
            saveData = { selectedAPI, apiConfig: formData };
            break;
          case 'excel':
            saveData = { fileName: uploadedFile?.name, columnMapping, recordsCount: 150 };
            break;
          case 'ai':
            saveData = { prompt: aiPrompt, generatedData, fieldsGenerated: generatedData ? Object.keys(generatedData).length : 0 };
            break;
        }
        
        saveCustomInputsMethod(showCustomInputs, saveData);
        setIsLoading(false);
      };

      const renderManualEntry = () => (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Parent Timeline Required Fields
            </h4>
            <p className="text-sm text-muted-foreground">
              Fill in the custom fields required by the parent timeline. These will be saved as sub-timelines.
            </p>
          </div>
          
          <div className="space-y-4">
            {mockParentTimelineFields.map(field => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="flex items-center gap-2">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>
                {field.type === 'text' && (
                  <Input
                    id={field.id}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.id}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    rows={3}
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    id={field.id}
                    type="number"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  />
                )}
                {field.type === 'date' && (
                  <Input
                    id={field.id}
                    type="date"
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  />
                )}
                {field.type === 'select' && (
                  <Select
                    value={formData[field.id] || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Settings className="h-4 w-4" />
              Drag and drop support for reordering fields will be available in next version
            </div>
          </div>
        </div>
      );

      const renderAPIConnection = () => {
        const [activeTab, setActiveTab] = useState<'available' | 'custom'>('available');
        const [customAPIData, setCustomAPIData] = useState({
          name: '',
          baseUrl: '',
          authMethod: 'none',
          headers: [{ key: '', value: '' }],
          requestType: 'GET',
          body: ''
        });

        // Store custom API data in formData for access in parent scope
        const updateFormDataWithCustomAPI = () => {
          setFormData(prev => ({
            ...prev,
            activeTab,
            customAPIData: customAPIData
          }));
        };

        // Update formData whenever customAPIData or activeTab changes
        React.useEffect(() => {
          updateFormDataWithCustomAPI();
        }, [customAPIData, activeTab]);

        // Check if save should be enabled for API connections
        const canSaveAPI = () => {
          if (activeTab === 'available') {
            return selectedAPI && formData && Object.keys(formData).length > 0;
          } else {
            return customAPIData.name && customAPIData.baseUrl;
          }
        };

        const addHeader = () => {
          setCustomAPIData(prev => ({
            ...prev,
            headers: [...prev.headers, { key: '', value: '' }]
          }));
        };

        const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
          setCustomAPIData(prev => ({
            ...prev,
            headers: prev.headers.map((header, i) => 
              i === index ? { ...header, [field]: value } : header
            )
          }));
        };

        const removeHeader = (index: number) => {
          setCustomAPIData(prev => ({
            ...prev,
            headers: prev.headers.filter((_, i) => i !== index)
          }));
        };

        const validateCustomConnection = async () => {
          toast.info('Validating API connection...');
          // Simulate validation
          setTimeout(() => {
            toast.success('API connection validated successfully!');
          }, 2000);
        };

        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Network className="h-4 w-4" />
                API Connection Setup
              </h4>
              <p className="text-sm text-muted-foreground">
                Connect to external data sources that match the parent timeline's input structure.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'available' | 'custom')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">Available APIs</TabsTrigger>
                <TabsTrigger value="custom">Custom Connection</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  {mockAPIs.map(api => (
                    <div
                      key={api.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                        selectedAPI === api.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedAPI(api.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{api.icon}</span>
                        <div className="flex-1">
                          <h5 className="font-medium">{api.name}</h5>
                          <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                          {selectedAPI === api.id && (
                            <div className="space-y-3 mt-4 pt-3 border-t">
                              <h6 className="text-sm font-medium">Configuration</h6>
                              {api.fields.map(field => (
                                <div key={field} className="space-y-1">
                                  <Label htmlFor={field} className="text-xs">
                                    {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Label>
                                  <Input
                                    id={field}
                                    placeholder={`Enter ${field.replace('_', ' ')}...`}
                                    value={formData[field] || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {selectedAPI === api.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedAPI && (
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      API Input Preview
                    </h5>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Data will be mapped to parent timeline fields</p>
                      <p>• Real-time sync available for supported APIs</p>
                      <p>• Validation will occur before saving to database</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-name">API Name *</Label>
                      <Input
                        id="api-name"
                        placeholder="Enter API name..."
                        value={customAPIData.name}
                        onChange={(e) => setCustomAPIData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="base-url">Base URL *</Label>
                      <Input
                        id="base-url"
                        placeholder="https://api.example.com"
                        value={customAPIData.baseUrl}
                        onChange={(e) => setCustomAPIData(prev => ({ ...prev, baseUrl: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="auth-method">Authentication Method</Label>
                      <Select value={customAPIData.authMethod} onValueChange={(value) => setCustomAPIData(prev => ({ ...prev, authMethod: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select authentication method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="api-key">API Key</SelectItem>
                          <SelectItem value="oauth">OAuth</SelectItem>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="request-type">Request Type</Label>
                      <Select value={customAPIData.requestType} onValueChange={(value) => setCustomAPIData(prev => ({ ...prev, requestType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Headers</Label>
                      <Button type="button" size="sm" variant="outline" onClick={addHeader}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Header
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {customAPIData.headers.map((header, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Header key"
                            value={header.key}
                            onChange={(e) => updateHeader(index, 'key', e.target.value)}
                          />
                          <Input
                            placeholder="Header value"
                            value={header.value}
                            onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeHeader(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(customAPIData.requestType === 'POST' || customAPIData.requestType === 'PUT') && (
                    <div className="space-y-2">
                      <Label htmlFor="request-body">Request Body / Payload</Label>
                      <textarea
                        id="request-body"
                        className="w-full h-32 p-3 border rounded-md resize-none"
                        placeholder="Enter JSON payload or key/value pairs..."
                        value={customAPIData.body}
                        onChange={(e) => setCustomAPIData(prev => ({ ...prev, body: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={validateCustomConnection}
                      disabled={!customAPIData.name || !customAPIData.baseUrl}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Validate Connection
                    </Button>
                  </div>

                  {customAPIData.name && customAPIData.baseUrl && (
                    <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Custom API Preview
                      </h5>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Name:</span> {customAPIData.name}</p>
                        <p><span className="font-medium">Endpoint:</span> {customAPIData.baseUrl}</p>
                        <p><span className="font-medium">Method:</span> {customAPIData.requestType}</p>
                        <p><span className="font-medium">Auth:</span> {customAPIData.authMethod}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      };

      const renderExcelImport = () => {
        const [validationErrors, setValidationErrors] = useState<string[]>([]);
        const [isValidating, setIsValidating] = useState(false);
        const [isValidData, setIsValidData] = useState(false);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            // Validate file type
            const validTypes = [
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            
            if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
              toast.error('Please select a valid Excel file (.xls or .xlsx)');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              return;
            }

            setUploadedFile(file);
            setValidationErrors([]);
            setIsValidData(false);
            toast.success(`File selected: ${file.name}`);
          }
        };

        const validateData = async () => {
          if (!uploadedFile) return;
          
          setIsValidating(true);
          setValidationErrors([]);
          
          // Simulate validation process
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock validation results
          const errors: string[] = [];
          const mappedFields = Object.keys(columnMapping);
          const requiredFields = mockParentTimelineFields.filter(f => f.required).map(f => f.id);
          
          // Check if all required fields are mapped
          const missingRequired = requiredFields.filter(field => !mappedFields.includes(field));
          if (missingRequired.length > 0) {
            errors.push(`Missing required field mappings: ${missingRequired.join(', ')}`);
          }
          
          // Simulate data validation errors
          if (Math.random() > 0.7) {
            errors.push('Row 45: Invalid date format in timeline field');
          }
          if (Math.random() > 0.8) {
            errors.push('Row 78: Budget value exceeds maximum allowed');
          }
          
          setValidationErrors(errors);
          setIsValidData(errors.length === 0);
          setIsValidating(false);
          
          if (errors.length === 0) {
            toast.success('Data validation passed! Ready to import.');
          } else {
            toast.error(`Validation failed with ${errors.length} error(s)`);
          }
        };

        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Excel File Import
              </h4>
              <p className="text-sm text-muted-foreground">
                Upload an Excel file (.xls, .xlsx) and map columns to the parent timeline's required fields.
              </p>
            </div>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h5 className="font-medium mb-2">
                  {uploadedFile ? 'File Selected' : 'Upload Excel File'}
                </h5>
                <p className="text-sm text-muted-foreground mb-4">
                  {uploadedFile 
                    ? 'File ready for column mapping and validation' 
                    : 'Click below to select an Excel file (.xls or .xlsx) to import data'
                  }
                </p>
                
                {!uploadedFile ? (
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">{uploadedFile.name}</span>
                        <span className="text-green-600">
                          ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setUploadedFile(null);
                        setColumnMapping({});
                        setValidationErrors([]);
                        setIsValidData(false);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Choose Different File
                    </Button>
                  </div>
                )}
              </div>

              {uploadedFile && (
                <div className="space-y-4">
                  <h5 className="font-medium">Column Mapping</h5>
                  <p className="text-sm text-muted-foreground">
                    Map Excel columns to timeline fields. Required fields must be mapped.
                  </p>
                  <div className="grid gap-3">
                    {mockParentTimelineFields.map(field => (
                      <div key={field.id} className="flex items-center gap-3">
                        <div className="w-1/3">
                          <Label className={`text-sm ${field.required ? 'font-medium' : ''}`}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                        </div>
                        <div className="w-2/3">
                          <Select
                            value={columnMapping[field.id] || ''}
                            onValueChange={(value) => setColumnMapping(prev => ({ ...prev, [field.id]: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Excel column..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-- None --</SelectItem>
                              <SelectItem value="column_a">Column A - Project Name</SelectItem>
                              <SelectItem value="column_b">Column B - Description</SelectItem>
                              <SelectItem value="column_c">Column C - Budget Amount</SelectItem>
                              <SelectItem value="column_d">Column D - Due Date</SelectItem>
                              <SelectItem value="column_e">Column E - Category</SelectItem>
                              <SelectItem value="column_f">Column F - Priority</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>

                   {Object.keys(columnMapping).length > 0 && (
                     <div className="flex gap-3">
                       <Button
                         variant="outline"
                         onClick={validateData}
                         disabled={isValidating || Object.keys(columnMapping).length === 0}
                         className="flex-1"
                       >
                         {isValidating ? (
                           <>
                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                             Validating Data...
                           </>
                         ) : (
                           <>
                             <Shield className="h-4 w-4 mr-2" />
                             Validate Data
                           </>
                         )}
                       </Button>
                     </div>
                   )}

                  {validationErrors.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h6 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Validation Errors
                      </h6>
                      <ul className="text-sm text-red-700 space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isValidData && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h6 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Ready to Import
                      </h6>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• Data validation passed successfully</p>
                        <p>• 150 records will be imported as sub-timelines</p>
                        <p>• All required fields are properly mapped</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {uploadedFile && isValidData && (
              <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  Import Summary
                </h5>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• File: {uploadedFile.name}</p>
                  <p>• Records: 150 rows ready for import</p>
                  <p>• Mapped fields: {Object.keys(columnMapping).length}</p>
                  <p>• Sub-timelines will be created in parent contribution timeline</p>
                </div>
              </div>
            )}
          </div>
        );
      };

      const renderAIGenerated = () => (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI-Generated Inputs
            </h4>
            <p className="text-sm text-muted-foreground">
              Generate missing inputs using AI based on your contribution context and parent timeline requirements.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">Generation Instructions</Label>
              <Textarea
                id="ai-prompt"
                placeholder="Describe what you want to generate... (e.g., 'Generate project milestones for a solar panel installation with a budget of $50,000')"
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsLoading(true);
                // Simulate AI generation
                setTimeout(() => {
                  setGeneratedData({
                    project_title: 'Solar Panel Installation Project',
                    description: 'Complete residential solar panel system installation with battery backup',
                    budget: '50000',
                    timeline: '2024-06-01',
                    category: 'Development',
                    priority: 'High'
                  });
                  setIsLoading(false);
                  toast.success('AI inputs generated successfully!');
                }, 2000);
              }}
              disabled={!aiPrompt.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Inputs
                </>
              )}
            </Button>
          </div>

          {generatedData && (
            <div className="space-y-4">
              <h5 className="font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Generated Preview
              </h5>
              <div className="space-y-3">
                {Object.entries(generatedData).map(([key, value]) => (
                  <div key={key} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">
                        {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{value as string}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Parent Timeline Approval Required</span>
                </div>
                <p className="text-sm text-amber-600">
                  Generated inputs will be sent to the parent timeline owner for approval before being saved as sub-timelines.
                </p>
              </div>
            </div>
          )}
        </div>
      );

      const getIsValidForMethod = () => {
        switch (showCustomInputs) {
          case 'manual':
            return Object.keys(formData).length > 0;
          case 'api':
            // For API validation, check if we have either a selected available API or valid custom API data
            return selectedAPI !== null || (formData.customAPIData && formData.customAPIData.name && formData.customAPIData.baseUrl);
          case 'excel':
            // For excel, we need a different approach since isValidData is defined inside renderExcelImport
            return uploadedFile !== null;
          case 'ai':
            return generatedData !== null;
          default:
            return false;
        }
      };

      return (
        <div className="space-y-6">
          {showCustomInputs === 'manual' && renderManualEntry()}
          {showCustomInputs === 'api' && renderAPIConnection()}
          {showCustomInputs === 'excel' && renderExcelImport()}
          {showCustomInputs === 'ai' && renderAIGenerated()}

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowCustomInputs(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading || !getIsValidForMethod()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </div>
      );
    };

    const getModalTitle = () => {
      switch (showCustomInputs) {
        case 'manual': return 'Manual Entry Configuration';
        case 'api': return 'API Connection Setup';
        case 'excel': return 'Excel Import Configuration';
        case 'ai': return 'AI Input Generation';
        default: return 'Custom Input Configuration';
      }
    };

    // Mobile Implementation with Bottom Drawer
    if (isMobile) {
      return (
        <Drawer open={!!showCustomInputs} onOpenChange={(open) => {
          if (!open) setShowCustomInputs(null);
        }}>
          <DrawerContent className="max-h-[95vh] z-[100] flex flex-col">
            <DrawerHeader className="text-left pb-4 border-b">
              <DrawerTitle className="flex items-center gap-2 text-lg font-semibold">
                {showCustomInputs === 'manual' && <FileText className="h-5 w-5" />}
                {showCustomInputs === 'api' && <Network className="h-5 w-5" />}
                {showCustomInputs === 'excel' && <Upload className="h-5 w-5" />}
                {showCustomInputs === 'ai' && <Zap className="h-5 w-5" />}
                {getModalTitle()}
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-hidden flex flex-col px-4 pb-4">
              <ContentComponent />
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    // Desktop Implementation with Modal Dialog
    return (
      <Dialog open={!!showCustomInputs} onOpenChange={(open) => {
        if (!open) setShowCustomInputs(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col z-[100]">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              {showCustomInputs === 'manual' && <FileText className="h-5 w-5" />}
              {showCustomInputs === 'api' && <Network className="h-5 w-5" />}
              {showCustomInputs === 'excel' && <Upload className="h-5 w-5" />}
              {showCustomInputs === 'ai' && <Zap className="h-5 w-5" />}
              {getModalTitle()}
            </DialogTitle>
            <DialogDescription>
              Configure your custom contribution input method. Data will be saved as sub-timelines within your contribution.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden py-4">
            <ContentComponent />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Render linked timelines modal/drawer
  const renderLinkedTimelinesModal = () => {
    console.log('renderLinkedTimelinesModal called, showLinkedTimelines:', showLinkedTimelines, 'isMobile:', isMobile);
    
    // Early return if modal shouldn't be shown
    if (!showLinkedTimelines) {
      return null;
    }
    
    const filteredTimelines = getFilteredTimelines();
    const selectedTimelines = data.linkedTimelines.filter(t => t.selected);
    const totalPercentage = selectedTimelines.reduce((sum, t) => sum + (t.percentage || 0), 0);

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
      console.log('Rendering mobile drawer, showLinkedTimelines:', showLinkedTimelines);
      return (
        <Drawer open={showLinkedTimelines} onOpenChange={(open) => {
          console.log('Drawer onOpenChange:', open);
          if (!open) {
            setShowLinkedTimelines(false);
            setSearchQuery('');
          }
        }}>
          <DrawerContent className="max-h-[90vh] z-[100]">
            <DrawerHeader className="text-left pb-4">
              <DrawerTitle className="flex items-center gap-2 text-lg font-semibold">
                <Link className="h-5 w-5" />
                Link/Merge Timelines
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 flex-1 overflow-auto">
              <TimelinesContent />
            </div>
            <DrawerFooter className="flex-row gap-3 px-4 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Cancel clicked');
                  setShowLinkedTimelines(false);
                  setSearchQuery('');
                }} 
                className="flex-1"
                disabled={totalPercentage > 100}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Save clicked');
                  saveLinkedTimelines();
                }} 
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
    console.log('Rendering desktop dialog, showLinkedTimelines:', showLinkedTimelines);
    return (
      <Dialog open={showLinkedTimelines} onOpenChange={(open) => {
        console.log('Dialog onOpenChange:', open);
        if (!open) {
          setShowLinkedTimelines(false);
          setSearchQuery('');
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col z-[100]">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Link className="h-5 w-5" />
              Link/Merge Timelines
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select timelines from your portfolio to link with this contribution. Linked timelines can contribute a percentage of their value to enhance your total contribution.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto py-2">
            <TimelinesContent />
          </div>
          <DialogFooter className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Cancel clicked');
                setShowLinkedTimelines(false);
                setSearchQuery('');
              }}
              disabled={totalPercentage > 100}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log('Save clicked');
                saveLinkedTimelines();
              }}
              disabled={totalPercentage > 100}
            >
              <Check className="h-4 w-4 mr-2" />
              Save Links ({selectedTimelines.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render outcomes configuration modal/drawer
  const renderOutcomesModal = () => {

    const OutcomesContent = () => (
      <div className="space-y-6">
        <Tabs value={activeOutcomeTab} onValueChange={(value) => setActiveOutcomeTab(value as 'toGive' | 'toReceive')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="toGive" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              To Give
            </TabsTrigger>
            <TabsTrigger value="toReceive" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              To Receive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="toGive" className="space-y-6 mt-6">
            <div className="text-center pb-4">
              <p className="text-sm text-muted-foreground">
                Configure what outcomes you plan to contribute, organized by category
              </p>
            </div>
            {renderOutcomeCategories('toGive')}
          </TabsContent>

          <TabsContent value="toReceive" className="space-y-6 mt-6">
            <div className="text-center pb-4">
              <p className="text-sm text-muted-foreground">
                Configure what outcomes you expect to receive in return, organized by category
              </p>
            </div>
            {renderOutcomeCategories('toReceive')}
          </TabsContent>
        </Tabs>
      </div>
    );

    // Mobile: Bottom Drawer
    if (isMobile) {
      return (
        <Drawer open={showOutcomesModal} onOpenChange={setShowOutcomesModal}>
          <DrawerContent className="h-[95vh] max-h-[95vh] bg-background border-border z-[100]">
            <DrawerHeader className="border-b border-border bg-background px-6 py-4">
              <DrawerTitle className="text-xl font-semibold text-center">
                Configure Outcomes
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 px-6 py-4">
              <OutcomesContent />
            </ScrollArea>
            <DrawerFooter className="flex-row gap-3 border-t border-border bg-background p-6">
              <Button 
                variant="outline" 
                onClick={() => setShowOutcomesModal(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={saveOutcomesConfiguration} 
                className="flex-1"
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
      <Dialog open={showOutcomesModal} onOpenChange={setShowOutcomesModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-background border-border z-[100]">
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-2xl font-semibold">
              Configure Outcomes
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="py-6">
              <OutcomesContent />
            </div>
          </ScrollArea>
          <DialogFooter className="bg-background border-t border-border pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowOutcomesModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveOutcomesConfiguration}
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderOutcomeCategories = (type: 'toGive' | 'toReceive') => {
    return (
      <div className="space-y-6">
        {/* Financial Contributions */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Financial Contributions</h3>
          </div>
          <div className="space-y-3">
            <div className="grid gap-2">
              {outcomeCategories.financial.map(outcome => (
                <div 
                  key={outcome}
                  className={`p-3 border rounded cursor-pointer text-sm transition-colors ${
                    selectedOutcomes[type].financial.includes(outcome) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleCategoryOutcomeToggle(outcome, 'financial', type)}
                >
                  <Checkbox 
                    checked={selectedOutcomes[type].financial.includes(outcome)}
                    className="mr-2" 
                  />
                  {outcome}
                </div>
              ))}
            </div>
            
            {/* Custom Financial Outcome */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom financial outcome..."
                  value={newCustomInputs.financial}
                  onChange={(e) => setNewCustomInputs(prev => ({ ...prev, financial: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomCategoryOutcome('financial', type, newCustomInputs.financial);
                      setNewCustomInputs(prev => ({ ...prev, financial: '' }));
                    }
                  }}
                />
                <Button 
                  onClick={() => {
                    handleAddCustomCategoryOutcome('financial', type, newCustomInputs.financial);
                    setNewCustomInputs(prev => ({ ...prev, financial: '' }));
                  }}
                  disabled={!newCustomInputs.financial.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {customOutcomes[type].financial.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customOutcomes[type].financial.map((outcome, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {outcome}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveCustomCategoryOutcome(index, 'financial', type)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Intellectual Contributions */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Intellectual Contributions</h3>
          </div>
          <div className="space-y-3">
            <div className="grid gap-2">
              {outcomeCategories.intellectual.map(outcome => (
                <div 
                  key={outcome}
                  className={`p-3 border rounded cursor-pointer text-sm transition-colors ${
                    selectedOutcomes[type].intellectual.includes(outcome) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleCategoryOutcomeToggle(outcome, 'intellectual', type)}
                >
                  <Checkbox 
                    checked={selectedOutcomes[type].intellectual.includes(outcome)}
                    className="mr-2" 
                  />
                  {outcome}
                </div>
              ))}
            </div>
            
            {/* Custom Intellectual Outcome */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom intellectual outcome..."
                  value={newCustomInputs.intellectual}
                  onChange={(e) => setNewCustomInputs(prev => ({ ...prev, intellectual: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomCategoryOutcome('intellectual', type, newCustomInputs.intellectual);
                      setNewCustomInputs(prev => ({ ...prev, intellectual: '' }));
                    }
                  }}
                />
                <Button 
                  onClick={() => {
                    handleAddCustomCategoryOutcome('intellectual', type, newCustomInputs.intellectual);
                    setNewCustomInputs(prev => ({ ...prev, intellectual: '' }));
                  }}
                  disabled={!newCustomInputs.intellectual.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {customOutcomes[type].intellectual.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customOutcomes[type].intellectual.map((outcome, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {outcome}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveCustomCategoryOutcome(index, 'intellectual', type)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Network/Marketing Contributions */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Network className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Network / Marketing Contributions</h3>
          </div>
          <div className="space-y-3">
            <div className="grid gap-2">
              {outcomeCategories.network.map(outcome => (
                <div 
                  key={outcome}
                  className={`p-3 border rounded cursor-pointer text-sm transition-colors ${
                    selectedOutcomes[type].network.includes(outcome) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleCategoryOutcomeToggle(outcome, 'network', type)}
                >
                  <Checkbox 
                    checked={selectedOutcomes[type].network.includes(outcome)}
                    className="mr-2" 
                  />
                  {outcome}
                </div>
              ))}
            </div>
            
            {/* Custom Network Outcome */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom network/marketing outcome..."
                  value={newCustomInputs.network}
                  onChange={(e) => setNewCustomInputs(prev => ({ ...prev, network: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomCategoryOutcome('network', type, newCustomInputs.network);
                      setNewCustomInputs(prev => ({ ...prev, network: '' }));
                    }
                  }}
                />
                <Button 
                  onClick={() => {
                    handleAddCustomCategoryOutcome('network', type, newCustomInputs.network);
                    setNewCustomInputs(prev => ({ ...prev, network: '' }));
                  }}
                  disabled={!newCustomInputs.network.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {customOutcomes[type].network.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customOutcomes[type].network.map((outcome, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {outcome}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveCustomCategoryOutcome(index, 'network', type)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Asset Contributions */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Asset Contributions</h3>
          </div>
          <div className="space-y-3">
            {/* Only Custom Asset Outcome */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Add custom asset-related outcomes you would like to gain/give:
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom asset outcome..."
                  value={newCustomInputs.asset}
                  onChange={(e) => setNewCustomInputs(prev => ({ ...prev, asset: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomCategoryOutcome('asset', type, newCustomInputs.asset);
                      setNewCustomInputs(prev => ({ ...prev, asset: '' }));
                    }
                  }}
                />
                <Button 
                  onClick={() => {
                    handleAddCustomCategoryOutcome('asset', type, newCustomInputs.asset);
                    setNewCustomInputs(prev => ({ ...prev, asset: '' }));
                  }}
                  disabled={!newCustomInputs.asset.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {customOutcomes[type].asset.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customOutcomes[type].asset.map((outcome, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {outcome}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveCustomCategoryOutcome(index, 'asset', type)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
                Configure Outcomes to Give or Receive
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Configure what you plan to contribute and what you expect to receive in return, organized by contribution categories.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Configure Button */}
              <div className="text-center space-y-4">
                <Button 
                  onClick={() => setShowOutcomesModal(true)}
                  size="lg"
                  className="w-full max-w-md"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Configure Outcomes
                </Button>
              </div>

              {/* Summary of Current Configuration */}
              {(data.expectedOutcomes.toGive.length > 0 || data.expectedOutcomes.toReceive.length > 0 || 
                data.expectedOutcomes.customToGive.length > 0 || data.expectedOutcomes.customToReceive.length > 0) && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* To Give Summary */}
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        What I Plan to Give
                      </h4>
                      <div className="space-y-2">
                        {data.expectedOutcomes.toGive.map((outcome, index) => (
                          <Badge key={index} variant="secondary" className="mr-1 mb-1">
                            {outcome}
                          </Badge>
                        ))}
                        {data.expectedOutcomes.customToGive.map((outcome, index) => (
                          <Badge key={`custom-${index}`} variant="outline" className="mr-1 mb-1">
                            {outcome}
                          </Badge>
                        ))}
                        {data.expectedOutcomes.toGive.length === 0 && data.expectedOutcomes.customToGive.length === 0 && (
                          <p className="text-sm text-muted-foreground">No outcomes configured</p>
                        )}
                      </div>
                    </div>

                    {/* To Receive Summary */}
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        What I Expect to Receive
                      </h4>
                      <div className="space-y-2">
                        {data.expectedOutcomes.toReceive.map((outcome, index) => (
                          <Badge key={index} variant="secondary" className="mr-1 mb-1">
                            {outcome}
                          </Badge>
                        ))}
                        {data.expectedOutcomes.customToReceive.map((outcome, index) => (
                          <Badge key={`custom-${index}`} variant="outline" className="mr-1 mb-1">
                            {outcome}
                          </Badge>
                        ))}
                        {data.expectedOutcomes.toReceive.length === 0 && data.expectedOutcomes.customToReceive.length === 0 && (
                          <p className="text-sm text-muted-foreground">No outcomes configured</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Outcomes Configuration Modal/Drawer */}
              {renderOutcomesModal()}
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

      case 4: // Link / Merge / Knot with Other Timelines
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Link / Merge / Knot with Other Timelines
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Connect timelines from your portfolio to enhance this contribution. Each linked timeline can contribute a percentage of its value.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instructions Section */}
              <div className="p-4 bg-muted/30 rounded-lg border border-muted">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  How Timeline Linking Works
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Select timelines from your portfolio that are eligible for linking (based on parent timeline configuration)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Set allocation percentages (0-100%) for each linked timeline</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Linked timeline values automatically update your Step 3 valuation</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Future changes to linked timeline valuations will dynamically update your contribution value</p>
                  </div>
                </div>
              </div>

              {/* Main Action Section */}
              <div className="text-center space-y-4">
                <Button 
                  onClick={() => {
                    console.log('Button clicked, opening timeline selection');
                    console.log('Available timelines:', data.linkedTimelines);
                    console.log('Current isMobile state:', isMobile);
                    setShowLinkedTimelines(true);
                  }}
                  className="w-full h-14 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
                  size="lg"
                >
                  <Link className="h-5 w-5 mr-2" />
                  Select Timelines to Link
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Browse and select from {data.linkedTimelines?.length || 0} available timelines in your portfolio
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
                      onClick={() => {
                        console.log('Edit Links clicked, opening timeline selection');
                        console.log('Current isMobile state:', isMobile);
                        setShowLinkedTimelines(true);
                      }}
                      className="flex-1 transition-all duration-200"
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
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Start by selecting timelines from your portfolio to amplify your contribution value through strategic linking.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      console.log('Browse Available Timelines clicked');
                      console.log('Current isMobile state:', isMobile);
                      setShowLinkedTimelines(true);
                    }}
                    className="h-12 px-6 transition-all duration-200"
                  >
                    <Search className="h-4 w-4 mr-2" />
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
              <p className="text-sm text-muted-foreground">
                Choose how you want to provide the required contribution data to this timeline.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Methods Grid */}
              <div className="space-y-4">
                <h4 className="font-medium">Choose Input Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className={`h-32 flex-col gap-3 hover:border-primary hover:bg-primary/5 transition-all ${
                      data.customInputs.inputMethod === 'manual' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setShowCustomInputs('manual')}
                  >
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <span className="text-sm font-medium block">Manual Entry</span>
                      <span className="text-xs text-muted-foreground">Fill forms with custom fields</span>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={`h-32 flex-col gap-3 hover:border-primary hover:bg-primary/5 transition-all ${
                      data.customInputs.inputMethod === 'api' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setShowCustomInputs('api')}
                  >
                    <Network className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <span className="text-sm font-medium block">API Connection</span>
                      <span className="text-xs text-muted-foreground">Connect external data sources</span>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={`h-32 flex-col gap-3 hover:border-primary hover:bg-primary/5 transition-all ${
                      data.customInputs.inputMethod === 'excel' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setShowCustomInputs('excel')}
                  >
                    <Upload className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <span className="text-sm font-medium block">Excel Import</span>
                      <span className="text-xs text-muted-foreground">Upload and map spreadsheet data</span>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={`h-32 flex-col gap-3 hover:border-primary hover:bg-primary/5 transition-all ${
                      data.customInputs.inputMethod === 'ai' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setShowCustomInputs('ai')}
                  >
                    <Zap className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <span className="text-sm font-medium block">AI Generated</span>
                      <span className="text-xs text-muted-foreground">Auto-generate missing inputs</span>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Current Input Summary */}
              {data.customInputs.inputMethod && (
                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <h5 className="font-medium">Active Input Method</h5>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowCustomInputs(data.customInputs.inputMethod)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium capitalize">
                      {data.customInputs.inputMethod?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.customInputs.inputMethod === 'manual' && 'Forms configured with custom fields for data entry'}
                      {data.customInputs.inputMethod === 'api' && 'External API integration set up for data collection'}
                      {data.customInputs.inputMethod === 'excel' && 'Excel file mapping configured for data import'}
                      {data.customInputs.inputMethod === 'ai' && 'AI generation rules defined for automatic input creation'}
                    </p>
                    {data.customInputs.additionalData && (
                      <div className="mt-2 pt-2 border-t border-primary/20">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Settings className="h-3 w-3" />
                          {Object.keys(data.customInputs.additionalData).length} fields configured
                        </div>
                      </div>
                    )}
                  </div>
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
      {renderCustomInputsModal()}
    </div>
  );
}