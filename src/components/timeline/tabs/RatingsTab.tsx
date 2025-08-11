import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  TrendingUp,
  Award,
  Users,
  Plus,
  Filter
} from 'lucide-react';

interface RatingItem {
  id: string;
  rating: number;
  reviewerName: string;
  reviewerRole: string;
  comment: string;
  category: string;
  date: string;
  helpful: number;
}

interface RatingCriteria {
  id: string;
  name: string;
  rating: number;
  description: string;
}

export const RatingsTab = () => {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockRatings: RatingItem[] = [
    {
      id: '1',
      rating: 5,
      reviewerName: 'John Doe',
      reviewerRole: 'Project Manager',
      comment: 'Excellent execution and delivery. Timeline was well-structured and provided clear visibility into progress. Highly recommend.',
      category: 'execution',
      date: '2024-12-10',
      helpful: 12
    },
    {
      id: '2',
      rating: 4,
      reviewerName: 'Jane Smith',
      reviewerRole: 'Investor',
      comment: 'Good ROI and consistent updates. Communication could be improved but overall satisfied with the results.',
      category: 'communication',
      date: '2024-12-08',
      helpful: 8
    },
    {
      id: '3',
      rating: 5,
      reviewerName: 'Mike Johnson',
      reviewerRole: 'Technical Lead',
      comment: 'Outstanding technical approach and innovation. The team delivered beyond expectations.',
      category: 'innovation',
      date: '2024-12-05',
      helpful: 15
    },
    {
      id: '4',
      rating: 4,
      reviewerName: 'Sarah Wilson',
      reviewerRole: 'Marketing Director',
      comment: 'Great collaboration and professional service. Timeline helped achieve our marketing goals effectively.',
      category: 'collaboration',
      date: '2024-12-03',
      helpful: 6
    }
  ];

  const ratingCriteria: RatingCriteria[] = [
    { id: '1', name: 'Execution Quality', rating: 4.8, description: 'How well tasks are completed' },
    { id: '2', name: 'Communication', rating: 4.2, description: 'Clarity and frequency of updates' },
    { id: '3', name: 'Innovation', rating: 4.9, description: 'Creative solutions and approaches' },
    { id: '4', name: 'Collaboration', rating: 4.5, description: 'Teamwork and cooperation' },
    { id: '5', name: 'Reliability', rating: 4.7, description: 'Meeting deadlines and commitments' },
    { id: '6', name: 'Value Creation', rating: 4.6, description: 'ROI and measurable outcomes' }
  ];

  const categories = [
    { id: 'all', label: 'All Reviews', count: mockRatings.length },
    { id: 'execution', label: 'Execution', count: mockRatings.filter(r => r.category === 'execution').length },
    { id: 'communication', label: 'Communication', count: mockRatings.filter(r => r.category === 'communication').length },
    { id: 'innovation', label: 'Innovation', count: mockRatings.filter(r => r.category === 'innovation').length },
    { id: 'collaboration', label: 'Collaboration', count: mockRatings.filter(r => r.category === 'collaboration').length }
  ];

  const filteredRatings = selectedCategory === 'all' 
    ? mockRatings 
    : mockRatings.filter(r => r.category === selectedCategory);

  const averageRating = mockRatings.reduce((acc, rating) => acc + rating.rating, 0) / mockRatings.length;
  const totalReviews = mockRatings.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: mockRatings.filter(r => r.rating === stars).length,
    percentage: (mockRatings.filter(r => r.rating === stars).length / totalReviews) * 100
  }));

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ratings & Reviews ({totalReviews})</h3>
        <Button size="sm" className="touch-manipulation">
          <Plus className="h-4 w-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overall Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating), 'lg')}
              <div className="text-sm text-muted-foreground mt-1">
                Based on {totalReviews} reviews
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3 text-sm">
                  <div className="w-8 text-right">{stars}★</div>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <div className="w-8 text-muted-foreground">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rating Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratingCriteria.map((criteria) => (
              <div key={criteria.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{criteria.name}</span>
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(criteria.rating), 'sm')}
                    <span className="text-sm font-medium">{criteria.rating}</span>
                  </div>
                </div>
                <Progress value={criteria.rating * 20} className="h-2" />
                <p className="text-xs text-muted-foreground">{criteria.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap touch-manipulation"
          >
            {category.label}
            <Badge variant="secondary" className="ml-2 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredRatings.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {review.reviewerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{review.reviewerName}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {review.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating, 'sm')}
                        <span className="text-xs text-muted-foreground">
                          {review.reviewerRole} • {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed">{review.comment}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <ThumbsUp className="h-3 w-3" />
                      Helpful ({review.helpful})
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <MessageSquare className="h-3 w-3" />
                      Reply
                    </button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-xs touch-manipulation">
                    Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRatings.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No reviews found for this category</p>
            <Button variant="outline" className="mt-4 touch-manipulation">
              <Plus className="h-4 w-4 mr-2" />
              Be the first to review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};