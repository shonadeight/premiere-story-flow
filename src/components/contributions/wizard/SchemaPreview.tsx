import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Database } from 'lucide-react';
import { SelectedSubtype } from '@/types/contribution';

interface SchemaPreviewProps {
  selectedSubtypes: SelectedSubtype[];
  contributionId?: string;
}

export const SchemaPreview = ({ selectedSubtypes, contributionId }: SchemaPreviewProps) => {
  const [open, setOpen] = useState(false);

  const schema = {
    contribution: {
      id: contributionId || 'pending',
      subtypes: selectedSubtypes.length,
      insights: 'configured',
      valuation: 'set',
      followups: 'scheduled',
      smart_rules: 'active',
      ratings: 'configured',
      files: 'attached',
      knots: 'linked',
      contributors: 'added'
    },
    subtypes_breakdown: selectedSubtypes.map(s => ({
      name: s.displayName,
      category: s.category,
      direction: s.direction,
      config_complete: true
    })),
    timeline_structure: {
      type: 'contribution_timeline',
      parent_id: 'root_timeline',
      child_contributions: selectedSubtypes.length,
      nesting_level: 1
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          View Schema
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Timeline Schema Preview
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-4 pr-4">
            {/* Main Contribution */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Main Contribution</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <code className="bg-muted px-2 py-0.5 rounded">
                    {schema.contribution.id.slice(0, 12)}...
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtypes:</span>
                  <Badge variant="secondary">{schema.contribution.subtypes}</Badge>
                </div>
              </div>
            </Card>

            {/* Configuration Status */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Configuration Status</h3>
              <div className="space-y-2 text-xs">
                {Object.entries(schema.contribution).slice(2).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-muted-foreground capitalize">
                      {key.replace('_', ' ')}:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {String(value)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Subtypes Breakdown */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Subtypes Breakdown</h3>
              <div className="space-y-3">
                {schema.subtypes_breakdown.map((subtype, i) => (
                  <div key={i} className="border-l-2 border-primary pl-3 py-1">
                    <p className="font-medium text-sm">{subtype.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {subtype.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {subtype.direction.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Timeline Structure */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Timeline Structure</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <code className="bg-muted px-2 py-0.5 rounded">
                    {schema.timeline_structure.type}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nesting Level:</span>
                  <Badge variant="secondary">
                    Level {schema.timeline_structure.nesting_level}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Children:</span>
                  <Badge variant="secondary">
                    {schema.timeline_structure.child_contributions}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* JSON View */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Schema (JSON)</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {JSON.stringify(schema, null, 2)}
              </pre>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
