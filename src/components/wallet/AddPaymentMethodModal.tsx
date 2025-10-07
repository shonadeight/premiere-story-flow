import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

interface AddPaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: any) => Promise<void>;
}

export const AddPaymentMethodModal = ({ open, onOpenChange, onAdd }: AddPaymentMethodModalProps) => {
  const [activeTab, setActiveTab] = useState<'mpesa' | 'card' | 'bank_transfer'>('mpesa');
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);

  // M-Pesa fields
  const [mpesaPhone, setMpesaPhone] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardProvider, setCardProvider] = useState('stripe');

  // Bank fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let methodData: any = {
        method_type: activeTab,
        is_primary: isPrimary
      };

      if (activeTab === 'mpesa') {
        methodData.provider = 'mpesa';
        methodData.account_details = { phone: mpesaPhone };
      } else if (activeTab === 'card') {
        methodData.provider = cardProvider;
        methodData.account_details = {
          last4: cardNumber.slice(-4),
          expiry: cardExpiry
        };
      } else if (activeTab === 'bank_transfer') {
        methodData.provider = bankName;
        methodData.account_details = {
          account_number: accountNumber,
          account_name: accountName
        };
      }

      await onAdd(methodData);
      onOpenChange(false);
      
      // Reset form
      setMpesaPhone('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      setIsPrimary(false);
    } catch (error) {
      console.error('Failed to add payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="bank_transfer">Bank</TabsTrigger>
          </TabsList>

          <TabsContent value="mpesa" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mpesa-phone">Phone Number</Label>
              <Input
                id="mpesa-phone"
                placeholder="254712345678"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-provider">Provider</Label>
              <Select value={cardProvider} onValueChange={setCardProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Expiry</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvv">CVV</Label>
                <Input
                  id="card-cvv"
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank_transfer" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kcb">KCB Bank</SelectItem>
                  <SelectItem value="equity">Equity Bank</SelectItem>
                  <SelectItem value="ncba">NCBA Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="primary"
            checked={isPrimary}
            onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
          />
          <Label htmlFor="primary">Set as primary payment method</Label>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? 'Adding...' : 'Add Method'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
