import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  Link,
  X,
  Plus,
  Eye,
  Edit,
  Save,
  Calendar,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { toast } from 'sonner';

interface ContributionFlowProps {
  targetTimeline: Timeline;
  onComplete: (contributionData: any) => void;
  onCancel: () => void;
}

const contributionTypes = [
  {
    id: 'financial',
    name: 'Financial Contribution',
    icon: DollarSign,
    subtypes: [
      { id: 'cash', name: 'Cash', description: 'Direct cash investment' },
      { id: 'debt', name: 'Debt', description: 'Loan with repayment terms' },
      { id: 'pledge', name: 'Pledge', description: 'Future payment commitment' }
    ]
  },
  {
    id: 'intellectual',
    name: 'Intellectual Contribution',
    icon: Brain,
    subtypes: [
      { id: 'ideas', name: 'Ideas', description: 'Innovative concepts and strategies' },
      { id: 'research', name: 'Research', description: 'Research findings and analysis' },
      { id: 'code', name: 'Code/Algorithms', description: 'Software development' },
      { id: 'consultations', name: 'Consultations', description: 'Expert advisory services' },
      { id: 'custom', name: 'Custom Option', description: 'Define your own intellectual contribution' }
    ]
  },
  {
    id: 'network',
    name: 'Network/Marketing Contribution',
    icon: Network,
    subtypes: [
      { id: 'introductions', name: 'Introductions', description: 'Professional networking' },
      { id: 'referrals', name: 'Referrals', description: 'Customer referrals' },
      { id: 'leads', name: 'Leads', description: 'Sales leads generation' },
      { id: 'traffic', name: 'Traffic', description: 'Website/platform traffic' },
      { id: 'likes', name: 'Likes', description: 'Social media engagement' },
      { id: 'comments', name: 'Comments', description: 'Community engagement' },
      { id: 'views', name: 'Views', description: 'Content visibility' },
      { id: 'downloads', name: 'Downloads', description: 'Content downloads' },
      { id: 'custom', name: 'Custom Option', description: 'Define your own marketing contribution' }
    ]
  },
  {
    id: 'assets',
    name: 'Asset Contribution',
    icon: Building,
    subtypes: [
      { id: 'equipment', name: 'Equipment', description: 'Machinery and tools' },
      { id: 'property', name: 'Property', description: 'Real estate assets' },
      { id: 'software', name: 'Software Usage', description: 'Software licenses and tools' },
      { id: 'digital', name: 'Digital Assets', description: 'Digital properties and NFTs' },
      { id: 'office', name: 'Office Space', description: 'Workspace provision' },
      { id: 'land', name: 'Land', description: 'Land and property' },
      { id: 'tools', name: 'Tools', description: 'Specialized tools and equipment' },
      { id: 'custom', name: 'Custom Option', description: 'Define your own asset contribution' }
    ]
  }
];

const valuationMethods = [
  { id: 'fixed', name: 'Fixed Amount', description: 'Set a specific value' },
  { id: 'formula', name: 'Custom Formula', description: 'Use a calculation formula' },
  { id: 'rule', name: 'Custom Rule', description: 'Define conditional rules' }
];

const presentationTemplates = [
  { id: 'table', name: 'Table', description: 'Structured data table format' },
  { id: 'list', name: 'List Items', description: 'Simple list presentation' },
  { id: 'cards', name: 'Cards', description: 'Card-based layout' }
];

