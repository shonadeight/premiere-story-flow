import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  X, 
  DollarSign, 
  Users, 
  Brain, 
  TrendingUp,
  Target,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';

interface CustomizeStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CustomizeStatsModal = ({ open, onOpenChange }: CustomizeStatsModalProps) => {
  const [customTags, setCustomTags] = useState<string[]>(['ROI', 'Growth Rate', 'Risk Score']);
  const [newTag, setNewTag] = useState('');
  
  const defaultStats = [
    { id: 'financial', label: 'Financial Capital', icon: DollarSign, enabled: true },
    { id: 'network', label: 'Network Capital', icon: Users, enabled: true },
    { id: 'intellectual', label: 'Intellectual Capital', icon: Brain, enabled: true },
    { id: 'total-worth', label: 'Total Worth', icon: TrendingUp, enabled: true },
    { id: 'performance', label: 'Performance Score', icon: Award, enabled: true },
    { id: 'accomplished', label: 'Accomplished', icon: Target, enabled: false },
    { id: 'urgent', label: 'Urgent Items', icon: Calendar, enabled: false },
    { id: 'analytics', label: 'Analytics Overview', icon: BarChart3, enabled: false },
  ];

  const [enabledStats, setEnabledStats] = useState(
    defaultStats.reduce((acc, stat) => ({ ...acc, [stat.id]: stat.enabled }), {})
  );

  const addCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeCustomTag = (tag: string) => {
    setCustomTags(customTags.filter(t => t !== tag));
  };

  const toggleStat = (statId: string) => {
    setEnabledStats(prev => ({ ...prev, [statId]: !prev[statId] }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('customStats', JSON.stringify({
      enabledStats,
      customTags
    }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Dashboard Stats</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">Default Stats</TabsTrigger>
            <TabsTrigger value="custom">Custom Tags</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Select which stats to display</h4>
              {defaultStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor={stat.id} className="cursor-pointer">
                        {stat.label}
                      </Label>
                    </div>
                    <Switch
                      id={stat.id}
                      checked={enabledStats[stat.id]}
                      onCheckedChange={() => toggleStat(stat.id)}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Custom Performance Tags</h4>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                />
                <Button onClick={addCustomTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {customTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeCustomTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Layout Options</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Show performance charts</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable real-time updates</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Compact view on mobile</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};