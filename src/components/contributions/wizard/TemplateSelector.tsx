import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { ContributionTemplate, getTemplatesByCategory } from '@/lib/templates/contributionTemplates';
import { ContributionCategory } from '@/types/contribution';
import { Sparkles, Check } from 'lucide-react';

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ContributionCategory;
  onSelectTemplate: (template: ContributionTemplate) => void;
}

export const TemplateSelector = ({ 
  open, 
  onOpenChange, 
  category,
  onSelectTemplate 
}: TemplateSelectorProps) => {
  const isMobile = useIsMobile();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const templates = getTemplatesByCategory(category);

  const handleSelect = (template: ContributionTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Choose a template to pre-configure your contribution</span>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selectedTemplate === template.id ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleSelect(template)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                  {selectedTemplate === template.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                  {template.presets.valuation && (
                    <Badge variant="outline" className="text-xs">
                      Valuation ✓
                    </Badge>
                  )}
                  {template.presets.followups && template.presets.followups.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {template.presets.followups.length} Follow-ups
                    </Badge>
                  )}
                  {template.presets.files && template.presets.files.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {template.presets.files.length} Files
                    </Badge>
                  )}
                  {template.presets.smartRules && template.presets.smartRules.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Smart Rules ✓
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No templates available for this category yet.</p>
              <p className="text-sm mt-2">Start from scratch or create a custom template.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
        Start from Scratch
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Choose a Template</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
