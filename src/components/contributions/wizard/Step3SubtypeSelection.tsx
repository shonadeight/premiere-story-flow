import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SelectedSubtype, ContributionDirection } from '@/types/contribution';
import { X, Plus } from 'lucide-react';
import { SubtypeSelector } from './SubtypeSelector';
import { useState } from 'react';

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
  const [selectorOpen, setSelectorOpen] = useState(false);

  const toGiveSubtypes = selectedSubtypes.filter(s => s.direction === 'to_give');
  const toReceiveSubtypes = selectedSubtypes.filter(s => s.direction === 'to_receive');

  return (
    <div className="space-y-6">
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
                      <Badge variant="outline" className="mr-2">{subtype.category}</Badge>
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
                      <Badge variant="outline" className="mr-2">{subtype.category}</Badge>
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
        onSelect={(subtype) => {
          addSubtype({ ...subtype, direction: currentTab });
          setSelectorOpen(false);
        }}
      />
    </div>
  );
};