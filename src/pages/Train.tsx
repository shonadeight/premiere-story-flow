import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Database, 
  FileText, 
  BarChart3, 
  Table, 
  List, 
  MessageSquare,
  Plus,
  Trash2,
  Save,
  Play,
  AlertCircle
} from 'lucide-react';

interface Intent {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  response: string;
  outputType: 'text' | 'table' | 'chart' | 'cards' | 'list';
  queries: string[];
}

export const Train = () => {
  const [intents, setIntents] = useState<Intent[]>([
    {
      id: '1',
      name: 'Portfolio Summary',
      description: 'Get comprehensive portfolio overview',
      triggers: ['portfolio', 'overview', 'summary'],
      response: 'I\'ll analyze your portfolio performance and provide insights.',
      outputType: 'cards',
      queries: ['SELECT * FROM timelines WHERE user_id = ?', 'SELECT SUM(value) FROM investments']
    },
    {
      id: '2',
      name: 'Performance Analytics',
      description: 'Analyze timeline performance metrics',
      triggers: ['performance', 'analytics', 'metrics'],
      response: 'Here\'s your detailed performance analysis.',
      outputType: 'chart',
      queries: ['SELECT * FROM performance_data WHERE timeline_id = ?']
    }
  ]);

  const [newIntent, setNewIntent] = useState<Partial<Intent>>({
    name: '',
    description: '',
    triggers: [],
    response: '',
    outputType: 'text',
    queries: []
  });

  const [newTrigger, setNewTrigger] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState('');

  const handleAddTrigger = () => {
    if (newTrigger.trim()) {
      setNewIntent(prev => ({
        ...prev,
        triggers: [...(prev.triggers || []), newTrigger.trim()]
      }));
      setNewTrigger('');
    }
  };

  const handleAddQuery = () => {
    if (newQuery.trim()) {
      setNewIntent(prev => ({
        ...prev,
        queries: [...(prev.queries || []), newQuery.trim()]
      }));
      setNewQuery('');
    }
  };

  const handleSaveIntent = () => {
    if (newIntent.name && newIntent.description) {
      const intent: Intent = {
        id: Date.now().toString(),
        name: newIntent.name,
        description: newIntent.description,
        triggers: newIntent.triggers || [],
        response: newIntent.response || '',
        outputType: newIntent.outputType || 'text',
        queries: newIntent.queries || []
      };
      
      setIntents(prev => [...prev, intent]);
      setNewIntent({
        name: '',
        description: '',
        triggers: [],
        response: '',
        outputType: 'text',
        queries: []
      });
    }
  };

  const handleDeleteIntent = (id: string) => {
    setIntents(prev => prev.filter(intent => intent.id !== id));
  };

  const handleTestQuery = () => {
    // Simulate query testing
    setTestResult(`Simulated result for: "${testQuery}"\n\nThis would connect to your Supabase database and return actual results.`);
  };

  const outputTypeIcons = {
    text: MessageSquare,
    table: Table,
    chart: BarChart3,
    cards: FileText,
    list: List
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Training Center
          </h1>
          <p className="text-muted-foreground">
            Train your assistant to understand intents and query your data effectively
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            To enable AI training and database queries, you need to connect to Supabase first. 
            Click the green Supabase button in the top right to activate the integration.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="intents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="intents">Intent Management</TabsTrigger>
            <TabsTrigger value="queries">Database Queries</TabsTrigger>
            <TabsTrigger value="testing">Test & Debug</TabsTrigger>
          </TabsList>

          <TabsContent value="intents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Intent */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Intent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Intent Name</label>
                    <Input
                      placeholder="e.g., Portfolio Analysis"
                      value={newIntent.name}
                      onChange={(e) => setNewIntent(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="What this intent does..."
                      value={newIntent.description}
                      onChange={(e) => setNewIntent(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Trigger Words</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add trigger word"
                        value={newTrigger}
                        onChange={(e) => setNewTrigger(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTrigger()}
                      />
                      <Button onClick={handleAddTrigger} variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newIntent.triggers?.map((trigger, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {trigger}
                          <button
                            onClick={() => setNewIntent(prev => ({
                              ...prev,
                              triggers: prev.triggers?.filter((_, i) => i !== index)
                            }))}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Response Template</label>
                    <Textarea
                      placeholder="How the AI should respond..."
                      value={newIntent.response}
                      onChange={(e) => setNewIntent(prev => ({ ...prev, response: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Output Type</label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {Object.entries(outputTypeIcons).map(([type, Icon]) => (
                        <Button
                          key={type}
                          variant={newIntent.outputType === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewIntent(prev => ({ ...prev, outputType: type as any }))}
                          className="flex flex-col h-auto py-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs capitalize">{type}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSaveIntent} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Intent
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Intents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Existing Intents</h3>
                {intents.map((intent) => {
                  const Icon = outputTypeIcons[intent.outputType];
                  return (
                    <Card key={intent.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{intent.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteIntent(intent.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{intent.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {intent.triggers.map((trigger, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {intent.queries.length} database queries configured
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Queries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Add New Query</label>
                    <Textarea
                      placeholder="SELECT * FROM timelines WHERE..."
                      value={newQuery}
                      onChange={(e) => setNewQuery(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <Button onClick={handleAddQuery} className="mt-2 w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Query
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Configured Queries</label>
                    <div className="space-y-2 mt-2">
                      {newIntent.queries?.map((query, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <code className="text-xs text-muted-foreground">{query}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setNewIntent(prev => ({
                              ...prev,
                              queries: prev.queries?.filter((_, i) => i !== index)
                            }))}
                            className="float-right"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Query Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Portfolio Data:</strong>
                      <code className="block mt-1 p-2 bg-muted rounded text-xs">
                        SELECT * FROM timelines WHERE user_id = $1
                      </code>
                    </div>
                    <div>
                      <strong>Performance Metrics:</strong>
                      <code className="block mt-1 p-2 bg-muted rounded text-xs">
                        SELECT AVG(roi), SUM(value) FROM investments
                      </code>
                    </div>
                    <div>
                      <strong>Timeline Analytics:</strong>
                      <code className="block mt-1 p-2 bg-muted rounded text-xs">
                        SELECT type, COUNT(*) FROM timelines GROUP BY type
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Test Query
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Test Query</label>
                  <Textarea
                    placeholder="Enter a query to test..."
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    className="font-mono"
                  />
                  <Button onClick={handleTestQuery} className="mt-2">
                    <Play className="h-4 w-4 mr-2" />
                    Run Test
                  </Button>
                </div>

                {testResult && (
                  <div>
                    <label className="text-sm font-medium">Result</label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
