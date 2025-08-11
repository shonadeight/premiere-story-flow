import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { useNavigate } from 'react-router-dom';

interface SubtimelinesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline: Timeline;
}

export const SubtimelinesModal = ({ open, onOpenChange, timeline }: SubtimelinesModalProps) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Subtimelines ({timeline.subtimelines?.length || 0})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage and view all subtimelines under {timeline.title}
            </p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Subtimeline
            </Button>
          </div>

          <div className="space-y-3">
            {timeline.subtimelines?.map((subtimeline) => (
              <Card 
                key={subtimeline.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  navigate(`/timeline/${subtimeline.id}`);
                  onOpenChange(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{subtimeline.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {subtimeline.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {subtimeline.description}
                      </p>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="font-semibold">{formatCurrency(subtimeline.value)}</div>
                      <div className={`flex items-center gap-1 text-sm ${
                        subtimeline.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subtimeline.change >= 0 ? 
                          <TrendingUp className="h-3 w-3" /> : 
                          <TrendingDown className="h-3 w-3" />
                        }
                        <span>{subtimeline.changePercent > 0 ? '+' : ''}{subtimeline.changePercent}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                No subtimelines found. Create your first subtimeline to get started.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};