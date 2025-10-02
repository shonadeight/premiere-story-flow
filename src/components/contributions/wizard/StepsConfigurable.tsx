import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { SelectedSubtype, ContributionDirection, CONTRIBUTION_STEPS } from '@/types/contribution';

interface StepsConfigurableProps {
  currentStep: number;
  selectedSubtypes: SelectedSubtype[];
  currentTab: ContributionDirection;
  setCurrentTab: (tab: ContributionDirection) => void;
}

export const StepsConfigurable = ({
  currentStep,
  selectedSubtypes,
  currentTab,
  setCurrentTab
}: StepsConfigurableProps) => {
  const stepInfo = CONTRIBUTION_STEPS.find(s => s.number === currentStep);

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure {stepInfo?.name.toLowerCase()} for your selected contribution types. You can skip this step and configure it later.
        </AlertDescription>
      </Alert>

      <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as ContributionDirection)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="to_give">To Give</TabsTrigger>
          <TabsTrigger value="to_receive">To Receive</TabsTrigger>
        </TabsList>

        <TabsContent value="to_give" className="space-y-4 mt-6">
          <div className="p-8 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">
              Configuration options for <strong>{stepInfo?.name}</strong> will appear here.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This section is under development.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="to_receive" className="space-y-4 mt-6">
          <div className="p-8 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">
              Configuration options for <strong>{stepInfo?.name}</strong> will appear here.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This section is under development.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};