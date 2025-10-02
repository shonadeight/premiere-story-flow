import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Step2TimelineToggleProps {
  isTimeline: boolean;
  setIsTimeline: (value: boolean) => void;
  timelineTitle: string;
  setTimelineTitle: (value: string) => void;
  timelineDescription: string;
  setTimelineDescription: (value: string) => void;
}

export const Step2TimelineToggle = ({
  isTimeline,
  setIsTimeline,
  timelineTitle,
  setTimelineTitle,
  timelineDescription,
  setTimelineDescription
}: Step2TimelineToggleProps) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Choose whether this contribution is a single action or a timeline that can accept sub-contributions.
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2 p-4 border rounded-lg">
        <Switch
          id="timeline-toggle"
          checked={isTimeline}
          onCheckedChange={setIsTimeline}
        />
        <Label htmlFor="timeline-toggle" className="cursor-pointer">
          Contribute as a Timeline
        </Label>
      </div>

      {isTimeline && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div>
            <Label htmlFor="timeline-title">Timeline Title (Optional)</Label>
            <Input
              id="timeline-title"
              placeholder="Enter timeline title..."
              value={timelineTitle}
              onChange={(e) => setTimelineTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="timeline-description">Timeline Description (Optional)</Label>
            <Textarea
              id="timeline-description"
              placeholder="Describe what this timeline is for..."
              value={timelineDescription}
              onChange={(e) => setTimelineDescription(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};