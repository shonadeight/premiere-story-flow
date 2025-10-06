import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp } from 'lucide-react';

interface ProposalFormProps {
  onSubmit: (proposalData: any, message?: string) => void;
  contributionId: string;
}

export const ProposalForm = ({ onSubmit, contributionId }: ProposalFormProps) => {
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const handleSubmit = () => {
    const proposalData = {
      amount: parseFloat(amount) || 0,
      currency,
      timestamp: new Date().toISOString()
    };

    onSubmit(proposalData, message);
    
    // Reset form
    setMessage('');
    setAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Submit Proposal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Proposed Amount</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <Input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-24"
              placeholder="USD"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Add a message to your proposal..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          <FileUp className="h-4 w-4 mr-2" />
          Submit Proposal
        </Button>
      </CardContent>
    </Card>
  );
};
