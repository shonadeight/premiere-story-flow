import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link2 } from 'lucide-react';

interface KnotsAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (knot: any) => void;
}

export const KnotsAdder = ({ open, onOpenChange, onSave }: KnotsAdderProps) => {
  const isMobile = useIsMobile();
  const [knotType, setKnotType] = useState<'merge' | 'value_sharing' | 'cross_link'>('cross_link');
  const [linkedTimelineId, setLinkedTimelineId] = useState('');

  const handleSave = () => {
    const knot = {
      knot_type: knotType,
      linked_timeline_id: linkedTimelineId || null,
      configuration: { type: knotType }
    };
    onSave(knot);
    setKnotType('cross_link');
    setLinkedTimelineId('');
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Knot Type</Label>
        <Select value={knotType} onValueChange={(v: any) => setKnotType(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cross_link">Cross-Link</SelectItem>
            <SelectItem value="merge">Merge Timeline</SelectItem>
            <SelectItem value="value_sharing">Value Sharing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Linked Timeline ID (optional)</Label>
        <Input
          placeholder="Enter timeline ID to link"
          value={linkedTimelineId}
          onChange={(e) => setLinkedTimelineId(e.target.value)}
        />
      </div>

      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          {knotType === 'cross_link' && 'Link to a related timeline for reference'}
          {knotType === 'merge' && 'Merge this contribution with another timeline'}
          {knotType === 'value_sharing' && 'Share value flows with linked timeline'}
        </p>
      </div>

      <Button onClick={handleSave} className="w-full">
        <Link2 className="mr-2 h-4 w-4" />
        Create Knot
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Link Timeline (Knot)</DrawerTitle>
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
          <DialogTitle>Link Timeline (Knot)</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
