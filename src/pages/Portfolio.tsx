import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  GitBranch,
  Target,
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  FileText,
  Star,
  Shield,
  UserCheck,
  DollarSign,
  History,
  Calculator,
  Brain,
  Share2,
  Filter,
  SortAsc,
  Eye,
  Plus
} from 'lucide-react';
import { mockUser, mockTimelines } from '@/data/mockData';
import { Timeline } from '@/types/timeline';
import { TimelineCard } from '@/components/timeline/TimelineCard';
import { MatchedTimelines } from '@/components/dashboard/MatchedTimelines';

export const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('my-timelines');
  
  // Check if this is the root timeline (profile)
  const isRootTimeline = true; // In real app, this would be determined by route/context
  
  const allTimelines = mockTimelines;
  const profileTimeline = allTimelines.find(t => t.type === 'profile') || allTimelines[0];
  
  // Calculate portfolio summary stats
  const totalWorth = 208000; // Financial + Network + Intellectual capital
  const totalGained = 45200;
  const accomplishedCount = 24;
  const activeCount = 12;
  const membersCount = 156;
  const roiThisYear = 18.9;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const portfolioTabs = [
    {
      id: 'my-timelines',
      label: isRootTimeline ? 'My Timelines' : 'Subtimelines',
      icon: GitBranch,
      count: allTimelines.length
    },
    {
      id: 'matched-opportunities',
      label: 'Matched Opportunities',
      icon: Target,
      count: 8
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      count: null
    },
    {
      id: 'invested-users',
      label: 'Invested Users',
      icon: Users,
      count: 156
    },
    {
      id: 'followups',
      label: 'Followups',
      icon: MessageSquare,
      count: 12
    },
    {
      id: 'trading',
      label: 'Trading',
      icon: TrendingUp,
      count: null
    },
    {
      id: 'files',
      label: 'Files',
      icon: FileText,
      count: 24
    },
    {
      id: 'ratings',
      label: 'Ratings',
      icon: Star,
      count: null
    },
    {
      id: 'rules-terms',
      label: 'Rules & Terms',
      icon: Shield,
      count: 3
    },
    {
      id: 'admin-members',
      label: 'Admin & Members',
      icon: UserCheck,
      count: 8
    },
    {
      id: 'capital-flow',
      label: 'Capital Flow',
      icon: DollarSign,
      count: null
    },
    {
      id: 'transaction-history',
      label: 'Transaction History',
      icon: History,
      count: 45
    },
    {
      id: 'valuation',
      label: 'Valuation',
      icon: Calculator,
      count: null
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'my-timelines':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
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
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Timeline
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTimelines.map((timeline) => (
                <TimelineCard key={timeline.id} timeline={timeline} />
              ))}
            </div>
          </div>
        );

      case 'matched-opportunities':
        return <MatchedTimelines />;

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Performance Report</span>
                  </div>
                  <div className="text-2xl font-bold">+18.9%</div>
                  <div className="text-xs text-muted-foreground">Average ROI</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-xs text-muted-foreground">Timeline completion</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Network Growth</span>
                  </div>
                  <div className="text-2xl font-bold">+24</div>
                  <div className="text-xs text-muted-foreground">New connections</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Skill Value</span>
                  </div>
                  <div className="text-2xl font-bold">$38K</div>
                  <div className="text-xs text-muted-foreground">Intellectual capital</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'invested-users':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Investor {i + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          Invested {formatCurrency(Math.floor(Math.random() * 50000) + 10000)}
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'trading':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Token Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Trading features coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Buy, hold, and sell timeline tokens to profit from timeline success
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'capital-flow':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Capital Flow Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{formatCurrency(125000)}</div>
                    <div className="text-sm text-muted-foreground">Financial Capital</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{formatCurrency(45000)}</div>
                    <div className="text-sm text-muted-foreground">Network Capital</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{formatCurrency(38000)}</div>
                    <div className="text-sm text-muted-foreground">Intellectual Capital</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              {portfolioTabs.find(tab => tab.id === activeTab)?.label} content coming soon
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isRootTimeline ? profileTimeline.title : 'Timeline Portfolio'}
          </h1>
          <p className="text-muted-foreground">
            {profileTimeline.description}
          </p>
        </div>
      </div>

      {/* Portfolio Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{formatCurrency(totalWorth)}</div>
              <div className="text-sm text-muted-foreground">Total Worth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">+{formatCurrency(totalGained)}</div>
              <div className="text-sm text-muted-foreground">Total Gained</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{accomplishedCount}</div>
              <div className="text-sm text-muted-foreground">Accomplished</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+{roiThisYear}%</div>
              <div className="text-sm text-muted-foreground">ROI This Year</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-semibold">{activeCount}</div>
              <div className="text-xs text-muted-foreground">Active Timelines</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-semibold">{membersCount}</div>
              <div className="text-xs text-muted-foreground">Members</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-semibold">4.8</div>
              <div className="text-xs text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-semibold">1.2K</div>
              <div className="text-xs text-muted-foreground">Total Views</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segment Tabs Row */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="flex border-b">
              {portfolioTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.count !== null && (
                      <Badge variant="secondary" className="text-xs">
                        {tab.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};