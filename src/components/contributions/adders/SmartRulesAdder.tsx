import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Switch } from '@/components/ui/switch';
import { Zap } from 'lucide-react';

interface SmartRulesAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rule: any) => void;
}

export const SmartRulesAdder = ({ open, onOpenChange, onSave }: SmartRulesAdderProps) => {
  const isMobile = useIsMobile();
  const [ruleName, setRuleName] = useState('');
  const [condition, setCondition] = useState('');
  const [action, setAction] = useState('');
  const [enabled, setEnabled] = useState(true);

  const handleSave = () => {
    const rule = {
      rule_name: ruleName,
      condition: { description: condition },
      action: { description: action },
      enabled
    };
    onSave(rule);
    setRuleName('');
    setCondition('');
    setAction('');
    setEnabled(true);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Rule Name</Label>
        <Input
          placeholder="e.g., Auto-accept verified givers"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Condition (When)</Label>
        <Textarea
          placeholder="e.g., If giver is verified and files are present"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Action (Then)</Label>
        <Textarea
          placeholder="e.g., Auto-accept the contribution"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Enable Rule</Label>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <Button onClick={handleSave} className="w-full">
        <Zap className="mr-2 h-4 w-4" />
        Create Smart Rule
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create Smart Rule</DrawerTitle>
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
          <DialogTitle>Create Smart Rule</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
