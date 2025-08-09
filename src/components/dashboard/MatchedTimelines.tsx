import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Star, 
  Users, 
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import { mockTimelines } from '@/data/mockData';

export const MatchedTimelines = () => {
  // Simulate personalized recommendations based on user profile
  const recommendedTimelines = [
    {
      ...mockTimelines[0],
      matchReason: "Because you invested in AI SaaS Platform",
      matchScore: 92,
      category: "AI & Technology"
    },
    {
      ...mockTimelines[3],
      matchReason: "Since you rated Sarah Chen Partnership highly",
      matchScore: 87,
      category: "Network Building"
    },
    {
      ...mockTimelines[5],
      matchReason: "Based on your intellectual capital focus",
      matchScore: 82,
      category: "Training & Development"
    },
    {
      id: 'rec-1',
      title: 'Blockchain DeFi Protocol',
      description: 'Revolutionary DeFi platform targeting institutional investors',
      value: 45000,
      change: 15600,
      changePercent: 53.2,
      type: 'project' as const,
      status: 'active' as const,
      tags: ['DeFi', 'Blockchain', 'Finance'],
      matchReason: "Because you're interested in financial innovation",
      matchScore: 78,
      category: "Financial Technology"
    }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Matched Timelines for You
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized recommendations based on your investment patterns and preferences
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedTimelines.map((timeline) => (
            <div key={timeline.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{timeline.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {timeline.matchScore}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {timeline.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Target className="h-3 w-3" />
                    <span>{timeline.matchReason}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {timeline.category}
                    </Badge>
                    {timeline.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold">{formatCurrency(timeline.value)}</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{timeline.changePercent}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>24 investors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>4.8 rating</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <span>Invest</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline">
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};