import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Users, Target } from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { Progress } from '@/components/ui/progress';

interface ImpactRatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline: Timeline;
}

export const ImpactRatingModal = ({ open, onOpenChange, timeline }: ImpactRatingModalProps) => {
  const ratingCriteria = [
    { name: 'Innovation', score: 4.5, description: 'How innovative and unique the timeline is' },
    { name: 'Execution', score: 4.2, description: 'Quality of implementation and delivery' },
    { name: 'Impact', score: 4.8, description: 'Positive impact on stakeholders and community' },
    { name: 'Sustainability', score: 4.1, description: 'Long-term viability and sustainability' },
    { name: 'Market Potential', score: 4.6, description: 'Market opportunity and growth potential' }
  ];

  const overallRating = ratingCriteria.reduce((sum, criteria) => sum + criteria.score, 0) / ratingCriteria.length;

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(score) 
            ? 'text-yellow-500 fill-current' 
            : i < score 
            ? 'text-yellow-500 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Impact Rating
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Rating */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {renderStars(overallRating)}
              </div>
              <div className="text-3xl font-bold text-yellow-600">
                {overallRating.toFixed(1)}/5.0
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Overall Impact Rating
              </p>
            </CardContent>
          </Card>

          {/* Rating Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold">Rating Breakdown</h3>
            {ratingCriteria.map((criteria) => (
              <Card key={criteria.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{criteria.name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(criteria.score)}</div>
                      <span className="text-sm font-medium">{criteria.score}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{criteria.description}</p>
                  <Progress value={criteria.score * 20} className="mt-2 h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-3 text-center">
                <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-2" />
                <div className="text-lg font-bold">+24%</div>
                <div className="text-xs text-muted-foreground">Growth Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <div className="text-lg font-bold">156</div>
                <div className="text-xs text-muted-foreground">Community Size</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Rate Timeline
            </Button>
            <Button className="flex-1">
              View Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};