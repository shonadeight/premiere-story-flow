import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  Activity,
  Zap,
  Award
} from 'lucide-react';
import { mockUser, mockTimelines } from '@/data/mockData';

export const StatsCards = () => {
  const activeTimelines = mockTimelines.filter(t => t.status === 'active').length;
  const totalInvested = mockTimelines
    .filter(t => t.invested)
    .reduce((sum, t) => sum + (t.investedAmount || 0), 0);
  
  const totalValue = mockTimelines.reduce((sum, t) => sum + t.value, 0);
  const totalGains = mockTimelines.reduce((sum, t) => sum + t.change, 0);
  const avgRating = mockTimelines.reduce((sum, t) => sum + t.rating, 0) / mockTimelines.length;

  const stats = [
    {
      title: 'Portfolio Value',
      value: `$${totalValue.toLocaleString()}`,
      change: `+$${totalGains.toLocaleString()}`,
      changePercent: '+12.8%',
      icon: DollarSign,
      positive: true,
      description: 'Total timeline valuation'
    },
    {
      title: 'Active Investments',
      value: `$${totalInvested.toLocaleString()}`,
      change: `${mockTimelines.filter(t => t.invested).length} timelines`,
      changePercent: '+3 this month',
      icon: Target,
      positive: true,
      description: 'Your invested capital'
    },
    {
      title: 'Active Timelines',
      value: activeTimelines.toString(),
      change: `${mockTimelines.length - activeTimelines} others`,
      changePercent: '88% success rate',
      icon: Activity,
      positive: true,
      description: 'Currently running projects'
    },
    {
      title: 'Avg. Performance',
      value: avgRating.toFixed(1),
      change: 'Rating score',
      changePercent: 'Top 15% investor',
      icon: Award,
      positive: true,
      description: 'Timeline quality score'
    },
    {
      title: 'Network Value',
      value: '24 contacts',
      change: '+6 this month',
      changePercent: '$18.5K estimated',
      icon: Users,
      positive: true,
      description: 'Professional connections'
    },
    {
      title: 'AI Insights',
      value: '12 opportunities',
      change: '8 high potential',
      changePercent: '3 urgent actions',
      icon: Zap,
      positive: true,
      description: 'Personalized recommendations'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.positive ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{stat.change}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.changePercent}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};