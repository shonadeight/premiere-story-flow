import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Timeline } from '@/types/timeline';
import { DollarSign, TrendingUp, Clock, Shield, FileText, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvestmentModalProps {
  timeline: Timeline;
  isOpen: boolean;
  onClose: () => void;
}

export const InvestmentModal = ({ timeline, isOpen, onClose }: InvestmentModalProps) => {
  const [amount, setAmount] = useState('');
  const [contributionType, setContributionType] = useState<'financial' | 'intellectual' | 'network' | 'pledge'>('financial');
  const [message, setMessage] = useState('');
  const [terms, setTerms] = useState('standard');
  const { toast } = useToast();

  const handleInvest = () => {
    if (!amount || !message) {
      toast({ title: "Please fill in all required fields" });
      return;
    }

    const investmentAmount = parseFloat(amount);
    if (timeline.investmentTerms) {
      if (investmentAmount < timeline.investmentTerms.minInvestment || 
          investmentAmount > timeline.investmentTerms.maxInvestment) {
        toast({ 
          title: "Investment amount out of range",
          description: `Please invest between $${timeline.investmentTerms.minInvestment} and $${timeline.investmentTerms.maxInvestment}`
        });
        return;
      }
    }

    toast({ 
      title: "Investment submitted!",
      description: `Your ${contributionType} contribution of $${amount} has been submitted for review.`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Invest in {timeline.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Timeline Overview */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <div className="text-sm font-medium">Expected ROI</div>
                  <div className="text-lg font-bold text-primary">
                    {timeline.investmentTerms?.roi || 'N/A'}%
                  </div>
                </div>
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-lg font-bold">
                    {timeline.investmentTerms?.duration || 'Flexible'}
                  </div>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                  <div className="text-sm font-medium">Risk Level</div>
                  <Badge variant={
                    timeline.investmentTerms?.riskLevel === 'low' ? 'default' :
                    timeline.investmentTerms?.riskLevel === 'medium' ? 'secondary' : 'destructive'
                  }>
                    {timeline.investmentTerms?.riskLevel || 'Medium'}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Current Value</div>
                  <div className="text-lg font-bold text-green-600">
                    ${timeline.value.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contribution Type</label>
                <Select value={contributionType} onValueChange={(value: any) => setContributionType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">💰 Financial Investment</SelectItem>
                    <SelectItem value="intellectual">🧠 Intellectual Property</SelectItem>
                    <SelectItem value="network">🤝 Network Connections</SelectItem>
                    <SelectItem value="pledge">📋 Future Commitment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Amount (USD) 
                  {timeline.investmentTerms && (
                    <span className="text-muted-foreground ml-1">
                      (${timeline.investmentTerms.minInvestment.toLocaleString()} - ${timeline.investmentTerms.maxInvestment.toLocaleString()})
                    </span>
                  )}
                </label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={timeline.investmentTerms?.minInvestment || 0}
                  max={timeline.investmentTerms?.maxInvestment || 1000000}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Terms</label>
              <Select value={terms} onValueChange={setTerms}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Terms</SelectItem>
                  <SelectItem value="negotiated">Negotiate Custom Terms</SelectItem>
                  <SelectItem value="equity">Equity Partnership</SelectItem>
                  <SelectItem value="revenue">Revenue Sharing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Proposal</label>
              <Textarea
                placeholder="Describe your contribution, expertise, or investment proposal..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Custom Metrics Display */}
          {timeline.customMetrics && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Timeline Metrics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(timeline.customMetrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleInvest} className="flex-1">
              <DollarSign className="mr-2 h-4 w-4" />
              Submit Investment
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat First
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};