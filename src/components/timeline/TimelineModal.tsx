import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Users, 
  Star, 
  GitBranch,
  DollarSign,
  Eye,
  MessageSquare,
  X,
  ArrowRight
} from 'lucide-react';
import { Timeline } from '@/types/timeline';

interface TimelineModalProps {
  timeline: Timeline | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TimelineModal = ({ timeline, isOpen, onClose }: TimelineModalProps) => {
  const navigate = useNavigate();

  if (!timeline) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: timeline.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/timeline/${timeline.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle>{timeline.title}</DialogTitle>
              <Badge variant="outline" className="capitalize">{timeline.type}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{formatCurrency(timeline.value)}</div>
                <div className="text-sm text-muted-foreground">Current Value</div>
                <div className={`text-sm flex items-center justify-center gap-1 mt-1 ${
                  timeline.change >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {timeline.changePercent > 0 ? '+' : ''}{timeline.changePercent}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{timeline.subtimelines}</div>
                <div className="text-sm text-muted-foreground">Sub-timelines</div>
                <div className="text-sm text-primary mt-1">
                  <GitBranch className="h-3 w-3 inline mr-1" />
                  Active
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{timeline.rating}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
                <div className="text-sm text-accent mt-1">
                  <Star className="h-3 w-3 inline mr-1 fill-current" />
                  Top tier
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{timeline.investedMembers}</div>
                <div className="text-sm text-muted-foreground">Investors</div>
                <div className="text-sm text-primary mt-1">
                  <Users className="h-3 w-3 inline mr-1" />
                  Growing
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground">{timeline.description}</p>
          </div>

          {/* Tags */}
          {timeline.tags && (
            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {timeline.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Investment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Investment Opportunity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Valuation:</span>
                  <span className="font-medium">{formatCurrency(timeline.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Min Investment:</span>
                  <span className="font-medium">$1,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expected ROI:</span>
                  <span className="font-medium text-success">15-25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level:</span>
                  <Badge variant="outline">Medium</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Activity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Views:</span>
                  <span className="font-medium">{timeline.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Matched Timelines:</span>
                  <span className="font-medium">{timeline.matchedTimelines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated:</span>
                  <span className="font-medium text-muted-foreground">
                    {new Date(timeline.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={timeline.status === 'active' ? 'default' : 'secondary'}>
                    {timeline.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleViewDetails} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View Full Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Invest
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};