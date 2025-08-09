import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface ContributionData {
  financial: {
    volumeIn: number;
    volumeOut: number;
    netWorth: number;
    change: number;
    changePercent: number;
  };
  network: {
    volumeIn: number;
    volumeOut: number;
    netWorth: number;
    change: number;
    changePercent: number;
  };
  intellectual: {
    volumeIn: number;
    volumeOut: number;
    netWorth: number;
    change: number;
    changePercent: number;
  };
}

interface ContributionBreakdownProps {
  data?: ContributionData;
  compact?: boolean;
}

export const ContributionBreakdown = ({ data, compact = false }: ContributionBreakdownProps) => {
  const [activeTab, setActiveTab] = useState<'financial' | 'network' | 'intellectual'>('financial');

  const defaultData: ContributionData = {
    financial: {
      volumeIn: 15000,
      volumeOut: 3200,
      netWorth: 11800,
      change: 2400,
      changePercent: 25.5
    },
    network: {
      volumeIn: 8500,
      volumeOut: 1200,
      netWorth: 7300,
      change: 1800,
      changePercent: 32.7
    },
    intellectual: {
      volumeIn: 12000,
      volumeOut: 2800,
      netWorth: 9200,
      change: 1600,
      changePercent: 21.1
    }
  };

  const contributionData = data || defaultData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'network': return <Users className="h-4 w-4" />;
      case 'intellectual': return <Brain className="h-4 w-4" />;
      default: return null;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'financial': return 'text-success';
      case 'network': return 'text-primary';
      case 'intellectual': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Contribution Breakdown</span>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="financial" className="text-xs p-1">F</TabsTrigger>
              <TabsTrigger value="network" className="text-xs p-1">N</TabsTrigger>
              <TabsTrigger value="intellectual" className="text-xs p-1">I</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {getIcon(activeTab)}
              <span className="text-sm font-medium">Net Worth</span>
            </div>
            <span className="text-sm font-bold">{formatCurrency(contributionData[activeTab].netWorth)}</span>
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>In: {formatCurrency(contributionData[activeTab].volumeIn)}</span>
            <span>Out: {formatCurrency(contributionData[activeTab].volumeOut)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Change</span>
            <div className={`flex items-center gap-1 text-xs ${
              contributionData[activeTab].change >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {contributionData[activeTab].change >= 0 ? 
                <ArrowUpRight className="h-3 w-3" /> : 
                <ArrowDownRight className="h-3 w-3" />
              }
              <span>+{contributionData[activeTab].changePercent}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Contribution Breakdown</h4>
          <Badge variant="outline" className="text-xs">Live Data</Badge>
        </div>
        
        <Tabs defaultValue="financial" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="network" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Network
            </TabsTrigger>
            <TabsTrigger value="intellectual" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Intellectual
            </TabsTrigger>
          </TabsList>
          
          {(['financial', 'network', 'intellectual'] as const).map((type) => (
            <TabsContent key={type} value={type} className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-success">
                    {formatCurrency(contributionData[type].volumeIn)}
                  </div>
                  <div className="text-xs text-muted-foreground">Volume In</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-destructive">
                    {formatCurrency(contributionData[type].volumeOut)}
                  </div>
                  <div className="text-xs text-muted-foreground">Volume Out</div>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {formatCurrency(contributionData[type].netWorth)}
                  </div>
                  <div className="text-xs text-muted-foreground">Net Worth</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Performance</span>
                <div className={`flex items-center gap-1 ${
                  contributionData[type].change >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {contributionData[type].change >= 0 ? 
                    <TrendingUp className="h-4 w-4" /> : 
                    <TrendingDown className="h-4 w-4" />
                  }
                  <span className="font-medium">
                    +{contributionData[type].changePercent}% ({formatCurrency(contributionData[type].change)})
                  </span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};