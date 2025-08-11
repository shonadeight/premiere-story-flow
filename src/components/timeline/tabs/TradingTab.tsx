import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Clock, 
  Target,
  Zap,
  Shield,
  AlertTriangle
} from 'lucide-react';

export const TradingTab = () => {
  const [tradingMode, setTradingMode] = useState('day');
  const [orderType, setOrderType] = useState('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const timelineTokens = {
    symbol: 'TLN-001',
    currentPrice: 145.50,
    priceChange: 8.25,
    priceChangePercent: 6.01,
    volume24h: 234000,
    marketCap: 5670000,
    totalSupply: 39000,
    circulatingSupply: 32500
  };

  const positions = [
    {
      id: 1,
      type: 'long',
      amount: 150,
      entryPrice: 138.20,
      currentPrice: 145.50,
      pnl: 1095,
      pnlPercent: 7.91,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'short',
      amount: 75,
      entryPrice: 142.00,
      currentPrice: 145.50,
      pnl: -262.5,
      pnlPercent: -2.46,
      timestamp: '1 day ago'
    }
  ];

  const orderHistory = [
    {
      id: 1,
      type: 'buy',
      amount: 100,
      price: 140.25,
      status: 'filled',
      timestamp: '3 hours ago'
    },
    {
      id: 2,
      type: 'sell',
      amount: 50,
      price: 144.80,
      status: 'filled',
      timestamp: '1 day ago'
    },
    {
      id: 3,
      type: 'buy',
      amount: 200,
      price: 146.00,
      status: 'pending',
      timestamp: '2 days ago'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Trading Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Token Info */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Timeline Token ({timelineTokens.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold text-primary">
                  ${timelineTokens.currentPrice}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">
                    +${timelineTokens.priceChange} (+{timelineTokens.priceChangePercent}%)
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-lg font-bold">
                  ${timelineTokens.volume24h.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-lg font-bold">
                  ${(timelineTokens.marketCap / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Circulating</p>
                <p className="text-lg font-bold">
                  {timelineTokens.circulatingSupply.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {timelineTokens.totalSupply.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Trade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full touch-manipulation">
                <TrendingUp className="h-4 w-4 mr-2" />
                Buy
              </Button>
              <Button variant="outline" className="w-full touch-manipulation">
                <TrendingDown className="h-4 w-4 mr-2" />
                Sell
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-amount">Amount (tokens)</Label>
              <Input
                id="quick-amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="touch-manipulation"
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Estimated Cost:</span>
                <span className="font-medium">
                  ${amount ? (parseFloat(amount) * timelineTokens.currentPrice).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Interface */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">Trading Interface</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={tradingMode} onValueChange={setTradingMode}>
                <SelectTrigger className="w-32 touch-manipulation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day Trading</SelectItem>
                  <SelectItem value="swing">Swing Trading</SelectItem>
                  <SelectItem value="hold">Buy & Hold</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {tradingMode === 'day' ? 'Fast' : tradingMode === 'swing' ? 'Medium' : 'Long-term'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="spot" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="spot" className="touch-manipulation">Spot Trading</TabsTrigger>
              <TabsTrigger value="margin" className="touch-manipulation">Margin Trading</TabsTrigger>
              <TabsTrigger value="futures" className="touch-manipulation">Futures</TabsTrigger>
            </TabsList>

            <TabsContent value="spot" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Buy Section */}
                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Buy {timelineTokens.symbol}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Order Type</Label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger className="touch-manipulation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                          <SelectItem value="stop">Stop Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {orderType === 'limit' && (
                      <div>
                        <Label htmlFor="buy-price">Limit Price</Label>
                        <Input
                          id="buy-price"
                          placeholder="Enter price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="touch-manipulation"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="buy-amount">Amount</Label>
                      <Input
                        id="buy-amount"
                        placeholder="Enter amount"
                        className="touch-manipulation"
                      />
                    </div>

                    <div className="flex gap-2">
                      {['25%', '50%', '75%', '100%'].map(percent => (
                        <Button 
                          key={percent}
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs touch-manipulation"
                        >
                          {percent}
                        </Button>
                      ))}
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700 touch-manipulation">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Place Buy Order
                    </Button>
                  </CardContent>
                </Card>

                {/* Sell Section */}
                <Card className="border-red-200 bg-red-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Sell {timelineTokens.symbol}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Order Type</Label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger className="touch-manipulation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                          <SelectItem value="stop">Stop Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {orderType === 'limit' && (
                      <div>
                        <Label htmlFor="sell-price">Limit Price</Label>
                        <Input
                          id="sell-price"
                          placeholder="Enter price"
                          className="touch-manipulation"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="sell-amount">Amount</Label>
                      <Input
                        id="sell-amount"
                        placeholder="Enter amount"
                        className="touch-manipulation"
                      />
                    </div>

                    <div className="flex gap-2">
                      {['25%', '50%', '75%', '100%'].map(percent => (
                        <Button 
                          key={percent}
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs touch-manipulation"
                        >
                          {percent}
                        </Button>
                      ))}
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700 touch-manipulation">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Place Sell Order
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="margin" className="space-y-4">
              <Card className="border-orange-200 bg-orange-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium text-orange-800">Margin Trading</h3>
                  </div>
                  <p className="text-sm text-orange-700">
                    Margin trading allows you to trade with borrowed funds to amplify your position. 
                    This feature is currently being developed and will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="futures" className="space-y-4">
              <Card className="border-purple-200 bg-purple-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-purple-800">Futures Trading</h3>
                  </div>
                  <p className="text-sm text-purple-700">
                    Trade timeline token futures with leverage and advanced order types. 
                    This feature is currently being developed and will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Portfolio & Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Positions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Current Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positions.map(position => (
                <div key={position.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={position.type === 'long' ? 'default' : 'secondary'}
                        className={position.type === 'long' ? 'bg-green-600' : 'bg-red-600'}
                      >
                        {position.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{position.amount} tokens</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </div>
                      <div className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Entry: ${position.entryPrice}</span>
                    <span>Current: ${position.currentPrice}</span>
                    <span>{position.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderHistory.map(order => (
                <div key={order.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={order.type === 'buy' ? 'default' : 'secondary'}
                        className={order.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}
                      >
                        {order.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{order.amount} tokens</span>
                    </div>
                    <Badge 
                      variant={order.status === 'filled' ? 'default' : 'secondary'}
                      className={order.status === 'filled' ? 'bg-green-600' : 'bg-yellow-600'}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Price: ${order.price}</span>
                    <span>Total: ${(order.amount * order.price).toFixed(2)}</span>
                    <span>{order.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};