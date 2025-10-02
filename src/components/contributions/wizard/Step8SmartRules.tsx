import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { SmartRulesAdder } from '../adders/SmartRulesAdder';
import { Plus, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step8SmartRulesProps {
  contributionId: string;
}

export const Step8SmartRules = ({ contributionId }: Step8SmartRulesProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [rules, setRules] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSaveRule = async (rule: any) => {
    try {
      const { error } = await supabase
        .from('contribution_smart_rules')
        .insert({
          contribution_id: contributionId,
          rule_name: rule.rule_name,
          condition: rule.condition,
          action: rule.action,
          enabled: rule.enabled,
        });

      if (error) throw error;

      setRules([...rules, rule]);
      toast({
        title: "Success",
        description: "Smart rule created successfully",
      });
    } catch (error) {
      console.error('Error saving smart rule:', error);
      toast({
        title: "Error",
        description: "Failed to save smart rule",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          Create automated rules that execute when specific conditions are met.
        </AlertDescription>
      </Alert>

      <Button onClick={() => setAdderOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Create Smart Rule
      </Button>

      {rules.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No smart rules configured yet
        </p>
      )}

      {rules.map((rule, i) => (
        <Card key={i} className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{rule.rule_name}</p>
              <Badge variant={rule.enabled ? "default" : "secondary"}>
                {rule.enabled ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">
                <span className="font-medium">If:</span> {rule.condition.description}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Then:</span> {rule.action.description}
              </p>
            </div>
          </div>
        </Card>
      ))}

      <SmartRulesAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveRule}
      />
    </div>
  );
};
