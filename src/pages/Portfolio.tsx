import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Award,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Eye,
  Plus,
  Settings,
  Wallet,
  Users,
  Brain,
  Filter,
  SortAsc,
  Star,
  MessageSquare,
  Play,
  Sparkles
} from 'lucide-react';
import { mockUser, mockTimelines } from '@/data/mockData';
import { Timeline } from '@/types/timeline';
import { CustomizeStatsModal } from '@/components/dashboard/CustomizeStatsModal';
import { MatchedTimelines } from '@/components/dashboard/MatchedTimelines';
import { TimelineModal } from '@/components/timeline/TimelineModal';
import { TimelineCard } from '@/components/timeline/TimelineCard';

export const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('my-timelines');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [customStatsQuery, setCustomStatsQuery] = useState('');
  const [customStatsOpen, setCustomStatsOpen] = useState(false);
  const [customStats, setCustomStats] = useState<any[]>([
    {
      id: '1',
      title: 'AI Revenue Share',
      value: '$2,400',
      description: 'Monthly returns from AI timeline investments focused on revenue sharing models',
      query: 'Show me monthly revenue from AI timelines with revenue sharing'
    },
    {
      id: '2', 
      title: 'Network Growth',
      value: '127',
      description: 'New professional connections through timeline collaborations',
      query: 'Count new connections from timeline collaborations this month'
    }
  ]);
  
  const investedTimelines = mockTimelines.filter(t => t.invested);
  const allTimelines = mockTimelines;
  const totalInvested = investedTimelines.reduce((sum, t) => sum + (t.investedAmount || 0), 0);
  const totalCurrentValue = investedTimelines.reduce((sum, t) => sum + t.value, 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const totalROI = (totalReturns / totalInvested) * 100;

  // Calculate capital breakdowns
  const financialCapital = 125000;
  const networkCapital = 45000;
  const intellectualCapital = 38000;

  const performanceData = [
    { period: 'Last 7 days', value: 2340, change: 5.2, positive: true },
    { period: 'Last 30 days', value: 8950, change: 12.8, positive: true },
    { period: 'Last 90 days', value: 15600, change: 18.7, positive: true },
    { period: 'Year to date', value: 24500, change: 23.1, positive: true },
  ];

  const topPerformers = investedTimelines
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);

  const recentActivity = [
    { action: 'Investment', timeline: 'AI SaaS Platform', amount: 5000, date: '2024-07-28', type: 'investment' },
    { action: 'Return', timeline: 'Sarah Chen Partnership', amount: 1200, date: '2024-07-25', type: 'return' },
    { action: 'Investment', timeline: 'AI Model Training', amount: 3000, date: '2024-07-20', type: 'investment' },
    { action: 'Return', timeline: 'AI SaaS Platform', amount: 2800, date: '2024-07-15', type: 'return' },
  ];

  const handleTimelineClick = (timelineId: string) => {
    const timeline = mockTimelines.find(t => t.id === timelineId);
    if (timeline) {
      setSelectedTimeline(timeline);
      setShowTimelineModal(true);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground w-full">
            Your comprehensive timeline investment and performance hub
          </p>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="bg-card p-6 mb-6">
        <div className="flex flex-col gap-4 mb-6">
          <h3 className="text-lg font-semibold">Portfolio Summary</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCustomizeOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Customize
            </Button>
            <Button 
              size="sm"
              onClick={() => setWithdrawOpen(true)}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{formatCurrency(financialCapital + networkCapital + intellectualCapital)}</div>
            <div className="text-lg text-muted-foreground">Total Worth</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold">{formatCurrency(totalCurrentValue)}</div>
              <div className="text-sm text-muted-foreground">Current Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-success">+{formatCurrency(totalReturns)}</div>
              <div className="text-sm text-muted-foreground">Total Gained</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Financial Capital
            </div>
            <div className="text-2xl font-bold">{formatCurrency(financialCapital)}</div>
            <div className="text-xs text-success">+12.5% gains</div>
            <p className="text-xs text-muted-foreground">Direct investments and cash returns from timeline participation</p>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Network Capital
            </div>
            <div className="text-2xl font-bold">{formatCurrency(networkCapital)}</div>
            <div className="text-xs text-success">+18.2% growth</div>
            <p className="text-xs text-muted-foreground">Value from connections, partnerships, and collaborative relationships</p>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Intellectual Capital
            </div>
            <div className="text-2xl font-bold">{formatCurrency(intellectualCapital)}</div>
            <div className="text-xs text-success">+25.8% increase</div>
            <p className="text-xs text-muted-foreground">Knowledge, skills, and intellectual property contributions</p>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Worth</div>
            <div className="text-2xl font-bold">{formatCurrency(financialCapital + networkCapital + intellectualCapital)}</div>
            <Badge variant="secondary" className="text-xs bg-success/10 text-success">Top 15%</Badge>
            <p className="text-xs text-muted-foreground">Combined portfolio value across all capital types</p>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Avg Performance</div>
            <div className="text-2xl font-bold">+18.9%</div>
            <div className="text-xs text-success">Above average</div>
            <p className="text-xs text-muted-foreground">Overall returns compared to market benchmarks</p>
          </div>
          <Dialog open={customStatsOpen} onOpenChange={setCustomStatsOpen}>
            <DialogTrigger asChild>
              <div className="space-y-2 border border-dashed border-muted-foreground/30 p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Add Custom
                </div>
                <div className="text-2xl font-bold text-muted-foreground">?</div>
                <div className="text-xs text-muted-foreground">For the Gods</div>
                <p className="text-xs text-muted-foreground">Define what you want to see now in your custom stats</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Stat</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Describe what you want to track:</label>
                  <Input
                    placeholder="e.g., Show me all timelines where I invested more than $10k and ROI is above 20%"
                    value={customStatsQuery}
                    onChange={(e) => setCustomStatsQuery(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCustomStatsOpen(false)}>Cancel</Button>
                  <Button onClick={() => {
                    // TODO: Process query and add to stats
                    setCustomStatsOpen(false);
                    setCustomStatsQuery('');
                  }}>
                    Add Stat
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors" onClick={() => window.location.href = '/stats'}>
            <div className="text-xs text-muted-foreground">Accomplished</div>
            <div className="font-semibold">24 timelines</div>
          </div>
          <div className="space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors" onClick={() => window.location.href = '/stats'}>
            <div className="text-xs text-muted-foreground">Active</div>
            <div className="font-semibold">12 timelines</div>
          </div>
          <div className="space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors" onClick={() => window.location.href = '/stats'}>
            <div className="text-xs text-muted-foreground">Members</div>
            <div className="font-semibold">156 connections</div>
          </div>
          <div className="space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors" onClick={() => window.location.href = '/stats'}>
            <div className="text-xs text-muted-foreground">ROI This Year</div>
            <div className="font-semibold text-success">+{totalROI.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="my-timelines" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="my-timelines">My Timelines</TabsTrigger>
          <TabsTrigger value="matched">Matched Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="my-timelines" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
          
          {/* My Timelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTimelines.map((timeline) => (
              <TimelineCard key={timeline.id} timeline={timeline} />
            ))}
            {allTimelines.map((timeline) => (
              <Card key={timeline.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">
                          {timeline.type === 'project' ? '🚀' : timeline.type === 'profile' ? '👤' : timeline.type === 'financial' ? '💰' : '🧠'}
                        </div>
                        <div>
                          <h4 className="font-semibold">{timeline.title}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {timeline.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {timeline.description}
                      </p>
                    </div>
                    <div className="text-right">
                      {timeline.invested && (
                        <div className="flex items-center gap-1 mb-1">
                          <Play className="h-3 w-3 text-success" />
                          <span className="text-xs text-success font-medium">Invested</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{formatCurrency(timeline.value)}</div>
                      <div className="flex items-center gap-1 text-success">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">+{timeline.changePercent}% ({formatCurrency(timeline.change)})</span>
                      </div>
                    </div>
                    
                    {timeline.invested && (
                      <div className="text-sm text-muted-foreground">
                        Your Investment: <span className="font-semibold text-foreground">{formatCurrency(timeline.investedAmount || 0)}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {timeline.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{Math.floor(Math.random() * 10) + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{Math.floor(Math.random() * 20) + 5}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{Math.floor(Math.random() * 500) + 100}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
                        </div>
                      </div>
                     <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTimelineClick(timeline.id)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matched" className="space-y-6">
          <div className="space-y-4">
            {mockTimelines.slice(0, 6).map((timeline) => (
              <Card key={timeline.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {timeline.type === 'project' ? '🚀' : timeline.type === 'profile' ? '👤' : '🧠'}
                    </div>
                    <div>
                      <h4 className="font-semibold">{timeline.title}</h4>
                      <p className="text-sm text-muted-foreground">{timeline.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{timeline.type}</Badge>
                        <Badge variant="secondary" className="text-xs">98% Match</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(timeline.value)}</div>
                    <div className="text-sm text-success">+{timeline.changePercent}%</div>
                    <Button size="sm" className="mt-2">Connect</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Performance Chart and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{period.period}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(period.value)} gains
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${
                      period.positive ? 'text-success' : 'text-destructive'
                    }`}>
                      {period.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      <span className="font-semibold">+{period.change}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((timeline, index) => (
                <div key={timeline.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{timeline.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(timeline.investedAmount || 0)} invested
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-success text-sm">
                      +{timeline.changePercent}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(timeline.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs defaultValue="holdings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investedTimelines.map((timeline) => (
                  <div key={timeline.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {timeline.type === 'project' ? '🚀' : timeline.type === 'profile' ? '👤' : '💰'}
                      </div>
                      <div>
                        <div className="font-medium">{timeline.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Invested: {formatCurrency(timeline.investedAmount || 0)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(timeline.value)}</div>
                      <div className={`text-sm flex items-center gap-1 ${
                        timeline.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {timeline.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{timeline.changePercent > 0 ? '+' : ''}{timeline.changePercent}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'investment' ? 'bg-primary/10' : 'bg-success/10'
                    }`}>
                      {activity.type === 'investment' ? (
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.action} - {activity.timeline}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      activity.type === 'investment' ? 'text-primary' : 'text-success'
                    }`}>
                      {activity.type === 'investment' ? '-' : '+'}{formatCurrency(activity.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Allocation by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Projects</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contacts</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Training</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Risk</span>
                    <span className="font-medium text-success">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium Risk</span>
                    <span className="font-medium text-accent">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Risk</span>
                    <span className="font-medium text-destructive">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CustomizeStatsModal 
        open={showCustomizeModal}
        onOpenChange={setShowCustomizeModal}
      />

      <TimelineModal 
        timeline={selectedTimeline}
        isOpen={showTimelineModal}
        onClose={() => setShowTimelineModal(false)}
      />
      
      {withdrawOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Available Balance</div>
                <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Withdraw Amount</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg" 
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setWithdrawOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => setWithdrawOpen(false)}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};