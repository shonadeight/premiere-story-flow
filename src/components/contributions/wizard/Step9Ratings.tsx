import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RatingsAdder } from '../adders/RatingsAdder';
import { Plus, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Step9RatingsProps {
  contributionId: string;
}

export const Step9Ratings = ({ contributionId }: Step9RatingsProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [ratingConfigs, setRatingConfigs] = useState<any[]>([]);

  const handleSaveConfig = (config: any) => {
    setRatingConfigs([...ratingConfigs, config]);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Star className="h-4 w-4" />
        <AlertDescription>
          Configure custom rating criteria to evaluate contribution quality and performance.
        </AlertDescription>
      </Alert>

      <Button onClick={() => setAdderOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Rating Criteria
      </Button>

      {ratingConfigs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No rating criteria configured yet
        </p>
      )}

      {ratingConfigs.map((config, i) => (
        <Card key={i} className="p-3">
          <div className="space-y-1">
            <p className="font-medium">{config.criteria}</p>
            <p className="text-sm text-muted-foreground">
              Scale: {config.scale_type} (Max: {config.max_rating})
            </p>
          </div>
        </Card>
      ))}

      <RatingsAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveConfig}
      />
    </div>
  );
};
