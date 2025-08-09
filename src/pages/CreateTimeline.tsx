import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTimelineDrawer } from '@/components/timeline/CreateTimelineDrawer';
import { Plus } from 'lucide-react';

export const CreateTimeline = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create New Timeline</CardTitle>
            <p className="text-muted-foreground">
              Start building your timeline to track contributions, investments, and outcomes
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={() => setDrawerOpen(true)}
                size="lg"
                className="h-20 flex flex-col gap-2"
              >
                <Plus className="h-6 w-6" />
                <span>Create Timeline</span>
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Choose from project, financial, intellectual, network, or asset contribution timelines</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <CreateTimelineDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
};