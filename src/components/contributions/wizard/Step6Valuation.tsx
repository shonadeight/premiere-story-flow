import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CheckCircle2 } from 'lucide-react';
import { ValuationAdder } from '../adders/ValuationAdder';
import { NegotiationAdder } from '../negotiation/NegotiationAdder';
import { SelectedSubtype } from '@/types/contribution';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { getValuationTemplates } from '@/lib/templates/contributionTemplates';

interface Step6ValuationProps {
  selectedSubtypes: SelectedSubtype[];
  contributionId: string;
}

export const Step6Valuation = ({ selectedSubtypes, contributionId }: Step6ValuationProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);
  const [activeSubtype, setActiveSubtype] = useState<SelectedSubtype | null>(null);
  const [valuations, setValuations] = useState<Record<string, any[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadValuations();
  }, [contributionId]);

  const loadValuations = async () => {
    const { data, error } = await supabase
      .from('contribution_valuations')
      .select('*')
      .eq('contribution_id', contributionId);

    if (error) {
      console.error('Error loading valuations:', error);
      return;
    }

    const grouped = (data || []).reduce((acc, val) => {
      const key = `${val.subtype_name}-${val.direction}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(val);
      return acc;
    }, {} as Record<string, any[]>);

    setValuations(grouped);
  };

  const handleEnableTemplate = async (subtype: SelectedSubtype, template: any) => {
    try {
      const { error } = await supabase.from('contribution_valuations').insert({
        contribution_id: contributionId,
        subtype_name: subtype.name,
        direction: subtype.direction,
        valuation_type: template.type,
        amount: template.amount,
        currency: template.currency,
        formula: template.formula,
      });

      if (error) throw error;

      toast({
        title: 'Template enabled',
        description: `Valuation template applied for ${subtype.displayName}`,
      });
      
      loadValuations();
    } catch (error) {
      console.error('Error enabling template:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable template',
        variant: 'destructive',
      });
    }
  };

  const handleSaveValuation = async (valuationData: any) => {
    if (!activeSubtype) return;

    try {
      const { error } = await supabase.from('contribution_valuations').insert({
        contribution_id: contributionId,
        subtype_name: activeSubtype.name,
        direction: activeSubtype.direction,
        ...valuationData,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Valuation saved successfully',
      });
      
      loadValuations();
      setAdderOpen(false);
    } catch (error) {
      console.error('Error saving valuation:', error);
      toast({
        title: 'Error',
        description: 'Failed to save valuation',
        variant: 'destructive',
      });
    }
  };

  const calculateTotal = (direction: 'to_give' | 'to_receive') => {
    return Object.entries(valuations)
      .filter(([key]) => key.endsWith(`-${direction}`))
      .flatMap(([_, vals]) => vals)
      .filter(v => v.valuation_type === 'fixed')
      .reduce((sum, v) => sum + Number(v.amount || 0), 0);
  };

  const renderSubtypeCard = (subtype: SelectedSubtype) => {
    const key = `${subtype.name}-${subtype.direction}`;
    const subtypeValuations = valuations[key] || [];
    const templates = getValuationTemplates(subtype.category, subtype.name);

    return (
      <Card key={key}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{subtype.displayName}</span>
            <Badge variant={subtype.direction === 'to_give' ? 'default' : 'secondary'}>
              {subtype.direction === 'to_give' ? 'To Give' : 'To Receive'}
            </Badge>
          </CardTitle>
          <CardDescription>{subtype.category}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subtypeValuations.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Configured Valuations:</p>
              {subtypeValuations.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    {val.valuation_type === 'fixed' 
                      ? `${val.currency} ${val.amount}` 
                      : val.formula || 'Custom formula'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <>
              {templates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Suggested Templates:</p>
                  {templates.map((template, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">
                        {template.type === 'fixed' 
                          ? `${template.currency} ${template.amount}` 
                          : template.formula}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEnableTemplate(subtype, template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setActiveSubtype(subtype);
                setNegotiationOpen(true);
              }}
            >
              Negotiate
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setActiveSubtype(subtype);
                setAdderOpen(true);
              }}
            >
              Custom
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 min-h-0 flex-1 overflow-y-auto">
      <Alert>
        <DollarSign className="h-4 w-4" />
        <AlertDescription>
          Configure valuations for each selected subtype. Use templates or create custom valuations.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Total Valuation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">To Give:</span>
            <span className="text-lg font-bold">
              ${calculateTotal('to_give').toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">To Receive:</span>
            <span className="text-lg font-bold">
              ${calculateTotal('to_receive').toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {selectedSubtypes.map(subtype => renderSubtypeCard(subtype))}
      </div>

      <ValuationAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveValuation}
        selectedSubtypes={selectedSubtypes}
        direction={activeSubtype?.direction || 'to_give'}
      />

      <NegotiationAdder
        open={negotiationOpen}
        onOpenChange={setNegotiationOpen}
        contributionId={contributionId}
        mode="flexible"
        giverUserId=""
        receiverUserId=""
      />
    </div>
  );
};