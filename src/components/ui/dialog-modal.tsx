import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export const WithdrawModal = ({ isOpen, onClose, availableBalance }: WithdrawModalProps) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount" });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > availableBalance) {
      toast({ 
        title: "Insufficient funds",
        description: "You don't have enough available balance for this withdrawal."
      });
      return;
    }

    toast({ 
      title: "Withdrawal initiated",
      description: `$${withdrawAmount.toLocaleString()} withdrawal request has been processed.`
    });
    
    setAmount('');
    setReason('');
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Available balance: {formatCurrency(availableBalance)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Amount (USD)</label>
            <Input
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={availableBalance}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Withdrawal Method</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="airtel">Airtel Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Reason (Optional)</label>
            <Textarea
              placeholder="Brief reason for withdrawal..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleWithdraw} className="flex-1">
              Withdraw {amount && `$${parseFloat(amount).toLocaleString()}`}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};