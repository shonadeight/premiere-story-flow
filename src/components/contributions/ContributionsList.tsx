import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContributionCard } from './ContributionCard';
import { ContributionCategory, ContributionStatus, ContributionDirection } from '@/types/contribution';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContributionsListProps {
  category: ContributionCategory | 'all';
  status: ContributionStatus | 'all';
  direction: ContributionDirection | 'all';
  searchQuery: string;
  sortBy: 'date' | 'valuation' | 'status';
}

interface Contribution {
  id: string;
  title: string | null;
  description: string | null;
  category: ContributionCategory;
  status: ContributionStatus;
  is_timeline: boolean;
  created_at: string;
  updated_at: string;
}

export const ContributionsList = ({
  category,
  status,
  direction,
  searchQuery,
  sortBy,
}: ContributionsListProps) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    loadContributions();
  }, [category, status, direction, searchQuery, sortBy, page]);

  const loadContributions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contributions')
        .select('*', { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Apply filters
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      // Search in title and description
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply sorting
      if (sortBy === 'date') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'status') {
        query = query.order('status', { ascending: true });
      }
      // Note: valuation sorting would require a join with contribution_valuations

      const { data, error, count } = await query;

      if (error) throw error;

      setContributions(data || []);
      setHasMore(count ? (page * pageSize) < count : false);
    } catch (error) {
      console.error('Error loading contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!loading && contributions.length === 0) {
    return (
      <Alert className="bg-muted/50">
        <Inbox className="h-4 w-4" />
        <AlertDescription>
          No contributions found. Try adjusting your filters or create a new contribution.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid of contribution cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contributions.map((contribution) => (
          <ContributionCard key={contribution.id} contribution={contribution} />
        ))}
      </div>

      {/* Pagination */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
