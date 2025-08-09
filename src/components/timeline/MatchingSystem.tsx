import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timeline } from '@/types/timeline';
import { mockTimelines } from '@/data/mockData';
import { Search, Target, TrendingUp, Users, Star } from 'lucide-react';
import { TimelineCard } from './TimelineCard';

interface MatchingSystemProps {
  currentTimeline: Timeline;
}

export const MatchingSystem = ({ currentTimeline }: MatchingSystemProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Find matching timelines based on criteria
  const getMatchedTimelines = () => {
    return mockTimelines.filter(timeline => {
      if (timeline.id === currentTimeline.id) return false;
      if (!timeline.isPublic) return false;

      // Match based on criteria overlap
      const criteriaMatch = timeline.matchingCriteria?.some(criteria =>
        currentTimeline.matchingCriteria?.includes(criteria)
      ) || false;

      // Match based on complementary types
      const typeMatch = (
        (currentTimeline.type === 'project' && timeline.type === 'contact') ||
        (currentTimeline.type === 'contact' && timeline.type === 'project') ||
        (currentTimeline.type === 'transaction' && timeline.type === 'project')
      );

      // Search filter
      const searchMatch = !searchQuery || 
        timeline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timeline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timeline.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const categoryMatch = selectedCategory === 'all' || timeline.type === selectedCategory;

      return (criteriaMatch || typeMatch) && searchMatch && categoryMatch;
    });
  };

  const matchedTimelines = getMatchedTimelines();

  const categories = [
    { id: 'all', label: 'All Types', icon: Target },
    { id: 'project', label: 'Projects', icon: TrendingUp },
    { id: 'contact', label: 'Contacts', icon: Users },
    { id: 'transaction', label: 'Financial', icon: Star },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Timeline Matching System
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Find complementary timelines to collaborate, invest, or create partnerships
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search timelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-8"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Matching Criteria Display */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Your Timeline Criteria:</div>
            <div className="flex flex-wrap gap-1">
              {currentTimeline.matchingCriteria?.map((criteria) => (
                <Badge key={criteria} variant="secondary" className="text-xs">
                  {criteria}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matched Timelines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Matched Timelines ({matchedTimelines.length})
          </h3>
          {matchedTimelines.length > 0 && (
            <Badge variant="outline">
              {Math.round((matchedTimelines.length / mockTimelines.length) * 100)}% match rate
            </Badge>
          )}
        </div>

        {matchedTimelines.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="font-medium mb-2">No matches found</h4>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or check back later for new opportunities
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedTimelines.map((timeline) => (
              <div key={timeline.id} className="relative">
                <TimelineCard timeline={timeline} view="grid" />
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="text-xs">
                    Match
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};