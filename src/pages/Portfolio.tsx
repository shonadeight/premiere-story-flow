import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
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
  Plus,
  Settings,
  ThumbsUp
} from 'lucide-react';
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
import { ContributionWizard } from '@/components/contributions/ContributionWizard';
import { useToast } from '@/hooks/use-toast';

export const Portfolio = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('subtimelines');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<any>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [contributionWizardOpen, setContributionWizardOpen] = useState(false);
  const [rootTimeline, setRootTimeline] = useState<any>(null);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to view your portfolio',
          variant: 'destructive'
        });
        navigate('/auth');
        return;
      }

      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profile) {
        setUserProfile(profile);
      }

      // Load root timeline (personal/profile timeline)
      const { data: rootTimelineData, error: rootError } = await supabase
        .from('timelines')
        .select('*')
        .eq('user_id', user.id)
        .eq('timeline_type', 'personal')
        .limit(1)
        .maybeSingle();

      if (rootError) throw rootError;

      // If no root timeline exists, create one
      if (!rootTimelineData) {
        const { data: newTimeline, error: createError } = await supabase
          .from('timelines')
          .insert({
            user_id: user.id,
            timeline_type: 'personal',
            title: `${profile?.name || 'My'} Profile Timeline`,
            description: profile?.professional_role 
              ? `Professional timeline for ${profile.professional_role}`
              : 'My professional portfolio and contributions',
            is_public: false
          })
          .select()
          .single();

        if (createError) throw createError;
        setRootTimeline(newTimeline);
      } else {
        setRootTimeline(rootTimelineData);
      }

      // Load all timelines for the user
      const { data: timelinesData, error: timelinesError } = await supabase
        .from('timelines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (timelinesError) throw timelinesError;
      
      // Transform to match Timeline type format
      const transformedTimelines: Timeline[] = (timelinesData || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        type: t.timeline_type as any,
        ownerId: t.user_id,
        visibility: t.is_public ? 'public' : 'private',
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        tags: [],
        purpose: '',
        scope: '',
        allowedContributionTypes: [],
        valuationModel: 'market',
        baseUnit: 'USD',
        trackingInputs: [],
        verificationMethod: 'owner',
        rewardTypes: [],
        distributionModel: 'pro-rata',
        payoutTriggers: [],
        allowSubtimelines: true,
        subtimelineCreation: 'manual',
        subtimelineInheritance: true,
        governance: {
          approvalRequired: false,
          approvers: [],
          kycRequired: false
        },
        value: 0,
        currency: 'USD',
        change: 0,
        changePercent: 0,
        invested: false,
        subtimelines: [],
        rating: 0,
        views: 0,
        investedMembers: 0,
        matchedTimelines: 0,
        status: 'active',
        likes: 0,
        comments: 0,
        isPublic: t.is_public || false
      }));

      setTimelines(transformedTimelines);
    } catch (error: any) {
      console.error('Error loading portfolio:', error);
      toast({
        title: 'Error loading portfolio',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'subtimelines', label: 'My Timelines', icon: GitBranch, count: timelines.length },
    { id: 'matched', label: 'Matched Opportunities', icon: Target, count: 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: null },
    { id: 'invested-users', label: 'Invested Users', icon: Users, count: 0 },
    { id: 'followups', label: 'Followups', icon: MessageSquare, count: 0 },
    { id: 'trading', label: 'Trading', icon: TrendingUp, count: null },
    { id: 'files', label: 'Files', icon: FileText, count: 0 },
    { id: 'ratings', label: 'Ratings', icon: Star, count: null },
    { id: 'rules', label: 'Rules & Terms', icon: Shield, count: 0 },
    { id: 'admin', label: 'Admin', icon: UserCheck, count: 0 },
    { id: 'capital-flow', label: 'Capital Flow', icon: DollarSign, count: null },
    { id: 'transactions', label: 'Transactions', icon: History, count: 0 },
    { id: 'valuation', label: 'Valuation', icon: Calculator, count: null },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleInvest = () => {
    setContributionWizardOpen(true);
  };

  const handleFollow = () => {
    console.log('Following timeline');
  };

  const handleShare = () => {
    console.log('Sharing timeline');
  };

  return (
    <div className="container mx-auto px-1 sm:px-6 py-3 sm:py-6 space-y-4 sm:space-y-6 pb-20 lg:pb-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold truncate">
            {rootTimeline.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {rootTimeline.description}
          </p>
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

      {/* Profile Timeline Summary Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="p-4 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                <CardTitle className="text-xl sm:text-2xl font-bold">{rootTimeline.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {rootTimeline.timeline_type} Timeline
                  </Badge>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base line-clamp-3">{rootTimeline.description}</p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-[200px]">
              <Button 
                onClick={handleInvest}
                size={isMobile ? "sm" : "default"}
                className="w-full touch-manipulation"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Invest Now
              </Button>
              <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                <span>0 investors</span>
                <span>{rootTimeline.views || 0} views</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50">
              <div className="text-lg sm:text-2xl font-bold text-primary">
                {formatCurrency(0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Worth</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                +{formatCurrency(0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Gained</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">0/5</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Rating</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">{timelines.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Timelines</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horizontal Scrollable Tabs - Same Structure as Timeline Detail */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Portfolio Details</h2>
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
                        {tab.count !== null && (
                          <Badge variant="secondary" className="text-xs h-4 px-1.5 ml-1">
                            {tab.count}
                          </Badge>
                        )}
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
                  <h3 className="text-lg font-semibold">My Timelines ({timelines.length})</h3>
                  <Button 
                    size="sm" 
                    className="touch-manipulation"
                    onClick={() => setContributionWizardOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Timeline
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mx-1 sm:mx-0">
                  {timelines.map((timeline) => (
                    <TimelineCard 
                      key={timeline.id} 
                      timeline={timeline}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="matched" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Matched Opportunities (8)</h3>
                </div>
                <MatchedTimelines />
              </TabsContent>

              <TabsContent value="analytics" className="m-0 space-y-4">
                <AnalyticsTab />
              </TabsContent>

              <TabsContent value="invested-users" className="m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Invested Users (0)</h3>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Investor {i + 1}</h4>
                          <p className="text-sm text-muted-foreground">
                            Investment: {formatCurrency(Math.floor(Math.random() * 50000) + 10000)}
                          </p>
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

              <TabsContent value="rules" className="m-0">
                <RulesTermsTab />
              </TabsContent>

              <TabsContent value="admin" className="m-0">
                <AdminTab />
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

      {rootTimeline && (
        <ContributionWizard
          open={contributionWizardOpen}
          onOpenChange={setContributionWizardOpen}
          timelineId={rootTimeline.id}
        />
      )}
    </div>
  );
};