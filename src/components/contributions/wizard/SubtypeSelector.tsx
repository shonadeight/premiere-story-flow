import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContributionCategory } from '@/types/contribution';
import { DollarSign, Brain, Network, Package } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubtypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (subtype: { name: string; displayName: string; category: ContributionCategory }) => void;
  selectedSubtypes: Array<{ name: string; direction: string }>;
  currentDirection: string;
}

const FINANCIAL_SUBTYPES = [
  { name: 'cash', displayName: 'Cash' },
  { name: 'debt', displayName: 'Debt' },
  { name: 'equity', displayName: 'Equity Share' },
  { name: 'revenue_share', displayName: 'Revenue Share' },
  { name: 'profit_share', displayName: 'Profit Share' },
  { name: 'pledges', displayName: 'Pledges' }
];

const MARKETING_SUBTYPES = [
  { name: 'leads_onboarding', displayName: 'Leads Onboarding' },
  { name: 'leads_followup', displayName: 'Leads Follow-up' },
  { name: 'leads_conversion', displayName: 'Leads Conversion' },
  { name: 'leads_retention', displayName: 'Leads Retention' }
];

const INTELLECTUAL_SUBTYPES = [
  { name: 'coaching', displayName: 'Coaching' },
  { name: 'tutoring', displayName: 'Tutoring' },
  { name: 'project_development', displayName: 'Project Development' },
  { name: 'project_planning', displayName: 'Project Planning' },
  { name: 'mentorship', displayName: 'Mentorship' },
  { name: 'consultation', displayName: 'Consultation' },
  { name: 'research', displayName: 'Research' },
  { name: 'perspectives', displayName: 'Perspectives & Strategies' },
  { name: 'customer_support', displayName: 'Customer Support' },
  { name: 'capacity_building', displayName: 'Capacity Building' }
];

const ASSET_SUBTYPES = [
  { name: 'farm_tools', displayName: 'Farm Tools' },
  { name: 'land', displayName: 'Land' },
  { name: 'livestock', displayName: 'Livestock' },
  { name: 'seeds', displayName: 'Seeds' },
  { name: 'construction_tools', displayName: 'Construction Tools & Machinery' },
  { name: 'houses', displayName: 'Houses, Rooms & Buildings' },
  { name: 'office_tools', displayName: 'Office Tools' },
  { name: 'office_spaces', displayName: 'Office Spaces' },
  { name: 'digital_assets', displayName: 'Digital Assets' },
  { name: 'software', displayName: 'Software & Apps' },
  { name: 'data_assets', displayName: 'Data Assets' },
  { name: 'vehicles', displayName: 'Vehicles & Trucks' },
  { name: 'custom', displayName: 'Custom Asset' }
];

export const SubtypeSelector = ({ open, onOpenChange, onSelect, selectedSubtypes, currentDirection }: SubtypeSelectorProps) => {
  const isMobile = useIsMobile();
  
  const isSelected = (subtypeName: string) => {
    return selectedSubtypes.some(s => s.name === subtypeName && s.direction === currentDirection);
  };

  const content = (
    <Tabs defaultValue="financial" className="flex-1 overflow-hidden flex flex-col">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="financial">
          <DollarSign className="h-4 w-4 mr-2" />
          Financial
        </TabsTrigger>
        <TabsTrigger value="marketing">
          <Network className="h-4 w-4 mr-2" />
          Marketing
        </TabsTrigger>
        <TabsTrigger value="intellectual">
          <Brain className="h-4 w-4 mr-2" />
          Intellectual
        </TabsTrigger>
        <TabsTrigger value="assets">
          <Package className="h-4 w-4 mr-2" />
          Assets
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-y-auto mt-4">
        <TabsContent value="financial" className="space-y-2 mt-0">
          {FINANCIAL_SUBTYPES.map((subtype) => {
            const selected = isSelected(subtype.name);
            return (
              <Button
                key={subtype.name}
                variant={selected ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onSelect({ ...subtype, category: 'financial' })}
              >
                <Badge variant={selected ? "secondary" : "outline"} className="mr-2">Financial</Badge>
                {subtype.displayName}
                {selected && <Badge className="ml-auto" variant="secondary">✓</Badge>}
              </Button>
            );
          })}
        </TabsContent>

        <TabsContent value="marketing" className="space-y-2 mt-0">
          {MARKETING_SUBTYPES.map((subtype) => {
            const selected = isSelected(subtype.name);
            return (
              <Button
                key={subtype.name}
                variant={selected ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onSelect({ ...subtype, category: 'marketing' })}
              >
                <Badge variant={selected ? "secondary" : "outline"} className="mr-2">Marketing</Badge>
                {subtype.displayName}
                {selected && <Badge className="ml-auto" variant="secondary">✓</Badge>}
              </Button>
            );
          })}
        </TabsContent>

        <TabsContent value="intellectual" className="space-y-2 mt-0">
          {INTELLECTUAL_SUBTYPES.map((subtype) => {
            const selected = isSelected(subtype.name);
            return (
              <Button
                key={subtype.name}
                variant={selected ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onSelect({ ...subtype, category: 'intellectual' })}
              >
                <Badge variant={selected ? "secondary" : "outline"} className="mr-2">Intellectual</Badge>
                {subtype.displayName}
                {selected && <Badge className="ml-auto" variant="secondary">✓</Badge>}
              </Button>
            );
          })}
        </TabsContent>

        <TabsContent value="assets" className="space-y-2 mt-0">
          {ASSET_SUBTYPES.map((subtype) => {
            const selected = isSelected(subtype.name);
            return (
              <Button
                key={subtype.name}
                variant={selected ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onSelect({ ...subtype, category: 'assets' })}
              >
                <Badge variant={selected ? "secondary" : "outline"} className="mr-2">Assets</Badge>
                {subtype.displayName}
                {selected && <Badge className="ml-auto" variant="secondary">✓</Badge>}
              </Button>
            );
          })}
        </TabsContent>
      </div>
    </Tabs>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Select Contribution Types (Multi-select)</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 flex-1 overflow-hidden flex flex-col">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Contribution Types (Multi-select)</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};