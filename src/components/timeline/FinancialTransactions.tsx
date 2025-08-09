import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard,
  Smartphone,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  BarChart3
} from 'lucide-react';

export const FinancialTransactions = () => {
  const [transactions] = useState([
    {
      id: '1',
      type: 'deposit',
      method: 'M-Pesa',
      amount: 5000,
      date: '2024-07-28',
      status: 'completed',
      timeline: 'AI SaaS Platform'
    },
    {
      id: '2',
      type: 'withdrawal',
      method: 'Bank Transfer',
      amount: 2500,
      date: '2024-07-25',
      status: 'completed',
      timeline: 'Portfolio'
    },
    {
      id: '3',
      type: 'investment',
      method: 'Card',
      amount: 3000,
      date: '2024-07-22',
      status: 'pending',
      timeline: 'AI Model Training'
    },
    {
      id: '4',
      type: 'return',
      method: 'Automatic',
      amount: 1200,
      date: '2024-07-20',
      status: 'completed',
      timeline: 'Sarah Chen Partnership'
    }
  ]);

  const [subscriptionTiers] = useState([
    {
      id: '1',
      name: 'Basic Access',
      price: 10,
      period: 'monthly',
      features: ['View timeline', 'Basic analytics'],
      subscribers: 45
    },
    {
      id: '2',
      name: 'Premium Access',
      price: 25,
      period: 'monthly',
      features: ['Full timeline access', 'Advanced analytics', 'Priority support'],
      subscribers: 23
    },
    {
      id: '3',
      name: 'Investor Tier',
      price: 100,
      period: 'monthly',
      features: ['Investment opportunities', 'Outcome sharing', 'Direct communication'],
      subscribers: 8
    }
  ]);

  const [tradingActivity] = useState([
    {
      id: '1',
      action: 'Buy',
      timeline: 'AI SaaS Platform',
      shares: 50,
      price: 120,
      total: 6000,
      date: '2024-07-28'
    },
    {
      id: '2',
      action: 'Sell',
      timeline: 'Research Timeline B',
      shares: 25,
      price: 85,
      total: 2125,
      date: '2024-07-25'
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getMethodIcon = (method: string) => {
    if (method.includes('M-Pesa') || method.includes('Airtel')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <CreditCard className="h-4 w-4" />;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'investment':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'withdrawal':
      case 'return':
        return <ArrowUpRight className="h-4 w-4 text-primary" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transactions">History</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm">
                  <Smartphone className="h-4 w-4 mr-2" />
                  M-Pesa Deposit
                </Button>
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card Deposit
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium capitalize">{transaction.type}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getMethodIcon(transaction.method)}
                            <span>{transaction.method}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.timeline}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'deposit' || transaction.type === 'return' 
                          ? 'text-success' : 'text-primary'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'return' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionTiers.map((tier) => (
                  <div key={tier.id} className="border rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="font-semibold">{tier.name}</h4>
                      <div className="text-2xl font-bold">
                        {formatCurrency(tier.price)}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{tier.period}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="text-sm flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {tier.subscribers} subscribers
                      </span>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button>
                  Create New Subscription Tier
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="trading" className="space-y-4">
              <div className="space-y-3">
                {tradingActivity.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        trade.action === 'Buy' ? 'bg-success/10' : 'bg-destructive/10'
                      }`}>
                        {trade.action === 'Buy' ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {trade.action} {trade.shares} shares
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trade.timeline}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(trade.price)} per share
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(trade.total)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(trade.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Trading Dashboard
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">ROI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Invested</span>
                        <span className="font-semibold">{formatCurrency(25000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Current Value</span>
                        <span className="font-semibold">{formatCurrency(32500)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Returns</span>
                        <span className="font-semibold text-success">{formatCurrency(7500)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">ROI</span>
                        <span className="font-semibold text-success">+30%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Portfolio Risk</span>
                        <Badge variant="secondary">Medium</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Diversification</span>
                        <span className="font-semibold">8/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Volatility</span>
                        <span className="font-semibold">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sharpe Ratio</span>
                        <span className="font-semibold">1.8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};