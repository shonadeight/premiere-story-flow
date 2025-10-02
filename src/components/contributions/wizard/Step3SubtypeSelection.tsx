import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SelectedSubtype, ContributionDirection, ContributionCategory } from '@/types/contribution';
import { X, Plus, Sparkles } from 'lucide-react';
import { SubtypeSelector } from './SubtypeSelector';
import { TemplateSelector } from './TemplateSelector';
import { useState } from 'react';
import { ContributionTemplate } from '@/lib/templates/contributionTemplates';
import { useToast } from '@/hooks/use-toast';

interface Step3SubtypeSelectionProps {
  selectedSubtypes: SelectedSubtype[];
  currentTab: ContributionDirection;
  setCurrentTab: (tab: ContributionDirection) => void;
  addSubtype: (subtype: SelectedSubtype) => void;
  removeSubtype: (index: number) => void;
  completeLater: boolean;
  setCompleteLater: (value: boolean) => void;
}

export const Step3SubtypeSelection = ({
  selectedSubtypes,
  currentTab,
  setCurrentTab,
  addSubtype,
  removeSubtype,
  completeLater,
  setCompleteLater
}: Step3SubtypeSelectionProps) => {
  const { toast } = useToast();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [templateCategory, setTemplateCategory] = useState<ContributionCategory | null>(null);

  const toGiveSubtypes = selectedSubtypes.filter(s => s.direction === 'to_give');
  const toReceiveSubtypes = selectedSubtypes.filter(s => s.direction === 'to_receive');

  const handleSubtypeSelect = (subtype: { name: string; displayName: string; category: ContributionCategory }) => {
    // Check for duplicates
    const isDuplicate = selectedSubtypes.some(
      s => s.name === subtype.name && s.direction === currentTab
    );
    
    if (isDuplicate) {
      toast({
        title: "Already Added",
        description: `${subtype.displayName} is already in your ${currentTab === 'to_give' ? 'giving' : 'receiving'} list`,
        variant: "destructive"
      });
      return;
    }

    const newSubtype: SelectedSubtype = {
      ...subtype,
      direction: currentTab,
    };
    addSubtype(newSubtype);
    
    toast({
      title: "Added",
      description: `${subtype.displayName} added successfully`,
    });
    
    // Keep selector open for multiselect
  };

  const handleTemplateSelect = (template: ContributionTemplate) => {
    // Check if subtype is already added
    const isDuplicate = selectedSubtypes.some(
      s => s.name === template.subtype && s.direction === currentTab
    );
    
    if (isDuplicate) {
      toast({
        title: "Already Added",
        description: `${template.name} subtype is already in your list`,
        variant: "destructive"
      });
      return;
    }

    // Find the subtype display name
    const allSubtypes = [
      // Financial
      { name: 'cash', displayName: 'Cash', category: 'financial' as const },
      { name: 'debt', displayName: 'Debt', category: 'financial' as const },
      { name: 'equity', displayName: 'Equity Share', category: 'financial' as const },
      { name: 'revenue_share', displayName: 'Revenue Share', category: 'financial' as const },
      // Marketing
      { name: 'leads_onboarding', displayName: 'Leads Onboarding', category: 'marketing' as const },
      { name: 'leads_followup', displayName: 'Leads Follow-up', category: 'marketing' as const },
      { name: 'leads_conversion', displayName: 'Leads Conversion', category: 'marketing' as const },
      // Intellectual
      { name: 'coaching', displayName: 'Coaching', category: 'intellectual' as const },
      { name: 'tutoring', displayName: 'Tutoring', category: 'intellectual' as const },
      { name: 'mentorship', displayName: 'Mentorship', category: 'intellectual' as const },
      { name: 'consultation', displayName: 'Consultation', category: 'intellectual' as const },
      // Assets
      { name: 'farm_tools', displayName: 'Farm Tools', category: 'assets' as const },
      { name: 'land', displayName: 'Land', category: 'assets' as const },
      { name: 'vehicles', displayName: 'Vehicles & Trucks', category: 'assets' as const },
      { name: 'software', displayName: 'Software & Apps', category: 'assets' as const }
    ];
    
    const subtypeDetails = allSubtypes.find(s => s.name === template.subtype);
    
    if (subtypeDetails) {
      addSubtype({
        ...subtypeDetails,
        direction: currentTab
      });
      
      toast({
        title: "Template Applied",
        description: `${template.name} added with pre-configured settings`,
      });
    }
    
    setTemplateSelectorOpen(false);
  };

  const openTemplateSelector = () => {
    const category = selectedSubtypes[0]?.category || 'financial';
    setTemplateCategory(category);
    setTemplateSelectorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Template Selector Button */}
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => setSelectorOpen(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Select Types
        </Button>

        <Button 
          variant="outline" 
          onClick={openTemplateSelector}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Templates
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as ContributionDirection)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="to_give">To Give</TabsTrigger>
          <TabsTrigger value="to_receive">To Receive</TabsTrigger>
        </TabsList>

        <TabsContent value="to_give" className="space-y-4 mt-6">
          <div className="min-h-[200px] p-6 border-2 border-dashed rounded-lg">
            {toGiveSubtypes.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p className="mb-4">No subtypes selected for giving</p>
                <Button onClick={() => setSelectorOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Select Contribution Types
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {toGiveSubtypes.map((subtype, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <Badge variant="outline" className="mr-2 capitalize">{subtype.category}</Badge>
                      <span className="font-medium">{subtype.displayName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtype(selectedSubtypes.indexOf(subtype))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => setSelectorOpen(true)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add More
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="to_receive" className="space-y-4 mt-6">
          <div className="min-h-[200px] p-6 border-2 border-dashed rounded-lg">
            {toReceiveSubtypes.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p className="mb-4">No subtypes selected for receiving</p>
                <Button onClick={() => setSelectorOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Select Contribution Types
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {toReceiveSubtypes.map((subtype, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <Badge variant="outline" className="mr-2 capitalize">{subtype.category}</Badge>
                      <span className="font-medium">{subtype.displayName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtype(selectedSubtypes.indexOf(subtype))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => setSelectorOpen(true)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add More
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/30">
        <Switch
          id="complete-later"
          checked={completeLater}
          onCheckedChange={setCompleteLater}
        />
        <Label htmlFor="complete-later" className="cursor-pointer">
          Complete Later (Save and return to this contribution)
        </Label>
      </div>

      <SubtypeSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleSubtypeSelect}
        selectedSubtypes={selectedSubtypes}
        currentDirection={currentTab}
      />

      {templateCategory && (
        <TemplateSelector
          open={templateSelectorOpen}
          onOpenChange={setTemplateSelectorOpen}
          category={templateCategory}
          onSelectTemplate={handleTemplateSelect}
        />
      )}
    </div>
  );
};
