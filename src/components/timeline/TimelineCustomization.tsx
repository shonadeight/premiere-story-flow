import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Settings,
  Tag,
  Users,
  FileText,
  Zap,
  Target,
  Plus,
  Trash2,
  Copy,
  Eye,
  Edit,
  Shield
} from 'lucide-react';

export const TimelineCustomization = () => {
  const [customFields, setCustomFields] = useState([
    { id: '1', label: 'Priority Level', type: 'select', options: ['High', 'Medium', 'Low'], required: true },
    { id: '2', label: 'Budget Range', type: 'number', placeholder: 'Enter amount', required: false },
    { id: '3', label: 'Target Market', type: 'text', placeholder: 'Describe target market', required: true }
  ]);

  const [progressSteps, setProgressSteps] = useState([
    { id: '1', name: 'Idea', description: 'Initial concept phase', color: 'blue', active: true },
    { id: '2', name: 'Review', description: 'Evaluation and planning', color: 'yellow', active: false },
    { id: '3', name: 'Execution', description: 'Implementation phase', color: 'orange', active: false },
    { id: '4', name: 'Completion', description: 'Final delivery', color: 'green', active: false }
  ]);

  const [memberRoles, setMemberRoles] = useState([
    { id: '1', name: 'Viewer', permissions: ['view'], color: 'gray' },
    { id: '2', name: 'Contributor', permissions: ['view', 'contribute'], color: 'blue' },
    { id: '3', name: 'Admin', permissions: ['view', 'contribute', 'manage'], color: 'purple' },
    { id: '4', name: 'Investor', permissions: ['view', 'invest', 'outcome-share'], color: 'green' }
  ]);

  const [ratingCriteria, setRatingCriteria] = useState([
    { id: '1', name: 'Innovation', weight: 30, description: 'Uniqueness and creativity' },
    { id: '2', name: 'Feasibility', weight: 25, description: 'Realistic implementation' },
    { id: '3', name: 'Market Potential', weight: 25, description: 'Business opportunity size' },
    { id: '4', name: 'Team Quality', weight: 20, description: 'Team expertise and track record' }
  ]);

  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      placeholder: '',
      required: false
    };
    setCustomFields([...customFields, newField]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Timeline Customization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fields" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="fields">Custom Fields</TabsTrigger>
              <TabsTrigger value="steps">Progress Steps</TabsTrigger>
              <TabsTrigger value="roles">Member Roles</TabsTrigger>
              <TabsTrigger value="ratings">Rating Criteria</TabsTrigger>
              <TabsTrigger value="rules">Timeline Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Custom Input Fields</h4>
                <Button onClick={addCustomField} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-3">
                {customFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <Label className="text-xs">Field Label</Label>
                        <Input 
                          placeholder="Field name"
                          value={field.label}
                          onChange={(e) => {
                            const updated = [...customFields];
                            updated[index].label = e.target.value;
                            setCustomFields(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select value={field.type} onValueChange={(value) => {
                          const updated = [...customFields];
                          updated[index].type = value;
                          setCustomFields(updated);
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Placeholder</Label>
                        <Input 
                          placeholder="Placeholder text"
                          value={field.placeholder || ''}
                          onChange={(e) => {
                            const updated = [...customFields];
                            updated[index].placeholder = e.target.value;
                            setCustomFields(updated);
                          }}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={field.required} 
                            onCheckedChange={(checked) => {
                              const updated = [...customFields];
                              updated[index].required = checked;
                              setCustomFields(updated);
                            }}
                          />
                          <Label className="text-xs">Required</Label>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeCustomField(field.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {field.type === 'select' && (
                      <div>
                        <Label className="text-xs">Options (comma separated)</Label>
                        <Input 
                          placeholder="Option 1, Option 2, Option 3"
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => {
                            const updated = [...customFields];
                            updated[index].options = e.target.value.split(', ').filter(Boolean);
                            setCustomFields(updated);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="steps" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Progress Workflow Steps</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-3">
                {progressSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${step.color}-500`}></div>
                      <div>
                        <div className="font-medium">{step.name}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.active && <Badge variant="default">Active</Badge>}
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="roles" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Member Access Roles</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memberRoles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Shield className={`h-4 w-4 text-${role.color}-500`} />
                        <span className="font-medium">{role.name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {role.permissions.map((permission) => (
                        <div key={permission} className="text-sm flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          <span className="capitalize">{permission.replace('-', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ratings" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Rating & Reputation Criteria</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Criteria
                </Button>
              </div>

              <div className="space-y-3">
                {ratingCriteria.map((criteria) => (
                  <div key={criteria.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{criteria.name}</span>
                        <Badge variant="outline">{criteria.weight}%</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{criteria.description}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Timeline Visibility & Access</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Timeline</Label>
                        <p className="text-sm text-muted-foreground">Anyone can view this timeline</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Investment Enabled</Label>
                        <p className="text-sm text-muted-foreground">Allow external investments</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Outcome Sharing</Label>
                        <p className="text-sm text-muted-foreground">Enable automatic outcome distribution</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Deadlines & Conditions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Project Deadline</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Minimum Investment</Label>
                      <Input type="number" placeholder="1000" />
                    </div>
                    <div>
                      <Label>Maximum Investors</Label>
                      <Input type="number" placeholder="50" />
                    </div>
                    <div>
                      <Label>ROI Target (%)</Label>
                      <Input type="number" placeholder="15" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Agreement Terms</h4>
                  <Textarea 
                    placeholder="Define specific terms, conditions, and legal agreements for this timeline..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Export Template
            </Button>
            <Button>
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};