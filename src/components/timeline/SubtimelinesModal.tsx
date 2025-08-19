import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timeline } from '@/types/timeline';
import { GitBranch, TrendingUp, TrendingDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubtimelinesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline: Timeline;
}

export const SubtimelinesModal = ({ open, onOpenChange, timeline }: SubtimelinesModalProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSubTimelineClick = (subtimelineId: string) => {
    navigate(`/timeline/${subtimelineId}`);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Subtimelines ({timeline.subtimelines?.length || 0})
        </h3>
        <Button size="sm">
          <GitBranch className="h-4 w-4 mr-2" />
          Create Subtimeline
        </Button>
      </div>

      {timeline.subtimelines && timeline.subtimelines.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {timeline.subtimelines.map((subtimeline) => (
            <Card 
              key={subtimeline.id} 
              className="cursor-pointer hover:shadow-md transition-all duration-200 touch-manipulation"
              onClick={() => handleSubTimelineClick(subtimeline.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate">{subtimeline.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {subtimeline.type}
                      </Badge>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm sm:text-lg">
                        {formatCurrency(subtimeline.value)}
                      </div>
                      <div className={`flex items-center gap-1 text-xs sm:text-sm ${
                        subtimeline.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subtimeline.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(subtimeline.changePercent)}%
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {subtimeline.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-muted-foreground">
          <GitBranch className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
          <p className="text-sm sm:text-base">No subtimelines found for this timeline.</p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {timeline.title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            {timeline.title}
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};