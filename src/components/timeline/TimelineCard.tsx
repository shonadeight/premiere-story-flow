import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Star, 
  GitBranch,
  MessageSquare,
  DollarSign,
  Play,
  Pause,
  CheckCircle2
} from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { useNavigate } from 'react-router-dom';
import { ContributionBreakdown } from './ContributionBreakdown';

interface TimelineCardProps {
  timeline: Timeline;
  view?: 'grid' | 'list';
}

export const TimelineCard = ({ timeline, view = 'grid' }: TimelineCardProps) => {
  const navigate = useNavigate();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return '🚀';
      case 'contact': return '👤';
      case 'contribution': return '💡';
      case 'activity': return '⚡';
      case 'transaction': return '💰';
      case 'training': return '🧠';
      default: return '📊';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-success" />;
      case 'paused': return <Pause className="h-4 w-4 text-muted-foreground" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-success" />;
      default: return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: timeline.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (view === 'list') {
    return (
      <Card 
        className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary/50"
        onClick={() => navigate(`/timeline/${timeline.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{getTypeIcon(timeline.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{timeline.title}</h3>
                  {getStatusIcon(timeline.status)}
                  {timeline.invested && (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Invested
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{timeline.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(timeline.value)}</div>
                <div className={`flex items-center gap-1 ${
                  timeline.change >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {timeline.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{timeline.changePercent > 0 ? '+' : ''}{timeline.changePercent}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GitBranch className="h-4 w-4" />
                  <span>{timeline.subtimelines}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{timeline.investedMembers}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-accent" />
                  <span>{timeline.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
      onClick={() => navigate(`/timeline/${timeline.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{getTypeIcon(timeline.type)}</div>
            <div>
              <h3 className="font-semibold leading-tight">{timeline.title}</h3>
              <Badge variant="outline" className="text-xs mt-1 capitalize">
                {timeline.type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(timeline.status)}
            {timeline.invested && (
              <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                Invested
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {timeline.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{formatCurrency(timeline.value)}</span>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              timeline.change >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {timeline.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{timeline.changePercent > 0 ? '+' : ''}{timeline.changePercent}%</span>
              <span className="text-muted-foreground">
                ({timeline.change >= 0 ? '+' : ''}{formatCurrency(timeline.change)})
              </span>
            </div>
          </div>

          {timeline.invested && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your Investment:</span>
              <span className="font-medium">{formatCurrency(timeline.investedAmount || 0)}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {timeline.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <ContributionBreakdown compact />
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/50">
        <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              <span>{timeline.subtimelines}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{timeline.investedMembers}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{timeline.views}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-accent" />
              <span>{timeline.rating}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};