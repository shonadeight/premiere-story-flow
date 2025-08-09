import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TimelineCard } from '@/components/timeline/TimelineCard';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus,
  SortAsc,
  TrendingUp,
  Clock
} from 'lucide-react';
import { mockTimelines } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const navigate = useNavigate();

  const filteredTimelines = mockTimelines.filter(timeline => {
    const matchesSearch = timeline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         timeline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         timeline.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || timeline.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const sortedTimelines = [...filteredTimelines].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.value - a.value;
      case 'change':
        return b.changePercent - a.changePercent;
      case 'rating':
        return b.rating - a.rating;
      case 'updated':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

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
          <h1 className="text-2xl font-bold">Timeline Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your investment timelines and track performance
          </p>
        </div>
        <Button 
          onClick={() => navigate('/create')}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Timeline
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Custom Stats and Controls */}
      <div className="bg-card rounded-lg border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Capital Breakdown</h3>
          <Button variant="outline" size="sm">
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
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="h-8 px-3"
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
              Showing {sortedTimelines.length} of {mockTimelines.length} timelines
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
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Explore Opportunities
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};