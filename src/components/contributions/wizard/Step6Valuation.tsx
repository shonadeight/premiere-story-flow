import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ValuationAdder } from '../adders/ValuationAdder';
import { SelectedSubtype } from '@/types/contribution';
import { Plus, DollarSign, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step6ValuationProps {
  selectedSubtypes: SelectedSubtype[];
  contributionId: string;
}

export const Step6Valuation = ({ selectedSubtypes, contributionId }: Step6ValuationProps) => {
  const [currentTab, setCurrentTab] = useState<'to_give' | 'to_receive'>('to_give');
  const [adderOpen, setAdderOpen] = useState(false);
  const [valuations, setValuations] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSaveValuation = async (valuation: any) => {
    try {
      const { error } = await supabase
        .from('contribution_valuations')
        .insert({
          contribution_id: contributionId,
          valuation_type: valuation.type,
          amount: valuation.amount,
          currency: valuation.currency,
          formula: valuation.formula,
          direction: currentTab,
        });

      if (error) throw error;

      setValuations([...valuations, valuation]);
      toast({
        title: "Success",
        description: "Valuation saved successfully",
      });
    } catch (error) {
      console.error('Error saving valuation:', error);
      toast({
        title: "Error",
        description: "Failed to save valuation",
        variant: "destructive"
      });
    }
  };

  const toGiveSubtypes = selectedSubtypes.filter(s => s.direction === 'to_give');
  const toReceiveSubtypes = selectedSubtypes.filter(s => s.direction === 'to_receive');

  return (
    <div className="space-y-4">
      <Alert>
        <DollarSign className="h-4 w-4" />
        <AlertDescription>
          Set valuation for your contributions. You can use fixed amounts, custom formulas, or percentage-based valuation.
        </AlertDescription>
      </Alert>

      <Tabs value={currentTab} onValueChange={(v: any) => setCurrentTab(v)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="to_give">To Give</TabsTrigger>
          <TabsTrigger value="to_receive">To Receive</TabsTrigger>
        </TabsList>

        <TabsContent value="to_give" className="space-y-3">
          <Button onClick={() => setAdderOpen(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Valuation
          </Button>

          {valuations.filter(v => v.direction === 'to_give').length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No valuations configured yet
            </p>
          )}

          {valuations.filter(v => v.direction === 'to_give').map((val, i) => (
            <Card key={i} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{val.type === 'fixed' ? `${val.currency} ${val.amount}` : val.formula || `${val.percentage}%`}</p>
                  <p className="text-sm text-muted-foreground capitalize">{val.type} Valuation</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="to_receive" className="space-y-3">
          <Button onClick={() => setAdderOpen(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Valuation
          </Button>

          {valuations.filter(v => v.direction === 'to_receive').length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No valuations configured yet
            </p>
          )}

          {valuations.filter(v => v.direction === 'to_receive').map((val, i) => (
            <Card key={i} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{val.type === 'fixed' ? `${val.currency} ${val.amount}` : val.formula || `${val.percentage}%`}</p>
                  <p className="text-sm text-muted-foreground capitalize">{val.type} Valuation</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <ValuationAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveValuation}
        selectedSubtypes={selectedSubtypes}
        direction={currentTab}
      />
    </div>
  );
};
