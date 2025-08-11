import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Eye, 
  DollarSign,
  Calendar,
  Activity
} from 'lucide-react';

export const AnalyticsTab = () => {
  const analyticsData = {
    performance: {
      currentValue: 145000,
      growth: 18.5,
      monthlyGrowth: 3.2,
      yearlyGrowth: 24.8
    },
    engagement: {
      views: 1240,
      likes: 89,
      shares: 34,
      comments: 67
    },
    contributions: {
      total: 12,
      thisMonth: 3,
      totalValue: 85000,
      avgContribution: 7083
    },
    timeline: {
      completion: 68,
      milestones: 8,
      completedMilestones: 5,
      daysActive: 147
    }
  };

  const metrics = [
    {
      title: 'Performance Overview',
      icon: TrendingUp,
      items: [
        { label: 'Current Value', value: `$${analyticsData.performance.currentValue.toLocaleString()}`, trend: '+12.5%' },
        { label: 'Monthly Growth', value: `${analyticsData.performance.monthlyGrowth}%`, trend: '+0.8%' },
        { label: 'Yearly Growth', value: `${analyticsData.performance.yearlyGrowth}%`, trend: '+5.2%' },
        { label: 'ROI', value: `${analyticsData.performance.growth}%`, trend: '+2.1%' }
      ]
    },
    {
      title: 'Engagement Analytics',
      icon: Eye,
      items: [
        { label: 'Total Views', value: analyticsData.engagement.views.toLocaleString(), trend: '+156' },
        { label: 'Likes', value: analyticsData.engagement.likes.toString(), trend: '+12' },
        { label: 'Shares', value: analyticsData.engagement.shares.toString(), trend: '+8' },
        { label: 'Comments', value: analyticsData.engagement.comments.toString(), trend: '+15' }
      ]
    },
    {
      title: 'Contribution Analytics',
      icon: DollarSign,
      items: [
        { label: 'Total Contributions', value: analyticsData.contributions.total.toString(), trend: '+3' },
        { label: 'This Month', value: analyticsData.contributions.thisMonth.toString(), trend: '+1' },
        { label: 'Total Value', value: `$${analyticsData.contributions.totalValue.toLocaleString()}`, trend: '+$15K' },
        { label: 'Avg Contribution', value: `$${analyticsData.contributions.avgContribution.toLocaleString()}`, trend: '+$1.2K' }
      ]
    },
    {
      title: 'Timeline Progress',
      icon: Target,
      items: [
        { label: 'Completion', value: `${analyticsData.timeline.completion}%`, trend: '+8%' },
        { label: 'Total Milestones', value: analyticsData.timeline.milestones.toString(), trend: '+2' },
        { label: 'Completed', value: analyticsData.timeline.completedMilestones.toString(), trend: '+1' },
        { label: 'Days Active', value: analyticsData.timeline.daysActive.toString(), trend: '+30' }
      ]
    }
  ];

  const chartData = [
    { month: 'Jan', value: 120000, contributions: 8 },
    { month: 'Feb', value: 125000, contributions: 6 },
    { month: 'Mar', value: 132000, contributions: 9 },
    { month: 'Apr', value: 138000, contributions: 7 },
    { month: 'May', value: 145000, contributions: 12 },
    { month: 'Jun', value: 145000, contributions: 3 }
  ];

  return (
    <div className="space-y-4">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {metric.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.value}</span>
                      <Badge variant="secondary" className="text-xs text-green-600">
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={data.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{data.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {data.contributions} contributions
                    </span>
                    <span className="font-medium">
                      ${data.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={((data.value - 120000) / (145000 - 120000)) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                date: '2 hours ago',
                action: 'New contribution received',
                details: '$5,000 financial investment',
                type: 'contribution'
              },
              {
                date: '1 day ago',
                action: 'Milestone completed',
                details: 'Phase 2 development finished',
                type: 'milestone'
              },
              {
                date: '3 days ago',
                action: 'New investor joined',
                details: 'John Smith invested $10,000',
                type: 'investor'
              },
              {
                date: '1 week ago',
                action: 'Timeline updated',
                details: 'Added new valuation method',
                type: 'update'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};