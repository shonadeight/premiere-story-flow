import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContributionStatusBadge } from '@/components/contributions/ContributionStatusBadge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ContributionCategory, ContributionStatus } from '@/types/contribution';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Tab components
import { OverviewTab } from '@/components/contributions/detail/tabs/OverviewTab';
import { InsightsTabView } from '@/components/contributions/detail/tabs/InsightsTabView';
import { ValuationTabView } from '@/components/contributions/detail/tabs/ValuationTabView';
import { FollowupTabView } from '@/components/contributions/detail/tabs/FollowupTabView';
import { SmartRulesTabView } from '@/components/contributions/detail/tabs/SmartRulesTabView';
import { RatingsTabView } from '@/components/contributions/detail/tabs/RatingsTabView';
import { FilesTabView } from '@/components/contributions/detail/tabs/FilesTabView';
import { KnotsTabView } from '@/components/contributions/detail/tabs/KnotsTabView';
import { ContributorsTabView } from '@/components/contributions/detail/tabs/ContributorsTabView';

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

const ContributionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contribution, setContribution] = useState<Contribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchContribution();
    }
  }, [id]);

  const fetchContribution = async () => {
    try {
      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setContribution(data as Contribution);
    } catch (error) {
      console.error('Error fetching contribution:', error);
      toast.error('Failed to load contribution');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('contributions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Contribution deleted successfully');
      navigate('/contributions');
    } catch (error) {
      console.error('Error deleting contribution:', error);
      toast.error('Failed to delete contribution');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!contribution) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Contribution Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The contribution you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/contributions')}>
              Back to Contributions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 pb-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/contributions')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contributions
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold truncate">
                  {contribution.title || 'Untitled Contribution'}
                </h1>
                <ContributionStatusBadge status={contribution.status} />
                {contribution.is_timeline && (
                  <Badge variant="outline">Timeline</Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3">
                {contribution.description || 'No description provided'}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="capitalize">
                  {contribution.category}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="valuation">Valuation</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
            <TabsTrigger value="smart-rules">Smart Rules</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="knots">Knots</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab contributionId={contribution.id} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <InsightsTabView contributionId={contribution.id} />
          </TabsContent>

          <TabsContent value="valuation" className="space-y-4">
            <ValuationTabView contributionId={contribution.id} />
          </TabsContent>

          <TabsContent value="followup" className="space-y-4">
            <FollowupTabView contributionId={contribution.id} />
          </TabsContent>

          <TabsContent value="smart-rules" className="space-y-4">
            <SmartRulesTabView contributionId={contribution.id} />
          </TabsContent>

          <TabsContent value="ratings" className="space-y-4">
            <RatingsTabView contributionId={contribution.id} />
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <FilesTabView contributionId={contribution.id} />
          </TabsContent>

          <TabsContent value="knots" className="space-y-4">
            <KnotsTabView contributionId={contribution.id} />
          </TabsContent>

          <TabsContent value="contributors" className="space-y-4">
            <ContributorsTabView contributionId={contribution.id} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contribution</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contribution? This action cannot be undone.
              All associated data (insights, valuations, files, etc.) will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContributionDetail;
