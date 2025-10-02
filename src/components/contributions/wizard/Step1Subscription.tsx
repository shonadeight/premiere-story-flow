import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Info } from 'lucide-react';

export const Step1Subscription = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Subscription Access Confirmed</h3>
        <p className="text-muted-foreground">
          You have full access to the contribution features.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          If a contribution requires a specific subscription level, you'll be notified before proceeding.
        </AlertDescription>
      </Alert>
    </div>
  );
};