import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';

interface RatingsAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: any) => void;
}

export const RatingsAdder = ({ open, onOpenChange, onSave }: RatingsAdderProps) => {
  const isMobile = useIsMobile();
  const [criteria, setCriteria] = useState('');
  const [maxRating, setMaxRating] = useState([10]);

  const handleSave = () => {
    const config = {
      criteria,
      max_rating: maxRating[0],
      scale_type: '1-10'
    };
    onSave(config);
    setCriteria('');
    setMaxRating([10]);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Rating Criteria</Label>
        <Input
          placeholder="e.g., Timeliness, Quality, Communication"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Maximum Rating: {maxRating[0]}</Label>
        <Slider
          value={maxRating}
          onValueChange={setMaxRating}
          min={5}
          max={10}
          step={1}
        />
      </div>

      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Star className="h-4 w-4" />
          Rating scale will be 1-{maxRating[0]}
        </p>
      </div>

      <Button onClick={handleSave} className="w-full">Save Rating Criteria</Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Configure Rating System</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Rating System</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
