import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';

interface RatingsTabViewProps {
  contributionId: string;
}

interface RatingData {
  id: string;
  rating_value: number | null;
  comment: string | null;
  rater_user_id: string;
  created_at: string;
}

export const RatingsTabView = ({ contributionId }: RatingsTabViewProps) => {
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [contributionId]);

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_ratings')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRatings(data || []);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No ratings yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const averageRating = ratings.reduce((acc, r) => acc + (r.rating_value || 0), 0) / ratings.length;

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Individual Ratings */}
      <div className="space-y-4">
        {ratings.map((rating) => (
          <Card key={rating.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-1">
                  {rating.rating_value !== null &&
                    [1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rating.rating_value!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(rating.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              {rating.comment && (
                <p className="text-sm text-muted-foreground">{rating.comment}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
