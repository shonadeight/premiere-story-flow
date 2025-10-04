import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TimelineCard } from '@/components/timeline/TimelineCard';
import { ContributionWizard } from '@/components/contributions/ContributionWizard';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus,
  SortAsc,
  TrendingUp,
  Clock,
  User,
  Phone,
  Mail,
  Briefcase
} from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  name?: string;
  phone?: string;
  professional_role?: string;
  email?: string;
}

interface UserData {
  profile: UserProfile | null;
  contributionTypes: Array<{ contribution_type: string }>;
  expectations: Array<{ expectation: string }>;
  outcomeSharing: Array<{ outcome_type: string }>;
  interests: Array<{ interest: string; category: string }>;
}

export const Dashboard = () => {
  const { toast } = useToast();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [userData, setUserData] = useState<UserData>({
    profile: null,
    contributionTypes: [],
    expectations: [],
    outcomeSharing: [],
    interests: []
  });
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributionWizardOpen, setContributionWizardOpen] = useState(false);
  const [defaultTimelineId, setDefaultTimelineId] = useState<string>('');
  const navigate = useNavigate();

  const filteredTimelines = timelines.filter(timeline => {
    const matchesSearch = timeline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (timeline.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || timeline.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const sortedTimelines = [...filteredTimelines].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return (b.value || 0) - (a.value || 0);
      case 'change':
        return (b.changePercent || 0) - (a.changePercent || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'updated':
      default:
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    }
  });

  useEffect(() => {
    fetchUserData();
    loadDefaultTimeline();
    loadTimelines();
  }, []);

  const loadTimelines = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: timelinesData, error } = await supabase
        .from('timelines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to Timeline type
      const transformed: Timeline[] = (timelinesData || []).map(t => ({
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
        matchedTimelines: 0
      }));

      setTimelines(transformed);
    } catch (error) {
      console.error('Error loading timelines:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all user data in parallel
      const [
        { data: profile },
        { data: contributionTypes },
        { data: expectations },
        { data: outcomeSharing },
        { data: interests }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_contribution_types').select('*').eq('user_id', user.id),
        supabase.from('user_expectations').select('*').eq('user_id', user.id),
        supabase.from('user_outcome_sharing').select('*').eq('user_id', user.id),
        supabase.from('user_interest_areas').select('*').eq('user_id', user.id)
      ]);

      setUserData({
        profile: profile || null,
        contributionTypes: contributionTypes || [],
        expectations: expectations || [],
        outcomeSharing: outcomeSharing || [],
        interests: interests || []
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultTimeline = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: timeline } = await supabase
        .from('timelines')
        .select('id')
        .eq('user_id', user.id)
        .eq('timeline_type', 'personal')
        .limit(1)
        .maybeSingle();

      if (timeline) {
        setDefaultTimelineId(timeline.id);
      }
    } catch (error) {
      console.error('Error loading timeline:', error);
    }
  };

  const timelineTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'project', label: 'Projects' },
    { value: 'contact', label: 'Contacts' },
    { value: 'transaction', label: 'Transactions' },
    { value: 'training', label: 'Training' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userData.profile?.name || 'User'}</h1>
          <p className="text-muted-foreground">
            Manage your investment timelines and track performance
          </p>
        </div>
        <Button 
          onClick={() => setContributionWizardOpen(true)}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Timeline
        </Button>
      </div>

      {/* User Profile Overview */}
      {!loading && userData.profile && (
        <Card className="p-6 mb-6 border-2 border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Profile Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Basic Info</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {userData.profile.name || 'Not provided'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {userData.profile.email || 'Not provided'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {userData.profile.phone || 'Not provided'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {userData.profile.professional_role || 'Not provided'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Contribution Types</h4>
              <div className="flex flex-wrap gap-1">
                {userData.contributionTypes.slice(0, 3).map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item.contribution_type}
                  </Badge>
                ))}
                {userData.contributionTypes.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{userData.contributionTypes.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Expectations</h4>
              <div className="flex flex-wrap gap-1">
                {userData.expectations.slice(0, 2).map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item.expectation}
                  </Badge>
                ))}
                {userData.expectations.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{userData.expectations.length - 2} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Outcome Sharing</h4>
              <div className="flex flex-wrap gap-1">
                {userData.outcomeSharing.slice(0, 2).map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item.outcome_type}
                  </Badge>
                ))}
                {userData.outcomeSharing.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{userData.outcomeSharing.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {userData.interests.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Areas of Interest</h4>
              <div className="flex flex-wrap gap-1">
                {userData.interests.slice(0, 5).map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item.interest}
                  </Badge>
                ))}
                {userData.interests.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{userData.interests.length - 5} more interests
                  </Badge>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Stats Cards */}
      <StatsCards />

      {/* Custom Stats and Controls */}
      <div className="bg-card rounded-lg border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Capital Breakdown</h3>
          <Button variant="outline" size="sm" className="hover:bg-muted">
            <Plus className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Financial Capital</div>
            <div className="text-xl font-bold">$45,200</div>
            <div className="text-xs text-success">+12.3%</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Network Capital</div>
            <div className="text-xl font-bold">$18,500</div>
            <div className="text-xs text-success">+8.7%</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Intellectual Capital</div>
            <div className="text-xl font-bold">$24,800</div>
            <div className="text-xs text-success">+15.2%</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Worth</div>
            <div className="text-xl font-bold">$88,500</div>
            <div className="text-xs text-success">+11.8%</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-card rounded-lg border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search timelines, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timelineTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent
                </SelectItem>
                <SelectItem value="value">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Value
                </SelectItem>
                <SelectItem value="change">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Change %
                </SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 border-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 border-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="cursor-pointer">
            Invested ({mockTimelines.filter(t => t.invested).length})
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Active ({mockTimelines.filter(t => t.status === 'active').length})
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            High Performance (3)
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            New Opportunities (5)
          </Badge>
        </div>
      </div>

      {/* Timeline Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="all">All Timelines</TabsTrigger>
          <TabsTrigger value="invested">Invested</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed" className="hidden lg:inline-flex">Completed</TabsTrigger>
          <TabsTrigger value="opportunities" className="hidden lg:inline-flex">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {sortedTimelines.length} of {timelines.length} timelines
            </p>
          </div>
          
          <div className={
            view === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {sortedTimelines.map((timeline) => (
              <TimelineCard key={timeline.id} timeline={timeline} view={view} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invested" className="space-y-4">
          <div className={
            view === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {sortedTimelines.filter(t => t.invested).map((timeline) => (
              <TimelineCard key={timeline.id} timeline={timeline} view={view} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className={
            view === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {sortedTimelines.filter(t => t.status === 'active').map((timeline) => (
              <TimelineCard key={timeline.id} timeline={timeline} view={view} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className={
            view === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {sortedTimelines.filter(t => t.status === 'completed').map((timeline) => (
              <TimelineCard key={timeline.id} timeline={timeline} view={view} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">AI-Powered Opportunities</h3>
            <p className="text-muted-foreground mb-4">
              Discover investment opportunities tailored to your portfolio
            </p>
            <Button variant="outline" className="hover:bg-muted border-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Explore Opportunities
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <ContributionWizard
        open={contributionWizardOpen}
        onOpenChange={setContributionWizardOpen}
        timelineId={defaultTimelineId}
      />
    </div>
  );
};