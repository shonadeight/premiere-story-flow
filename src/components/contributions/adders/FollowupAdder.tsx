import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { followupSchema } from '@/lib/validation/contributionSchemas';
import { useToast } from '@/hooks/use-toast';

interface FollowupAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (followup: any) => void;
  direction: 'to_give' | 'to_receive';
}

export const FollowupAdder = ({ open, onOpenChange, onSave, direction }: FollowupAdderProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState<Date>();

  const handleSave = () => {
    try {
      const followup = {
        followup_status: status.trim(),
        notes: notes.trim(),
        due_date: dueDate?.toISOString(),
        direction
      };
      
      const validated = followupSchema.parse(followup);
      onSave(validated);
      setStatus('');
      setNotes('');
      setDueDate(undefined);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Validation Error",
        description: error.message || "Please check your inputs",
        variant: "destructive"
      });
    }
  };

  const content = (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Follow-up Status</Label>
        <Input
          placeholder="e.g., Initial Contact, Follow-up Required"
          value={status}
          onChange={(e) => setStatus(e.target.value.slice(0, 200))}
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">{status.length}/200</p>
      </div>

      <div className="space-y-2">
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          placeholder="Add follow-up notes or instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
          rows={3}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground">{notes.length}/1000</p>
      </div>

      <Button onClick={handleSave} className="w-full">Add Follow-up</Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Follow-up - {direction === 'to_give' ? 'To Give' : 'To Receive'}</DrawerTitle>
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
          <DialogTitle>Add Follow-up - {direction === 'to_give' ? 'To Give' : 'To Receive'}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
