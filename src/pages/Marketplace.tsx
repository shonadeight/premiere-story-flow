import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimelineCard } from '@/components/timeline/TimelineCard';
import { InvestmentModal } from '@/components/timeline/InvestmentModal';
import { 
  Search, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  Filter,
  Star,
  Zap,
  Award,
  Shield,
  Clock,
  BarChart3
} from 'lucide-react';
import { mockTimelines } from '@/data/mockData';
import { Timeline } from '@/types/timeline';

export const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [minInvestment, setMinInvestment] = useState('');
  const [maxInvestment, setMaxInvestment] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);

  // Filter public timelines available for investment
  const publicTimelines = mockTimelines.filter(t => t.isPublic && t.status !== 'completed');

  const filteredTimelines = publicTimelines.filter(timeline => {
    const matchesSearch = timeline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         timeline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         timeline.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || timeline.type === selectedCategory;
    
    const matchesRisk = riskFilter === 'all' || timeline.investmentTerms?.riskLevel === riskFilter;
    
    const matchesMinInvestment = !minInvestment || 
                                (timeline.investmentTerms?.minInvestment || 0) >= parseInt(minInvestment);
    
    const matchesMaxInvestment = !maxInvestment || 
                                (timeline.investmentTerms?.maxInvestment || Infinity) <= parseInt(maxInvestment);
    
    return matchesSearch && matchesCategory && matchesRisk && matchesMinInvestment && matchesMaxInvestment;
  });

  const sortedTimelines = [...filteredTimelines].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.changePercent + b.views/100) - (a.changePercent + a.views/100);
      case 'roi':
        return (b.investmentTerms?.roi || 0) - (a.investmentTerms?.roi || 0);
      case 'min-investment':
        return (a.investmentTerms?.minInvestment || 0) - (b.investmentTerms?.minInvestment || 0);
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const featuredTimelines = publicTimelines
    .filter(t => t.rating >= 4.5 && t.changePercent > 10)
    .slice(0, 3);

  const trendingTimelines = publicTimelines
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  const categories = [
    { value: 'all', label: 'All Categories', count: publicTimelines.length },
    { value: 'project', label: 'Projects', count: publicTimelines.filter(t => t.type === 'project').length },
    { value: 'contact', label: 'Contacts', count: publicTimelines.filter(t => t.type === 'contact').length },
    { value: 'training', label: 'Training', count: publicTimelines.filter(t => t.type === 'training').length },
    { value: 'transaction', label: 'Financial', count: publicTimelines.filter(t => t.type === 'transaction').length },
  ];

  const marketStats = [
    { label: 'Total Volume', value: '$2.4M', change: '+12%', icon: DollarSign },
    { label: 'Active Investments', value: '1,247', change: '+8%', icon: Target },
    { label: 'Success Rate', value: '87%', change: '+3%', icon: Award },
    { label: 'Avg ROI', value: '23%', change: '+5%', icon: TrendingUp },
  ];

  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Timeline Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and invest in high-potential timelines
          </p>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          AI Recommendations
        </Button>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {marketStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-success">{stat.change}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Section */}
      <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Featured Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredTimelines.map((timeline) => (
              <div key={timeline.id} className="relative">
                <TimelineCard timeline={timeline} view="grid" />
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                  Featured
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search timelines, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="roi">Highest ROI</SelectItem>
                  <SelectItem value="min-investment">Min Investment</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Min Investment ($)"
              type="number"
              value={minInvestment}
              onChange={(e) => setMinInvestment(e.target.value)}
            />
            <Input
              placeholder="Max Investment ($)"
              type="number"
              value={maxInvestment}
              onChange={(e) => setMaxInvestment(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Timelines ({sortedTimelines.length})</TabsTrigger>
          <TabsTrigger value="trending">Trending ({trendingTimelines.length})</TabsTrigger>
          <TabsTrigger value="seeking">Seeking Investment</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {sortedTimelines.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-medium mb-2">No timelines found</h4>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTimelines.map((timeline) => (
                <div key={timeline.id} className="relative group">
                  <TimelineCard timeline={timeline} view="grid" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg"></div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm"
                      onClick={() => setSelectedTimeline(timeline)}
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      Invest
                    </Button>
                  </div>
                  {timeline.investmentTerms && (
                    <div className="absolute top-2 right-2 space-y-1">
                      <Badge variant="secondary" className="text-xs">
                        {timeline.investmentTerms.roi}% ROI
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs block ${
                          timeline.investmentTerms.riskLevel === 'low' ? 'border-success text-success' :
                          timeline.investmentTerms.riskLevel === 'medium' ? 'border-accent text-accent' :
                          'border-destructive text-destructive'
                        }`}
                      >
                        <Shield className="h-2 w-2 mr-1" />
                        {timeline.investmentTerms.riskLevel}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingTimelines.map((timeline, index) => (
              <Card key={timeline.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{timeline.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {timeline.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs">
                        <BarChart3 className="h-3 w-3" />
                        <span>{timeline.views} views</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-success">+{timeline.changePercent}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" />
                        <span>{timeline.investedMembers} investors</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedTimeline(timeline)}
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    Invest
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seeking" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTimelines
              .filter(t => t.status === 'seeking-investment')
              .map((timeline) => (
                <div key={timeline.id} className="relative">
                  <TimelineCard timeline={timeline} view="grid" />
                  <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                    <Clock className="h-2 w-2 mr-1" />
                    Seeking Investment
                  </Badge>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Investment Modal */}
      {selectedTimeline && (
        <InvestmentModal
          timeline={selectedTimeline}
          isOpen={true}
          onClose={() => setSelectedTimeline(null)}
        />
      )}
    </div>
  );
};