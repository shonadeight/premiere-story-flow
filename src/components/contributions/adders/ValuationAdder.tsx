import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { SelectedSubtype } from '@/types/contribution';
import { DollarSign, Percent, Calculator } from 'lucide-react';
import { valuationSchema } from '@/lib/validation/contributionSchemas';
import { useToast } from '@/hooks/use-toast';

interface ValuationAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (valuation: any) => void;
  selectedSubtypes: SelectedSubtype[];
  direction: 'to_give' | 'to_receive';
}

export const ValuationAdder = ({ open, onOpenChange, onSave, selectedSubtypes, direction }: ValuationAdderProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [valuationType, setValuationType] = useState<'fixed' | 'formula' | 'percentage'>('fixed');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [formula, setFormula] = useState('');
  const [percentage, setPercentage] = useState('');

  const handleSave = () => {
    try {
      const valuation = {
        type: valuationType,
        amount: valuationType === 'fixed' ? parseFloat(amount) : undefined,
        currency: valuationType === 'fixed' ? currency : undefined,
        formula: valuationType === 'formula' ? formula : undefined,
        percentage: valuationType === 'percentage' ? parseFloat(percentage) : undefined,
        direction
      };

      // Validate with zod
      const validated = valuationSchema.parse(valuation);
      
      onSave(validated);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error.message || "Please check your inputs",
        variant: "destructive"
      });
    }
  };

  const content = (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Valuation Type</Label>
        <Select value={valuationType} onValueChange={(v: any) => setValuationType(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Fixed Amount
              </div>
            </SelectItem>
            <SelectItem value="formula">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Custom Formula
              </div>
            </SelectItem>
            <SelectItem value="percentage">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Percentage
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {valuationType === 'fixed' && (
        <>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {valuationType === 'formula' && (
        <div className="space-y-2">
          <Label>Custom Formula</Label>
          <Textarea
            placeholder="e.g., $10 per lead, $5 per click"
            value={formula}
            onChange={(e) => setFormula(e.target.value.slice(0, 500))}
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">{formula.length}/500</p>
        </div>
      )}

      {valuationType === 'percentage' && (
        <div className="space-y-2">
          <Label>Percentage (%)</Label>
          <Input
            type="number"
            placeholder="Enter percentage"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            min="0"
            max="100"
          />
        </div>
      )}

      <Button onClick={handleSave} className="w-full">Save Valuation</Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Set Valuation - {direction === 'to_give' ? 'To Give' : 'To Receive'}</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Valuation - {direction === 'to_give' ? 'To Give' : 'To Receive'}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
