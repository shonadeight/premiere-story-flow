import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Users, Globe, Clock, MapPin } from 'lucide-react';
import { Timeline } from '@/types/timeline';

interface VisitsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline: Timeline;
}

export const VisitsModal = ({ open, onOpenChange, timeline }: VisitsModalProps) => {
  const visitorData = [
    { period: 'Today', visits: 42, uniqueVisitors: 38 },
    { period: 'This Week', visits: 287, uniqueVisitors: 198 },
    { period: 'This Month', visits: 1243, uniqueVisitors: 891 },
    { period: 'All Time', visits: timeline.views, uniqueVisitors: Math.floor(timeline.views * 0.7) }
  ];

  const recentVisitors = [
    { id: '1', name: 'Anonymous User', time: '2 minutes ago', location: 'New York, US' },
    { id: '2', name: 'John D.', time: '15 minutes ago', location: 'London, UK' },
    { id: '3', name: 'Anonymous User', time: '32 minutes ago', location: 'Tokyo, JP' },
    { id: '4', name: 'Sarah M.', time: '1 hour ago', location: 'Berlin, DE' },
    { id: '5', name: 'Mike R.', time: '2 hours ago', location: 'Sydney, AU' }
  ];

  const topSources = [
    { source: 'Direct', percentage: 45, visits: 512 },
    { source: 'Search Engines', percentage: 28, visits: 318 },
    { source: 'Social Media', percentage: 15, visits: 170 },
    { source: 'Referrals', percentage: 12, visits: 136 }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visit Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {visitorData.map((data) => (
              <Card key={data.period}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{data.visits.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mb-1">{data.period}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.uniqueVisitors.toLocaleString()} unique
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Traffic Sources */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Traffic Sources
              </h3>
              <div className="space-y-3">
                {topSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span className="text-sm">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {source.visits} visits
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {source.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Visitors */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Recent Visitors
              </h3>
              <div className="space-y-3">
                {recentVisitors.map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{visitor.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {visitor.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {visitor.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-3 text-center">
                <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-2" />
                <div className="text-lg font-bold">2.4 min</div>
                <div className="text-xs text-muted-foreground">Avg. Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Eye className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <div className="text-lg font-bold">3.2</div>
                <div className="text-xs text-muted-foreground">Pages/Visit</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Users className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                <div className="text-lg font-bold">68%</div>
                <div className="text-xs text-muted-foreground">Return Rate</div>
              </CardContent>
            </Card>
          </div>

          <Button className="w-full">
            View Detailed Analytics
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};