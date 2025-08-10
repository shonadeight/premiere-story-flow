import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings,
  Users,
  Shield,
  Star,
  DollarSign,
  FileText,
  Calendar,
  Eye,
  Lock,
  Plus,
  X,
  Edit,
  Save
} from 'lucide-react';
import { Timeline, ContributionType } from '@/types/timeline';

interface TimelineEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline: Timeline;
  onSave: (updatedTimeline: Timeline) => void;
}

export const TimelineEditModal: React.FC<TimelineEditModalProps> = ({
  open,
  onOpenChange,
  timeline,
  onSave,
}) => {
  const [editedTimeline, setEditedTimeline] = useState<Timeline>(timeline);
  const [activeTab, setActiveTab] = useState('basic');
  const [customFields, setCustomFields] = useState<Array<{
    id: string;
    name: string;
    type: 'text' | 'number' | 'email' | 'date' | 'select';
    required: boolean;
    options?: string[];
  }>>([]);
  const [progressSteps, setProgressSteps] = useState<Array<{
    id: string;
    name: string;
    description: string;
    order: number;
  }>>([]);
  const [ratingCriteria, setRatingCriteria] = useState<Array<{
    id: string;
    name: string;
    weight: number;
    description: string;
  }>>([]);

  useEffect(() => {
    setEditedTimeline(timeline);
  }, [timeline]);

  const handleBasicInfoChange = (field: keyof Timeline, value: any) => {
    setEditedTimeline(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const updatedTimeline = {
      ...editedTimeline,
      customFields,
      progressSteps,
      ratingCriteria,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedTimeline);
    onOpenChange(false);
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      name: '',
      type: 'text' as const,
      required: false
    };
    setCustomFields(prev => [...prev, newField]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const updateCustomField = (id: string, updates: Partial<typeof customFields[0]>) => {
    setCustomFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const addProgressStep = () => {
    const newStep = {
      id: Date.now().toString(),
      name: '',
      description: '',
      order: progressSteps.length + 1
    };
    setProgressSteps(prev => [...prev, newStep]);
  };

  const addRatingCriterion = () => {
    const newCriterion = {
      id: Date.now().toString(),
      name: '',
      weight: 1,
      description: ''
    };
    setRatingCriteria(prev => [...prev, newCriterion]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Timeline: {timeline.title}
          </DialogTitle>
          <DialogDescription>
            Customize your timeline settings, contribution forms, and rules
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="access" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Access
            </TabsTrigger>
            <TabsTrigger value="rating" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Rating
            </TabsTrigger>
            <TabsTrigger value="rules" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Rules
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={editedTimeline.title}
                        onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={editedTimeline.type}
                        onValueChange={(value) => handleBasicInfoChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project">Project Timeline</SelectItem>
                          <SelectItem value="profile">Profile Timeline</SelectItem>
                          <SelectItem value="financial">Financial Contribution</SelectItem>
                          <SelectItem value="followup">Follow-up Timeline</SelectItem>
                          <SelectItem value="intellectual">Intellectual Contribution</SelectItem>
                          <SelectItem value="network">Network & Marketing</SelectItem>
                          <SelectItem value="assets">Assets Contribution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedTimeline.description}
                      onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={editedTimeline.startDate?.split('T')[0] || ''}
                        onChange={(e) => handleBasicInfoChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={editedTimeline.endDate?.split('T')[0] || ''}
                        onChange={(e) => handleBasicInfoChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Visibility</Label>
                    <Select
                      value={editedTimeline.visibility}
                      onValueChange={(value) => handleBasicInfoChange('visibility', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Public - Anyone can view
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Private - Only you can view
                          </div>
                        </SelectItem>
                        <SelectItem value="invite-only">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Invite Only - Selected members only
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forms" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Custom Contribution Fields</CardTitle>
                    <Button onClick={addCustomField} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {customFields.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No custom fields defined. Add fields to collect specific data from contributors.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customFields.map((field) => (
                        <div key={field.id} className="p-4 border rounded-lg">
                          <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-4">
                              <Label>Field Name</Label>
                              <Input
                                value={field.name}
                                onChange={(e) => updateCustomField(field.id, { name: e.target.value })}
                                placeholder="e.g., Experience Level"
                              />
                            </div>
                            <div className="col-span-3">
                              <Label>Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value) => updateCustomField(field.id, { type: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="select">Select</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                              <Switch
                                checked={field.required}
                                onCheckedChange={(checked) => updateCustomField(field.id, { required: checked })}
                              />
                              <Label className="text-sm">Required</Label>
                            </div>
                            <div className="col-span-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeCustomField(field.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Custom Progress Steps</CardTitle>
                    <Button onClick={addProgressStep} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {progressSteps.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No custom progress steps defined. Add steps to track timeline progress.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {progressSteps.map((step, index) => (
                        <div key={step.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 space-y-2">
                              <Input
                                value={step.name}
                                onChange={(e) => setProgressSteps(prev => 
                                  prev.map(s => s.id === step.id ? { ...s, name: e.target.value } : s)
                                )}
                                placeholder="Step name"
                              />
                              <Textarea
                                value={step.description}
                                onChange={(e) => setProgressSteps(prev => 
                                  prev.map(s => s.id === step.id ? { ...s, description: e.target.value } : s)
                                )}
                                placeholder="Step description"
                                rows={2}
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setProgressSteps(prev => prev.filter(s => s.id !== step.id))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Access & Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Timeline Administrators</Label>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Admin
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Collaboration Settings</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow subtimelines</span>
                        <Switch
                          checked={editedTimeline.allowSubtimelines}
                          onCheckedChange={(checked) => handleBasicInfoChange('allowSubtimelines', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Require approval for contributions</span>
                        <Switch
                          checked={editedTimeline.governance.approvalRequired}
                          onCheckedChange={(checked) => handleBasicInfoChange('governance', {
                            ...editedTimeline.governance,
                            approvalRequired: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enable KYC verification</span>
                        <Switch
                          checked={editedTimeline.governance.kycRequired || false}
                          onCheckedChange={(checked) => handleBasicInfoChange('governance', {
                            ...editedTimeline.governance,
                            kycRequired: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rating" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Rating Criteria</CardTitle>
                    <Button onClick={addRatingCriterion} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Criterion
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {ratingCriteria.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No rating criteria defined. Add criteria to help members rate this timeline.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ratingCriteria.map((criterion) => (
                        <div key={criterion.id} className="p-4 border rounded-lg">
                          <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-5">
                              <Label>Criterion Name</Label>
                              <Input
                                value={criterion.name}
                                onChange={(e) => setRatingCriteria(prev => 
                                  prev.map(c => c.id === criterion.id ? { ...c, name: e.target.value } : c)
                                )}
                                placeholder="e.g., Quality of deliverables"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Weight</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={criterion.weight}
                                onChange={(e) => setRatingCriteria(prev => 
                                  prev.map(c => c.id === criterion.id ? { ...c, weight: parseInt(e.target.value) } : c)
                                )}
                              />
                            </div>
                            <div className="col-span-4">
                              <Label>Description</Label>
                              <Input
                                value={criterion.description}
                                onChange={(e) => setRatingCriteria(prev => 
                                  prev.map(c => c.id === criterion.id ? { ...c, description: e.target.value } : c)
                                )}
                                placeholder="What this criterion measures"
                              />
                            </div>
                            <div className="col-span-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setRatingCriteria(prev => prev.filter(c => c.id !== criterion.id))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="terms">Terms and Conditions</Label>
                    <Textarea
                      id="terms"
                      placeholder="Define the terms and conditions for this timeline..."
                      rows={5}
                    />
                  </div>
                  
                  <div>
                    <Label>Capital Share Flow Rules</Label>
                    <div className="space-y-3 mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="distributionModel">Distribution Model</Label>
                          <Select
                            value={editedTimeline.distributionModel}
                            onValueChange={(value) => handleBasicInfoChange('distributionModel', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pro-rata">Pro-rata (by contribution)</SelectItem>
                              <SelectItem value="tiered">Tiered (performance-based)</SelectItem>
                              <SelectItem value="milestone">Milestone-based</SelectItem>
                              <SelectItem value="custom">Custom formula</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="baseUnit">Base Unit</Label>
                          <Select
                            value={editedTimeline.baseUnit}
                            onValueChange={(value) => handleBasicInfoChange('baseUnit', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="token">Token</SelectItem>
                              <SelectItem value="credits">Credits</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};