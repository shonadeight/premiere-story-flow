import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft,
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
  Settings,
  Share2,
  Eye,
  ThumbsUp,
  Plus,
  Brain
} from 'lucide-react';
import { mockTimelines } from '@/data/mockData';
import { Timeline } from '@/types/timeline';
import { TimelineCard } from '@/components/timeline/TimelineCard';
import { MatchedTimelines } from '@/components/dashboard/MatchedTimelines';
import { SortOptions } from '@/components/timeline/SortOptions';
import { AnalyticsTab } from '@/components/timeline/tabs/AnalyticsTab';
import { TradingTab } from '@/components/timeline/tabs/TradingTab';
import { FollowupsTab } from '@/components/timeline/tabs/FollowupsTab';
import { FilesTab } from '@/components/timeline/tabs/FilesTab';
import { RatingsTab } from '@/components/timeline/tabs/RatingsTab';
import { RulesTermsTab } from '@/components/timeline/tabs/RulesTermsTab';
import { AdminTab } from '@/components/timeline/tabs/AdminTab';
import { TransactionsTab } from '@/components/timeline/tabs/TransactionsTab';
import { ValuationTab } from '@/components/timeline/tabs/ValuationTab';

export const TimelineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('subtimelines');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<any>({});
  
  const timeline = mockTimelines.find(t => t.id === id);
  
  useEffect(() => {
    if (!timeline) {
      navigate('/');
    }
  }, [timeline, navigate]);

  if (!timeline) {
    return <div>Timeline not found</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Mock data for timeline tabs
  const mockSubtimelines = mockTimelines.slice(1, 4);
  const mockMatchedOpportunities = mockTimelines.slice(4, 7);
  const mockInvestedUsers = [
    { id: '1', name: 'John Doe', investment: 5000, timeline: mockTimelines[0] },
    { id: '2', name: 'Jane Smith', investment: 3500, timeline: mockTimelines[1] },
    { id: '3', name: 'Mike Johnson', investment: 7200, timeline: mockTimelines[2] },
  ];

  const handleInvest = () => {
    // TODO: Open investment modal
    console.log('Opening investment modal');
  };

  const handleFollow = () => {
    // TODO: Implement follow functionality
    console.log('Following timeline');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing timeline');
  };

  const tabs = [
    { id: 'subtimelines', label: 'Subtimelines', icon: GitBranch },
    { id: 'matched', label: 'Matched Opportunities', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'invested-users', label: 'Invested Users', icon: Users },
    { id: 'followups', label: 'Followups', icon: MessageSquare },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'ratings', label: 'Ratings', icon: Star },
    { id: 'rules', label: 'Rules & Terms', icon: Shield },
    { id: 'admin', label: 'Admin', icon: UserCheck },
    { id: 'capital-flow', label: 'Capital Flow', icon: DollarSign },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'valuation', label: 'Valuation', icon: Calculator },
  ];

  return (
    <div className="container mx-auto px-1 sm:px-6 py-3 sm:py-6 space-y-4 sm:space-y-6 pb-20 lg:pb-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={() => navigate(-1)}
          className="touch-manipulation"
        >
          <ArrowLeft className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Back</span>}
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold truncate">{timeline.title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Timeline Detail</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={handleShare}
            className="touch-manipulation"
          >
            <Share2 className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Share</span>}
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={handleFollow}
            className="touch-manipulation"
          >
            <ThumbsUp className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Follow</span>}
          </Button>
        </div>
      </div>

      {/* Timeline Summary Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="p-4 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                <CardTitle className="text-xl sm:text-2xl font-bold">{timeline.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {timeline.type} Timeline
                  </Badge>
                  <Badge variant={timeline.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {timeline.status}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base line-clamp-3">{timeline.description}</p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-[200px]">
              <Button 
                onClick={() => navigate(`/contribute/${id}`)}
                size={isMobile ? "sm" : "default"}
                className="w-full touch-manipulation"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Contribute
              </Button>
              <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                <span>{timeline.investedMembers} investors</span>
                <span>{timeline.views} views</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50">
              <div className="text-lg sm:text-2xl font-bold text-primary">
                {timeline.currency === 'USD' ? '$' : ''}{timeline.value.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Current Value</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                +{timeline.changePercent}%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Growth</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{timeline.rating}/5</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Rating</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">{timeline.subtimelines?.length || 0}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Subtimelines</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horizontal Scrollable Tabs - Same Structure as Portfolio */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Timeline Details</h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <SortOptions 
              onSortChange={(field, order) => {
                setSortBy(field);
                setSortOrder(order);
              }}
              onFilterChange={setFilters}
              currentSort={sortBy}
              currentFilters={filters}
            />
            <Button variant="outline" size="sm" className="whitespace-nowrap touch-manipulation">
              <Settings className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Manage</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-3 sm:px-6 border-b">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex h-10 sm:h-12 items-center justify-start rounded-none bg-transparent p-0 gap-3 sm:gap-6 touch-manipulation">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger 
                        key={tab.id}
                        value={tab.id}
                        className="relative h-10 sm:h-12 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 sm:pb-3 pt-2 font-medium sm:font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none text-xs sm:text-sm whitespace-nowrap touch-manipulation"
                      >
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {isMobile ? tab.label.split(' ')[0] : tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <div className="p-3 sm:p-6">
              <TabsContent value="subtimelines" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Subtimelines ({mockSubtimelines.length})</h3>
                  <Button size="sm" className="touch-manipulation">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Create Subtimeline
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mx-1 sm:mx-0">
                  {mockSubtimelines.map((subtimeline) => (
                    <TimelineCard 
                      key={subtimeline.id} 
                      timeline={subtimeline}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="matched" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Matched Opportunities ({mockMatchedOpportunities.length})</h3>
                </div>
                <MatchedTimelines />
              </TabsContent>

              <TabsContent value="analytics" className="m-0 space-y-4">
                <AnalyticsTab />
              </TabsContent>

              <TabsContent value="invested-users" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Invested Users ({mockInvestedUsers.length})</h3>
                </div>
                <div className="space-y-3">
                  {mockInvestedUsers.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">Investment: ${user.investment.toLocaleString()}</p>
                        </div>
                        <Button variant="outline" size="sm" className="touch-manipulation">
                          View Profile
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trading" className="m-0 space-y-4">
                <TradingTab />
              </TabsContent>

              <TabsContent value="followups" className="m-0">
                <FollowupsTab />
              </TabsContent>

              <TabsContent value="files" className="m-0">
                <FilesTab />
              </TabsContent>

              <TabsContent value="ratings" className="m-0">
                <RatingsTab />
              </TabsContent>

              <TabsContent value="rules" className="m-0">
                <RulesTermsTab />
              </TabsContent>

              <TabsContent value="admin" className="m-0">
                <AdminTab />
              </TabsContent>

              <TabsContent value="capital-flow" className="m-0 space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Capital Flow</h3>
                </div>
                <Card>
                  <CardContent className="p-4 sm:p-6">
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
              </TabsContent>

              <TabsContent value="transactions" className="m-0">
                <TransactionsTab />
              </TabsContent>

              <TabsContent value="valuation" className="m-0">
                <ValuationTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};