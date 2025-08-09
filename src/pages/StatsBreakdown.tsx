import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Brain,
  Target,
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StatsBreakdown = () => {
  const navigate = useNavigate();
  
  const capitalStats = [
    {
      type: 'Financial Capital',
      icon: <DollarSign className="h-5 w-5" />,
      total: 125000,
      breakdown: [
        { category: 'Direct Investments', value: 85000, percentage: 68 },
        { category: 'Cash Returns', value: 25000, percentage: 20 },
        { category: 'Dividend Income', value: 15000, percentage: 12 }
      ],
      growth: 12.5,
      description: 'Direct investments and cash returns from timeline participation'
    },
    {
      type: 'Network Capital',
      icon: <Users className="h-5 w-5" />,
      total: 45000,
      breakdown: [
        { category: 'Partnership Value', value: 28000, percentage: 62 },
        { category: 'Referral Returns', value: 12000, percentage: 27 },
        { category: 'Collaboration Benefits', value: 5000, percentage: 11 }
      ],
      growth: 18.2,
      description: 'Value from connections, partnerships, and collaborative relationships'
    },
    {
      type: 'Intellectual Capital',
      icon: <Brain className="h-5 w-5" />,
      total: 38000,
      breakdown: [
        { category: 'IP Licensing', value: 22000, percentage: 58 },
        { category: 'Knowledge Sharing', value: 10000, percentage: 26 },
        { category: 'Training & Consulting', value: 6000, percentage: 16 }
      ],
      growth: 25.8,
      description: 'Knowledge, skills, and intellectual property contributions'
    }
  ];

  const performanceMetrics = [
    { label: 'Total ROI', value: '18.9%', trend: 'up', color: 'text-success' },
    { label: 'Active Timelines', value: '12', trend: 'up', color: 'text-primary' },
    { label: 'Completed Projects', value: '24', trend: 'stable', color: 'text-muted-foreground' },
    { label: 'Success Rate', value: '94%', trend: 'up', color: 'text-success' },
    { label: 'Avg. Timeline Duration', value: '4.2 months', trend: 'down', color: 'text-accent' },
    { label: 'Member Satisfaction', value: '4.8/5', trend: 'up', color: 'text-success' }
  ];

  const timelinePerformance = [
    { name: 'AI SaaS Platform', value: 24500, roi: 45.2, status: 'active', members: 8 },
    { name: 'Sarah Chen Partnership', value: 18200, roi: 32.1, status: 'completed', members: 3 },
    { name: 'AI Model Training', value: 15800, roi: 28.7, status: 'active', members: 12 },
    { name: 'Tech Consulting', value: 12400, roi: 22.3, status: 'active', members: 5 },
    { name: 'Investment Research', value: 9600, roi: 18.9, status: 'paused', members: 2 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Portfolio Statistics Breakdown</h1>
          <p className="text-muted-foreground">Detailed analysis of your timeline performance and capital distribution</p>
        </div>
      </div>

      <Tabs defaultValue="capital" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="capital">Capital Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="timelines">Top Timelines</TabsTrigger>
        </TabsList>

        <TabsContent value="capital" className="space-y-6">
          {capitalStats.map((capital, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {capital.icon}
                  {capital.type}
                  <Badge variant="secondary" className="ml-auto">
                    +{capital.growth}% growth
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{capital.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold mb-2">{formatCurrency(capital.total)}</div>
                </div>
                
                <div className="space-y-3">
                  {capital.breakdown.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="text-right">
                          <span className="font-semibold">{formatCurrency(item.value)}</span>
                          <span className="text-xs text-muted-foreground ml-2">({item.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                    </div>
                    <div className="text-right">
                      {metric.trend === 'up' && <TrendingUp className="h-5 w-5 text-success" />}
                      {metric.trend === 'down' && <TrendingDown className="h-5 w-5 text-destructive" />}
                      {metric.trend === 'stable' && <Activity className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-success">+24.5%</div>
                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-success">+18.7%</div>
                    <div className="text-xs text-muted-foreground">Last 90 days</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-success">+32.1%</div>
                    <div className="text-xs text-muted-foreground">Year to date</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">Top 15%</div>
                    <div className="text-xs text-muted-foreground">Ranking</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timelines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Timelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelinePerformance.map((timeline, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{timeline.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={timeline.status === 'active' ? 'default' : timeline.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                            {timeline.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{timeline.members} members</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(timeline.value)}</div>
                      <div className="text-sm text-success">+{timeline.roi}% ROI</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};