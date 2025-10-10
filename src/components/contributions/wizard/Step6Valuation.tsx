import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ValuationAdder } from '../adders/ValuationAdder';
import { NegotiationAdder } from '../negotiation/NegotiationAdder';
import { SelectedSubtype } from '@/types/contribution';
import { Plus, DollarSign, Trash2, HandshakeIcon, Users, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Step6ValuationProps {
  selectedSubtypes: SelectedSubtype[];
  contributionId: string;
}

export const Step6Valuation = ({ selectedSubtypes, contributionId }: Step6ValuationProps) => {
  const [currentTab, setCurrentTab] = useState<'to_give' | 'to_receive'>('to_give');
  const [adderOpen, setAdderOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [valuations, setValuations] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSaveValuation = async (valuation: any) => {
    try {
      const subtypeToApply = selectedSubtype === 'all' 
        ? selectedSubtypes.filter(s => s.direction === currentTab).map(s => s.name)
        : [selectedSubtype];

      const insertData = subtypeToApply.map(subtypeName => ({
        contribution_id: contributionId,
        valuation_type: valuation.type,
        amount: valuation.amount,
        currency: valuation.currency,
        formula: valuation.formula,
        direction: currentTab,
        subtype_name: subtypeName,
      }));

      const { error } = await supabase
        .from('contribution_valuations')
        .insert(insertData);

      if (error) throw error;

      setValuations([...valuations, { ...valuation, subtypes: subtypeToApply }]);
      toast({
        title: "Success",
        description: `Valuation saved for ${selectedSubtype === 'all' ? 'all subtypes' : selectedSubtype}`,
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

  const calculateTotal = (direction: 'to_give' | 'to_receive') => {
    const directionValuations = valuations.filter(v => v.direction === direction);
    const total = directionValuations.reduce((sum, v) => {
      if (v.type === 'fixed' && v.amount) {
        return sum + parseFloat(v.amount);
      }
      return sum;
    }, 0);
    return total;
  };

  return (
    <div className="space-y-4 min-h-0 flex-1 overflow-y-auto">
      <Alert>
        <DollarSign className="h-4 w-4" />
        <AlertDescription>
          Set valuation for your contributions. You can use fixed amounts, custom formulas, or percentage-based valuation.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={bulkMode ? "default" : "outline"}
          size="sm"
          onClick={() => setBulkMode(!bulkMode)}
        >
          <Users className="h-4 w-4 mr-2" />
          {bulkMode ? 'Individual Mode' : 'Bulk Setup'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNegotiationOpen(true)}
        >
          <HandshakeIcon className="h-4 w-4 mr-2" />
          Negotiate
        </Button>
      </div>

      {!bulkMode && (
        <div className="space-y-2">
          <Label>Select Subtype</Label>
          <Select value={selectedSubtype} onValueChange={setSelectedSubtype}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subtypes (Aggregate)</SelectItem>
              {selectedSubtypes.filter(s => s.direction === currentTab).map((subtype) => (
                <SelectItem key={subtype.name} value={subtype.name}>
                  {subtype.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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

          {calculateTotal('to_give') > 0 && (
            <Card className="p-4 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total Valuation</p>
                    <p className="text-xs text-muted-foreground">Aggregate Fixed Amounts</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">USD {calculateTotal('to_give').toFixed(2)}</p>
              </div>
            </Card>
          )}

          {valuations.filter(v => v.direction === 'to_give').length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No valuations configured yet
            </p>
          )}

          {valuations.filter(v => v.direction === 'to_give').map((val, i) => (
            <Card key={i} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{val.type === 'fixed' ? `${val.currency} ${val.amount}` : val.formula || `${val.percentage}%`}</p>
                  <p className="text-sm text-muted-foreground capitalize">{val.type} Valuation</p>
                  {val.subtypes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied to: {val.subtypes.length === selectedSubtypes.filter(s => s.direction === 'to_give').length ? 'All subtypes' : val.subtypes.join(', ')}
                    </p>
                  )}
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

          {calculateTotal('to_receive') > 0 && (
            <Card className="p-4 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total Valuation</p>
                    <p className="text-xs text-muted-foreground">Aggregate Fixed Amounts</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">USD {calculateTotal('to_receive').toFixed(2)}</p>
              </div>
            </Card>
          )}

          {valuations.filter(v => v.direction === 'to_receive').length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No valuations configured yet
            </p>
          )}

          {valuations.filter(v => v.direction === 'to_receive').map((val, i) => (
            <Card key={i} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{val.type === 'fixed' ? `${val.currency} ${val.amount}` : val.formula || `${val.percentage}%`}</p>
                  <p className="text-sm text-muted-foreground capitalize">{val.type} Valuation</p>
                  {val.subtypes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied to: {val.subtypes.length === selectedSubtypes.filter(s => s.direction === 'to_receive').length ? 'All subtypes' : val.subtypes.join(', ')}
                    </p>
                  )}
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

      <NegotiationAdder
        open={negotiationOpen}
        onOpenChange={setNegotiationOpen}
        contributionId={contributionId}
        mode="flexible"
        giverUserId=""
        receiverUserId=""
      />
    </div>
  );
};
