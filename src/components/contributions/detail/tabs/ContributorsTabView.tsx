import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface ContributorsTabViewProps {
  contributionId: string;
}

interface ContributorData {
  id: string;
  user_id: string;
  role: string;
  permissions: any;
  created_at: string;
}

export const ContributorsTabView = ({ contributionId }: ContributorsTabViewProps) => {
  const [contributors, setContributors] = useState<ContributorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContributors();
  }, [contributionId]);

  const fetchContributors = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_contributors')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContributors(data || []);
    } catch (error) {
      console.error('Error fetching contributors:', error);
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

  if (contributors.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No contributors added yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {contributors.map((contributor) => (
        <Card key={contributor.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-mono text-sm">
                {contributor.user_id}
              </CardTitle>
              <Badge className="capitalize">
                {contributor.role.replace(/_/g, ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {contributor.permissions && Object.keys(contributor.permissions).length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(contributor.permissions).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {String(value)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
