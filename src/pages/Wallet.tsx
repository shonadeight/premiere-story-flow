import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Minus,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  Calendar,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WithdrawModal } from '@/components/ui/dialog-modal';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return' | 'fee';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'card' | 'mpesa' | 'airtel' | 'bank';
  timeline?: string;
}

export const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [amount, setAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { toast } = useToast();

  const walletBalance = 12750;
  const availableBalance = 10500;
  const pendingTransactions = 2250;

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'return',
      amount: 2400,
      description: 'Outcome share from AI SaaS Platform',
      timestamp: '2024-08-01T10:30:00Z',
      status: 'completed',
      method: 'card',
      timeline: 'AI SaaS Platform'
    },
    {
      id: '2',
      type: 'investment',
      amount: -5000,
      description: 'Investment in Mobile App Development',
      timestamp: '2024-07-30T14:20:00Z',
      status: 'completed',
      method: 'card',
      timeline: 'Mobile App Development'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 10000,
      description: 'Wallet top-up via M-Pesa',
      timestamp: '2024-07-28T09:15:00Z',
      status: 'completed',
      method: 'mpesa'
    },
    {
      id: '4',
      type: 'return',
      amount: 1200,
      description: 'Revenue share from Sarah Chen Partnership',
      timestamp: '2024-07-25T16:45:00Z',
      status: 'completed',
      method: 'card',
      timeline: 'Sarah Chen Partnership'
    },
    {
      id: '5',
      type: 'withdrawal',
      amount: -3000,
      description: 'Withdrawal to bank account',
      timestamp: '2024-07-22T11:30:00Z',
      status: 'pending',
      method: 'bank'
    },
    {
      id: '6',
      type: 'fee',
      amount: -25,
      description: 'Transaction processing fee',
      timestamp: '2024-07-20T13:10:00Z',
      status: 'completed',
      method: 'card'
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fees: '2.9%' },
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, fees: '1.5%' },
    { id: 'airtel', name: 'Airtel Money', icon: Smartphone, fees: '1.5%' },
    { id: 'bank', name: 'Bank Transfer', icon: DollarSign, fees: 'Free' }
  ];

  const handleTransaction = (type: 'deposit' | 'withdraw') => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount" });
      return;
    }

    const transactionAmount = parseFloat(amount);
    if (type === 'withdraw' && transactionAmount > availableBalance) {
      toast({ 
        title: "Insufficient funds",
        description: "You don't have enough available balance for this withdrawal."
      });
      return;
    }

    toast({ 
      title: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} initiated`,
      description: `$${transactionAmount.toLocaleString()} ${type} request has been processed.`
    });
    setAmount('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'return':
        return ArrowDownLeft;
      case 'withdrawal':
      case 'investment':
        return ArrowUpRight;
      case 'fee':
        return Minus;
      default:
        return DollarSign;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'pending': return 'text-accent';
      case 'failed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <WalletIcon className="h-6 w-6" />
            Wallet & Payments
          </h1>
          <p className="text-muted-foreground">
            Manage your funds, investments, and outcome distributions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="space-y-6 mb-8">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <WalletIcon className="h-6 w-6" />
                <span className="text-lg font-medium opacity-90">Total Balance</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary-foreground/80 hover:text-primary-foreground"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-4xl font-bold mb-2">
              {showBalance ? formatCurrency(walletBalance) : '****'}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm opacity-90">+8.5% this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-sm text-muted-foreground mb-1">Available</div>
              <div className="text-lg font-bold text-success">{formatCurrency(availableBalance)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-sm text-muted-foreground mb-1">Pending</div>
              <div className="text-lg font-bold text-accent">{formatCurrency(pendingTransactions)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-sm text-muted-foreground mb-1">Invested</div>
              <div className="text-lg font-bold text-primary">{formatCurrency(8500)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-sm text-muted-foreground mb-1">Returns</div>
              <div className="text-lg font-bold text-success">+{formatCurrency(2250)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button size="lg" className="h-14">
            <Plus className="h-5 w-5 mr-2" />
            Invest
          </Button>
          <Button variant="outline" size="lg" className="h-14" onClick={() => setShowWithdrawModal(true)}>
            <Minus className="h-5 w-5 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type);
                  const isPositive = transaction.amount > 0;
                  
                  return (
                    <div key={transaction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        isPositive ? 'bg-success/10' : 'bg-primary/10'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          isPositive ? 'text-success' : 'text-primary'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatTimestamp(transaction.timestamp)}
                          {transaction.timeline && (
                            <>
                              <span>•</span>
                              <span className="text-primary">{transaction.timeline}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-semibold ${
                          isPositive ? 'text-success' : 'text-foreground'
                        }`}>
                          {isPositive ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className={`text-xs ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{method.name}</span>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {method.fees}
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Secure Transaction</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All transactions are encrypted and processed through secure payment gateways.
                </p>
              </div>

              <Button 
                onClick={() => handleTransaction('deposit')}
                className="w-full"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Deposit {amount && `$${parseFloat(amount).toLocaleString()}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Minus className="h-5 w-5" />
                Withdraw Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-sm font-medium text-accent mb-1">Available for Withdrawal</div>
                <div className="text-2xl font-bold">{formatCurrency(availableBalance)}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    max={availableBalance}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum withdrawal: $10 • Processing time: 1-3 business days
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Withdrawal Method</label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{method.name}</span>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {method.fees}
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => handleTransaction('withdraw')}
                className="w-full"
                size="lg"
                variant="outline"
              >
                <Minus className="h-4 w-4 mr-2" />
                Withdraw {amount && `$${parseFloat(amount).toLocaleString()}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Withdraw Modal */}
      <WithdrawModal 
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        availableBalance={availableBalance}
      />
    </div>
  );
};