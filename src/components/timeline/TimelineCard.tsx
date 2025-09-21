import { useState } from 'react';
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
  CheckCircle2,
  Settings,
  Edit,
  MoreHorizontal,
  Plus,
  Heart,
  Share,
  Bell
} from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { TimelineEditModal } from './TimelineEditModal';
import { useNavigate } from 'react-router-dom';
import { ContributionBreakdown } from './ContributionBreakdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { SubtimelinesModal } from './SubtimelinesModal';
import { ImpactRatingModal } from './ImpactRatingModal';
import { SubscribeModal } from './SubscribeModal';
import { VisitsModal } from './VisitsModal';
import { ConversationModal } from './ConversationModal';

interface TimelineCardProps {
  timeline: Timeline;
  view?: 'grid' | 'list';
  onTimelineClick?: (timeline: Timeline) => void;
}

export const TimelineCard = ({ timeline, view = 'grid', onTimelineClick }: TimelineCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [isLiked, setIsLiked] = useState(false);
  const [showSubtimelines, setShowSubtimelines] = useState(false);
  const [showImpactRating, setShowImpactRating] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showVisitsModal, setShowVisitsModal] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);

  const handleEditTimeline = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleSaveTimeline = (updatedTimeline: Timeline) => {
    // In real app, this would save to database
    console.log('Saving timeline:', updatedTimeline);
  };

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
        className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary/50 touch-manipulation active:scale-[0.98]"
        onClick={(e) => {
          e.preventDefault();
          if (isMobile) {
            (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
            setTimeout(() => {
              navigate(`/timeline/${timeline.id}`);
            }, 100);
          } else {
            navigate(`/timeline/${timeline.id}`);
          }
        }}
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
                  <span>{timeline.subtimelines.length}</span>
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
      className="hover:shadow-md transition-all duration-200 cursor-pointer border-0 bg-card/80 backdrop-blur-sm hover:bg-card/90 touch-manipulation active:scale-[0.98]"
      onClick={(e) => {
        e.preventDefault();
        if (isMobile) {
          (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
          setTimeout(() => {
            navigate(`/timeline/${timeline.id}`);
          }, 100);
        } else {
          navigate(`/timeline/${timeline.id}`);
        }
      }}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xl">{getTypeIcon(timeline.type)}</div>
            <div>
              <h3 className="font-semibold leading-tight text-sm">{timeline.title}</h3>
              <Badge variant="outline" className="text-xs mt-1 capitalize h-4">
                {timeline.type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(timeline.status)}
            {timeline.invested && (
              <Badge variant="secondary" className="bg-success/10 text-success text-xs h-4">
                Invested
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {timeline.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold">{formatCurrency(timeline.value)}</span>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              timeline.change >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {timeline.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{timeline.changePercent > 0 ? '+' : ''}{timeline.changePercent}%</span>
            </div>
          </div>

          {timeline.invested && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Your Investment:</span>
              <span className="font-medium">{formatCurrency(timeline.investedAmount || 0)}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1 mb-2">
            {timeline.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs h-4">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-2 border-t border-border/30">
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-5 px-1 text-muted-foreground hover:text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtimelines(true);
                }}
              >
                <GitBranch className="h-3 w-3" />
                <span>{timeline.subtimelines.length}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-5 px-1 text-muted-foreground hover:text-yellow-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImpactRating(true);
                }}
              >
                <Star className="h-3 w-3 fill-current text-accent" />
                <span>{timeline.rating}</span>
              </Button>
                 <Button
                   variant="ghost"
                   size="sm"
                   className="gap-1 h-5 px-1 text-muted-foreground hover:text-orange-500"
                   onClick={(e) => {
                     e.stopPropagation();
                     setShowSubscribeModal(true);
                   }}
                 >
                   <Bell className="h-3 w-3" />
                 </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 className="gap-1 h-5 px-1 text-muted-foreground hover:text-purple-500"
                 onClick={(e) => {
                   e.stopPropagation();
                   setShowVisitsModal(true);
                 }}
               >
                 <Eye className="h-3 w-3" />
                 <span>{timeline.views}</span>
               </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{timeline.investedMembers}</span>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1 h-7 px-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
              >
                <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{timeline.likes + (isLiked ? 1 : 0)}</span>
              </Button>
              
               <Button
                 variant="ghost"
                 size="sm"
                 className="gap-1 h-7 px-2 text-muted-foreground hover:text-blue-500"
                 onClick={(e) => {
                   e.stopPropagation();
                   setShowConversationModal(true);
                 }}
               >
                 <MessageSquare className="h-3.5 w-3.5" />
                 <span className="text-xs">{timeline.comments}</span>
               </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-7 px-2 text-muted-foreground hover:text-green-500"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle share action
                }}
              >
                <Share className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Contribute Button */}
            <Button
              variant="default"
              size="sm"
              className="gap-1 h-7 px-2 bg-primary/90 hover:bg-primary text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/contribute?timelineId=${timeline.id}`);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="text-xs">Contribute</span>
            </Button>
          </div>
        </div>
      </CardFooter>

      
      <TimelineEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        timeline={timeline}
        onSave={handleSaveTimeline}
      />

      {/* Action Modals */}
      <SubtimelinesModal
        open={showSubtimelines}
        onOpenChange={setShowSubtimelines}
        timeline={timeline}
      />
      
      <ImpactRatingModal
        open={showImpactRating}
        onOpenChange={setShowImpactRating}
        timeline={timeline}
      />
      
      <SubscribeModal
        open={showSubscribeModal}
        onOpenChange={setShowSubscribeModal}
        timeline={timeline}
      />
      
      <VisitsModal 
        open={showVisitsModal} 
        onOpenChange={setShowVisitsModal}
        timeline={timeline}
      />

      <ConversationModal
        open={showConversationModal}
        onOpenChange={setShowConversationModal}
        timeline={timeline}
      />
    </Card>
  );
};