export const ContributionFlow: React.FC<ContributionFlowProps> = ({
  targetTimeline,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const isMobile = useIsMobile();
  
  // Main form state
  const [formData, setFormData] = useState<any>({
    // Step 3: Contribution Types
    selectedTypes: [],
    contributionConfigs: {},
    
    // Step 4: Linked Timelines
    linkedTimelines: [],
    
    // Step 5: Custom Inputs
    title: '',
    description: '',
    context: '',
    customFields: {},
    
    // Step 6: Files
    attachments: [],
    
    // Step 7: Presentation
    presentationTemplate: 'list',
    
    // Step 8: Sub-contributions
    allowSubContributions: false,
    subContributionConfig: {},
    
    // Step 9: Final settings
    isDraft: false,
    publishDate: null
  });

  // UI state
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedTypeForConfig, setSelectedTypeForConfig] = useState<string | null>(null);
  const [selectedSubtypeForConfig, setSelectedSubtypeForConfig] = useState<string | null>(null);
  const [customSubtypeName, setCustomSubtypeName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const steps = [
    { id: 1, title: 'Review Timeline', description: 'Review target timeline details' },
    { id: 2, title: 'Timeline Information', description: 'Basic timeline setup' },
    { id: 3, title: 'Configure Types', description: 'Select contribution types & subtypes' },
    { id: 4, title: 'Link Timelines', description: 'Link/merge with other timelines' },
    { id: 5, title: 'Custom Inputs', description: 'Configure custom input fields' },
    { id: 6, title: 'Files & Attachments', description: 'Upload supporting files' },
    { id: 7, title: 'Presentation', description: 'Choose display template' },
    { id: 8, title: 'Sub-contributions', description: 'Configure sub-contribution rules' },
    { id: 9, title: 'Review & Publish', description: 'Final review and publish' }
  ];

  // Mock available timelines for linking
  const mockAvailableTimelines = [
    { id: 'tl-1', title: 'Solar Project Timeline', value: 50000, type: 'project' },
    { id: 'tl-2', title: 'Marketing Campaign', value: 25000, type: 'marketing' },
    { id: 'tl-3', title: 'Research Timeline', value: 35000, type: 'intellectual' },
    { id: 'tl-4', title: 'Equipment Fund', value: 40000, type: 'assets' }
  ];

  const filteredTimelines = mockAvailableTimelines.filter(timeline =>
    timeline.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true;
      case 2: return true;
      case 3: return formData.selectedTypes.length > 0;
      case 4: return true; // Optional step
      case 5: return formData.title && formData.description;
      case 6: return true; // Optional step
      case 7: return formData.presentationTemplate;
      case 8: return true; // Optional step
      case 9: return true;
      default: return false;
    }
  };

  const handleTypeSelection = (typeId: string, selected: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedTypes: selected 
        ? [...prev.selectedTypes, typeId]
        : prev.selectedTypes.filter((t: string) => t !== typeId)
    }));
  };

  const openTypeConfig = (typeId: string, subtypeId: string) => {
    setSelectedTypeForConfig(typeId);
    setSelectedSubtypeForConfig(subtypeId);
    setShowTypeModal(true);
  };

  const saveTypeConfig = (config: any) => {
    setFormData(prev => ({
      ...prev,
      contributionConfigs: {
        ...prev.contributionConfigs,
        [`${selectedTypeForConfig}-${selectedSubtypeForConfig}`]: config
      }
    }));
    setShowTypeModal(false);
    setSelectedTypeForConfig(null);
    setSelectedSubtypeForConfig(null);
    setCustomSubtypeName('');
  };

  const handleTimelineLink = (timelineId: string, allocation: number) => {
    setFormData(prev => ({
      ...prev,
      linkedTimelines: [
        ...prev.linkedTimelines.filter((tl: any) => tl.id !== timelineId),
        { id: timelineId, allocation, title: mockAvailableTimelines.find(t => t.id === timelineId)?.title }
      ]
    }));
  };

  // Calculate dynamic valuation from linked timelines
  const calculateLinkedTimelineValue = (): number => {
    if (!formData.linkedTimelines || formData.linkedTimelines.length === 0) return 0;
    
    return formData.linkedTimelines.reduce((total: number, timeline: any) => {
      const value = timeline.value || 0;
      const allocation = timeline.allocation || 0;
      return total + (value * allocation / 100);
    }, 0);
  };

  const handleSubmit = () => {
    onComplete({
      ...formData,
      targetTimelineId: targetTimeline.id,
      submittedAt: new Date().toISOString()
    });
    toast.success('Contribution submitted successfully!');
  };

  const handleSaveDraft = () => {
    setFormData(prev => ({ ...prev, isDraft: true }));
    toast.success('Draft saved successfully!');
  };

  const TypeConfigModal = () => {
    const [config, setConfig] = useState({
      subtype: selectedSubtypeForConfig,
      customName: '',
      valuation: { method: 'fixed', value: '', formula: '', rule: '' },
      amount: '',
      expectedGain: '',
      negotiable: false,
      repaymentDate: '',
      interestRate: ''
    });

    const currentType = contributionTypes.find(t => t.id === selectedTypeForConfig);
    const currentSubtype = currentType?.subtypes.find(s => s.id === selectedSubtypeForConfig);
    const isCustom = selectedSubtypeForConfig === 'custom';

    const ConfigContent = () => (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {currentType?.name} - {isCustom ? 'Custom Option' : currentSubtype?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isCustom ? 'Define your custom contribution' : currentSubtype?.description}
          </p>
        </div>

        {isCustom && (
          <div>
            <Label htmlFor="customName">Custom Contribution Name</Label>
            <Input
              id="customName"
              value={config.customName}
              onChange={(e) => setConfig(prev => ({ ...prev, customName: e.target.value }))}
              placeholder="e.g., UX Framework, AI Model Training"
            />
          </div>
        )}

        {/* Financial-specific fields */}
        {selectedTypeForConfig === 'financial' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={config.amount}
                onChange={(e) => setConfig(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
              />
            </div>

            {selectedSubtypeForConfig === 'debt' && (
              <>
                <div>
                  <Label htmlFor="repaymentDate">Expected Repayment Date</Label>
                  <Input
                    id="repaymentDate"
                    type="date"
                    value={config.repaymentDate}
                    onChange={(e) => setConfig(prev => ({ ...prev, repaymentDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={config.interestRate}
                    onChange={(e) => setConfig(prev => ({ ...prev, interestRate: e.target.value }))}
                    placeholder="e.g., 5.5"
                  />
                </div>
              </>
            )}

            {selectedSubtypeForConfig === 'pledge' && (
              <div>
                <Label htmlFor="expectedDate">Expected Date</Label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={config.repaymentDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, repaymentDate: e.target.value }))}
                />
              </div>
            )}
          </div>
        )}

        {/* Valuation method selection */}
        <div>
          <Label>Valuation Method</Label>
          <RadioGroup
            value={config.valuation.method}
            onValueChange={(value) => setConfig(prev => ({ 
              ...prev, 
              valuation: { ...prev.valuation, method: value } 
            }))}
            className="mt-2"
          >
            {valuationMethods.map(method => (
              <div key={method.id} className="flex items-center space-x-2">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex-1">
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Valuation input based on method */}
        {config.valuation.method === 'fixed' && (
          <div>
            <Label htmlFor="valuationValue">Fixed Amount</Label>
            <Input
              id="valuationValue"
              type="number"
              value={config.valuation.value}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                valuation: { ...prev.valuation, value: e.target.value } 
              }))}
              placeholder="Enter fixed amount"
            />
          </div>
        )}

        {config.valuation.method === 'formula' && (
          <div>
            <Label htmlFor="valuationFormula">Custom Formula</Label>
            <Textarea
              id="valuationFormula"
              value={config.valuation.formula}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                valuation: { ...prev.valuation, formula: e.target.value } 
              }))}
              placeholder="e.g., hours * rate + bonus"
            />
          </div>
        )}

        {config.valuation.method === 'rule' && (
          <div>
            <Label htmlFor="valuationRule">Custom Rule</Label>
            <Textarea
              id="valuationRule"
              value={config.valuation.rule}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                valuation: { ...prev.valuation, rule: e.target.value } 
              }))}
              placeholder="e.g., If milestone reached, pay 10% of project value"
            />
          </div>
        )}

        <div>
          <Label htmlFor="expectedGain">Expected % Gain</Label>
          <Input
            id="expectedGain"
            type="number"
            value={config.expectedGain}
            onChange={(e) => setConfig(prev => ({ ...prev, expectedGain: e.target.value }))}
            placeholder="e.g., 15"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="negotiable"
            checked={config.negotiable}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, negotiable: !!checked }))}
          />
          <Label htmlFor="negotiable">Allow negotiation with parent owner</Label>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => saveTypeConfig(config)} className="flex-1">
            Save Configuration
          </Button>
          <Button variant="outline" onClick={() => setShowTypeModal(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );

    if (isMobile) {
      return (
        <Drawer open={showTypeModal} onOpenChange={setShowTypeModal}>
          <DrawerContent className="p-6">
            <DrawerHeader>
              <DrawerTitle>Configure Contribution</DrawerTitle>
            </DrawerHeader>
            <div className="max-h-[70vh] overflow-y-auto">
              <ConfigContent />
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={showTypeModal} onOpenChange={setShowTypeModal}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Contribution</DialogTitle>
          </DialogHeader>
          <ConfigContent />
        </DialogContent>
      </Dialog>
    );
  };

  const LinkTimelinesModal = () => {
    const [selectedTimelines, setSelectedTimelines] = useState<string[]>([]);
    const [allocations, setAllocations] = useState<{[key: string]: string}>({});
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    // Filter timelines based on local search query
    const filteredTimelinesForModal = mockAvailableTimelines.filter(timeline =>
      timeline.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      timeline.type.toLowerCase().includes(localSearchQuery.toLowerCase())
    );

    useEffect(() => {
      // Initialize with saved data when modal opens
      if (showLinkModal) {
        const saved = formData.linkedTimelines || [];
        setSelectedTimelines(saved.map((tl: any) => tl.id));
        setAllocations(saved.reduce((acc: any, tl: any) => ({ 
          ...acc, 
          [tl.id]: tl.allocation ? tl.allocation.toString() : '' 
        }), {}));
        setLocalSearchQuery('');
      }
    }, [showLinkModal, formData.linkedTimelines]);

    const handleTimelineToggle = (timelineId: string) => {
      setSelectedTimelines(prev => {
        if (prev.includes(timelineId)) {
          // Remove timeline and its allocation
          setAllocations(prevAllocations => {
            const newAllocations = { ...prevAllocations };
            delete newAllocations[timelineId];
            return newAllocations;
          });
          return prev.filter(id => id !== timelineId);
        } else {
          // Add timeline
          return [...prev, timelineId];
        }
      });
    };

    const handleAllocationChange = (timelineId: string, value: string) => {
      // Validate input - only allow numbers between 0-100
      if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
        setAllocations(prev => ({ ...prev, [timelineId]: value }));
      }
    };

    const getTotalAllocation = () => {
      return Object.values(allocations).reduce((sum, val) => {
        const numVal = parseFloat(val);
        return sum + (isNaN(numVal) ? 0 : numVal);
      }, 0);
    };

    const validateAndSave = () => {
      // Validate allocations
      for (const timelineId of selectedTimelines) {
        const allocation = allocations[timelineId];
        if (allocation && allocation.trim() !== '') {
          const numVal = parseFloat(allocation);
          if (isNaN(numVal) || numVal < 0 || numVal > 100) {
            toast.error('All allocation percentages must be between 0-100');
            return;
          }
        }
      }

      const totalAllocation = getTotalAllocation();
      if (totalAllocation > 100) {
        toast.error('Total allocation cannot exceed 100%');
        return;
      }

      // Create linked timeline data
      const linkedData = selectedTimelines.map(id => {
        const timeline = mockAvailableTimelines.find(t => t.id === id);
        const allocation = parseFloat(allocations[id] || '0') || 0;
        return {
          id,
          allocation,
          title: timeline?.title || 'Unknown Timeline',
          value: timeline?.value || 0,
          type: timeline?.type || 'unknown'
        };
      });

      // Save to form data
      setFormData(prev => ({ ...prev, linkedTimelines: linkedData }));
      setShowLinkModal(false);
      setLocalSearchQuery('');
      toast.success(`${linkedData.length} timeline(s) linked successfully`);
    };

    const handleCancel = () => {
      setShowLinkModal(false);
      setLocalSearchQuery('');
      // Reset to original state
      const saved = formData.linkedTimelines || [];
      setSelectedTimelines(saved.map((tl: any) => tl.id));
      setAllocations(saved.reduce((acc: any, tl: any) => ({ 
        ...acc, 
        [tl.id]: tl.allocation ? tl.allocation.toString() : '' 
      }), {}));
    };

    const LinkContent = () => (
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search timelines by name or type..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Timeline List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Available Timelines ({filteredTimelinesForModal.length})</span>
            {selectedTimelines.length > 0 && (
              <span>{selectedTimelines.length} selected</span>
            )}
          </div>
          
          <ScrollArea className="h-64 border rounded-lg">
            <div className="p-2 space-y-2">
              {filteredTimelinesForModal.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No timelines found matching your search</p>
                </div>
              ) : (
                filteredTimelinesForModal.map(timeline => {
                  const isSelected = selectedTimelines.includes(timeline.id);
                  const allocation = allocations[timeline.id] || '';
                  
                  return (
                    <Card key={timeline.id} className={`p-3 transition-colors ${isSelected ? 'bg-primary/5 border-primary/20' : ''}`}>
                      <div className="space-y-3">
                        {/* Timeline Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleTimelineToggle(timeline.id)}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{timeline.title}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="capitalize">{timeline.type}</span>
                                <span>${timeline.value.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Allocation Input - Only show when selected */}
                        {isSelected && (
                          <div className="ml-8 flex items-center space-x-2">
                            <Label className="text-sm font-medium">Allocation:</Label>
                            <div className="flex items-center space-x-1">
                              <Input
                                type="number"
                                placeholder="0"
                                value={allocation}
                                onChange={(e) => handleAllocationChange(timeline.id, e.target.value)}
                                className="w-20 h-8"
                                min="0"
                                max="100"
                                step="0.1"
                              />
                              <Percent className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {allocation && parseFloat(allocation) > 0 && (
                              <span className="text-xs text-muted-foreground">
                                ≈ ${((timeline.value * parseFloat(allocation)) / 100).toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Summary Section */}
        {selectedTimelines.length > 0 && (
          <Card className="p-3 bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Selected Timelines:</span>
                <span className="text-sm">{selectedTimelines.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Allocation:</span>
                <span className={`text-sm font-bold ${
                  getTotalAllocation() > 100 ? 'text-destructive' : 'text-foreground'
                }`}>
                  {getTotalAllocation().toFixed(1)}%
                </span>
              </div>
              {getTotalAllocation() > 100 && (
                <div className="flex items-center gap-2 text-destructive text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>Total allocation exceeds 100%</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={validateAndSave} 
            className="flex-1"
            disabled={selectedTimelines.length === 0 || getTotalAllocation() > 100}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Linked Timelines
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    );

    if (isMobile) {
      return (
        <Drawer open={showLinkModal} onOpenChange={setShowLinkModal}>
          <DrawerContent className="p-6">
            <DrawerHeader>
              <DrawerTitle>Link / Merge Timelines</DrawerTitle>
            </DrawerHeader>
            <LinkContent />
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Link / Merge Timelines</DialogTitle>
          </DialogHeader>
          <LinkContent />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onCancel} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-semibold">ShonaCoin Contribution</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </p>
          </div>
          <div className="w-10" />
        </div>
        <div className="mt-4">
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Review Timeline */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Target Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg">{targetTimeline.title}</h3>
                <p className="text-muted-foreground mt-2">{targetTimeline.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Value</Label>
                    <p className="font-semibold">${targetTimeline.value?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Type</Label>
                    <p className="font-semibold capitalize">{targetTimeline.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Timeline Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  On signup, your profile becomes the default root timeline. This contribution will be linked to your profile timeline.
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Profile Timeline Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your contribution will be tracked and valued within your portfolio timeline.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Configure Contribution Types & Subtypes */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Dynamic Valuation Alert - Show when linked timelines exist */}
            {formData.linkedTimelines && formData.linkedTimelines.length > 0 && calculateLinkedTimelineValue() > 0 && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Dynamic Valuation Active</h4>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    Your contribution valuation is dynamically linked to {formData.linkedTimelines.length} timeline(s).
                    Values will update automatically when linked timeline valuations change.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">Current Linked Value:</span>
                      <span className="font-bold text-blue-900">
                        ${calculateLinkedTimelineValue().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">Total Allocation:</span>
                      <span className="font-medium text-blue-900">
                        {formData.linkedTimelines.reduce((sum: number, t: any) => sum + (t.allocation || 0), 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Select Contribution Types</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose the types of contributions you want to make. Each type must be configured to completion.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributionTypes.map(type => {
                    const TypeIcon = type.icon;
                    const isSelected = formData.selectedTypes.includes(type.id);
                    
                    return (
                      <div key={type.id} className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleTypeSelection(type.id, !!checked)}
                          />
                          <TypeIcon className="h-5 w-5" />
                          <span className="font-medium">{type.name}</span>
                        </div>
                        
                        {isSelected && (
                          <div className="ml-8 space-y-2">
                            <p className="text-sm text-muted-foreground">Select subtypes to configure:</p>
                            <div className="grid gap-2">
                              {type.subtypes.map(subtype => (
                                <Button
                                  key={subtype.id}
                                  variant="outline"
                                  className="justify-start h-auto p-3"
                                  onClick={() => openTypeConfig(type.id, subtype.id)}
                                >
                                  <div className="text-left">
                                    <p className="font-medium">{subtype.name}</p>
                                    <p className="text-sm text-muted-foreground">{subtype.description}</p>
                                  </div>
                                  {formData.contributionConfigs[`${type.id}-${subtype.id}`] && (
                                    <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                  )}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Summary of configured contributions */}
                {Object.keys(formData.contributionConfigs).length > 0 && (
                  <div className="mt-6 p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Contribution Summary</h4>
                    <div className="space-y-2">
                      {Object.entries(formData.contributionConfigs).map(([key, config]: [string, any]) => {
                        const [typeId, subtypeId] = key.split('-');
                        const type = contributionTypes.find(t => t.id === typeId);
                        const subtype = type?.subtypes.find(s => s.id === subtypeId);
                        
                        return (
                          <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                            <div>
                              <p className="font-medium">
                                {config.customName || subtype?.name} ({type?.name})
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {config.valuation.method === 'fixed' && `$${config.valuation.value}`}
                                {config.expectedGain && ` • ${config.expectedGain}% expected gain`}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openTypeConfig(typeId, subtypeId)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Link / Merge / Knot with Other Timelines */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Link / Merge / Knot with Other Timelines</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect this contribution with other timelines from your portfolio. 
                  Allocate percentages to dynamically update valuations in Step 3.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => setShowLinkModal(true)} className="w-full" size="lg">
                  <Link className="h-4 w-4 mr-2" />
                  Select timelines to link
                </Button>

                {/* Dynamic Valuation Update Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Dynamic Valuation</span>
                  </div>
                  <p className="text-xs text-blue-800 mt-1">
                    Setting allocation percentages will automatically update your contribution valuation in Step 3.
                    If linked timeline values change later, your valuation updates accordingly.
                  </p>
                </div>

                {/* Linked Timelines Summary */}
                {formData.linkedTimelines && formData.linkedTimelines.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Linked Timelines ({formData.linkedTimelines.length})</h4>
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowLinkModal(true)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.linkedTimelines.map((timeline: any) => (
                        <Card key={timeline.id} className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm">{timeline.title}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {timeline.type} • ${timeline.value?.toLocaleString() || 'N/A'}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={timeline.allocation > 0 ? "default" : "secondary"}>
                                {timeline.allocation}%
                              </Badge>
                              {timeline.allocation > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  ≈ ${((timeline.value * timeline.allocation) / 100).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                      
                      {/* Total Allocation Summary */}
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Allocation:</span>
                          <span className="text-sm font-bold">
                            {formData.linkedTimelines.reduce((sum: number, tl: any) => sum + (tl.allocation || 0), 0).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">Estimated Value:</span>
                          <span className="text-xs font-medium">
                            ${formData.linkedTimelines.reduce((sum: number, tl: any) => {
                              return sum + ((tl.value * (tl.allocation || 0)) / 100);
                            }, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {(!formData.linkedTimelines || formData.linkedTimelines.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No timelines linked yet</p>
                    <p className="text-xs">Link timelines to create dynamic valuation updates</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Custom Inputs */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Inputs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure the required fields for this contribution.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter contribution title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your contribution"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="context">Context</Label>
                  <Textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                    placeholder="Provide additional context"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 6: Files & Attachments */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Files & Attachments</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload supporting documents, images, or other files.
                </p>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports all file types • Max 20MB per file
                  </p>
                  <Button variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">Uploaded Files:</p>
                    {formData.attachments.map((file: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>{file.name}</span>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 7: Presentation Template */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Presentation Template</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose how your contribution will be displayed.
                </p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.presentationTemplate}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, presentationTemplate: value }))}
                  className="space-y-3"
                >
                  {presentationTemplates.map(template => (
                    <div key={template.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value={template.id} id={template.id} />
                      <Label htmlFor={template.id} className="flex-1">
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 8: Sub-contributions */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configure Sub-Contributions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Allow others to build on this contribution by enabling sub-contributions.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowSubContributions"
                    checked={formData.allowSubContributions}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowSubContributions: !!checked }))}
                  />
                  <Label htmlFor="allowSubContributions">Enable sub-contributions</Label>
                </div>

                {formData.allowSubContributions && (
                  <div className="space-y-4 pl-6 border-l-2 border-muted">
                    <p className="text-sm text-muted-foreground">
                      Sub-contribution settings would be configured here, including:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Allowed contribution types</li>
                      <li>Outcome-sharing rules</li>
                      <li>Access levels and roles</li>
                      <li>Payment integration</li>
                      <li>Custom ratings and reviews</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 9: Review & Publish */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Review & Publish</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Final review of your contribution before publishing.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Contribution Summary</h4>
                    <p className="text-sm text-muted-foreground">{formData.title}</p>
                    <p className="text-sm text-muted-foreground">{formData.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Selected Types</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.selectedTypes.map((typeId: string) => {
                        const type = contributionTypes.find(t => t.id === typeId);
                        return (
                          <Badge key={typeId} variant="secondary">
                            {type?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {formData.linkedTimelines.length > 0 && (
                    <div>
                      <h4 className="font-medium">Linked Timelines</h4>
                      <div className="space-y-1 mt-1">
                        {formData.linkedTimelines.map((timeline: any) => (
                          <div key={timeline.id} className="flex justify-between text-sm">
                            <span>{timeline.title}</span>
                            <span>{timeline.allocation}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium">Presentation</h4>
                    <p className="text-sm text-muted-foreground">
                      {presentationTemplates.find(t => t.id === formData.presentationTemplate)?.name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    Publish Contribution
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="border-t bg-card p-4">
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
            disabled={currentStep === steps.length || !canProceed()}
          >
            {currentStep === steps.length ? 'Complete' : 'Next'}
            {currentStep < steps.length && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <TypeConfigModal />
      <LinkTimelinesModal />
    </div>
  );
};