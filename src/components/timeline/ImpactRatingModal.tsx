import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Users, Target } from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { useState } from 'react';

interface ImpactRatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline: Timeline;
}

export const ImpactRatingModal = ({ open, onOpenChange, timeline }: ImpactRatingModalProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const isMobile = useIsMobile();

  const ratingCategories = [
    { id: 1, name: 'Innovation', description: 'How innovative and unique is this timeline?', currentRating: 4.2, icon: Target },
    { id: 2, name: 'Impact', description: 'What is the positive impact on community?', currentRating: 4.5, icon: TrendingUp },
    { id: 3, name: 'Execution', description: 'Quality of implementation and delivery', currentRating: 3.8, icon: Users },
  ];

  const content = (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
              {timeline.rating}/5
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Current Average Rating</p>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    i < Math.floor(timeline.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="font-semibold text-sm sm:text-base">Rate Different Aspects:</h3>
        
        {ratingCategories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{category.name}</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                  {category.currentRating}/5
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                {category.description}
              </p>
              <div className="flex gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs sm:text-sm touch-manipulation"
                    onClick={() => setSelectedRating(rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 touch-manipulation">
          Cancel
        </Button>
        <Button onClick={() => onOpenChange(false)} className="flex-1 touch-manipulation">
          Submit Rating
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rate Timeline Impact
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Rate Timeline Impact
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};