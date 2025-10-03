import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SmartRulesTabViewProps {
  contributionId: string;
}

interface SmartRuleData {
  id: string;
  rule_name: string;
  condition: any;
  action: any;
  enabled: boolean;
  subtype_name: string | null;
  created_at: string;
}

export const SmartRulesTabView = ({ contributionId }: SmartRulesTabViewProps) => {
  const [rules, setRules] = useState<SmartRuleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, [contributionId]);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_smart_rules')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching smart rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (ruleId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('contribution_smart_rules')
        .update({ enabled: !currentState })
        .eq('id', ruleId);

      if (error) throw error;

      setRules(rules.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !currentState } : rule
      ));

      toast.success(`Rule ${!currentState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast.error('Failed to update rule');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No smart rules configured yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <Card key={rule.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <CardTitle className="text-base">{rule.rule_name}</CardTitle>
                {rule.subtype_name && (
                  <Badge variant="outline" className="capitalize">
                    {rule.subtype_name.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => handleToggleRule(rule.id, rule.enabled)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Condition:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {JSON.stringify(rule.condition, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Action:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {JSON.stringify(rule.action, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
