import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  TrendingUp, 
  Users, 
  Star, 
  GitBranch,
  DollarSign,
  Target,
  BarChart3,
  Share,
  Settings,
  Paperclip,
  Play,
  Eye,
  Share2,
  Plus
} from 'lucide-react';
import { mockTimelines, mockChatMessages, mockContributions, mockOutcomes, mockUser } from '@/data/mockData';
import { InvestmentModal } from '@/components/timeline/InvestmentModal';
import { FileAttachments } from '@/components/timeline/FileAttachments';
import { MatchingSystem } from '@/components/timeline/MatchingSystem';
import { OutcomeSharing } from '@/components/outcome/OutcomeSharing';
import { CapitalFlow } from '@/components/timeline/CapitalFlow';
import { FinancialTransactions } from '@/components/timeline/FinancialTransactions';
import { TimelineCustomization } from '@/components/timeline/TimelineCustomization';

export const TimelineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockChatMessages);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  const timeline = mockTimelines.find(t => t.id === id);

  if (!timeline) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Timeline Not Found</h1>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: `I've analyzed your query about "${timeline.title}". Based on current data, this timeline shows strong performance with ${timeline.changePercent}% growth. Would you like me to provide specific recommendations for optimizing returns?`,
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: timeline.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{timeline.title}</h1>
            <Badge variant="outline" className="capitalize">{timeline.type}</Badge>
            <Badge variant={timeline.status === 'active' ? 'default' : 'secondary'}>
              {timeline.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{timeline.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{formatCurrency(timeline.value)}</div>
                <div className="text-sm text-muted-foreground">Current Value</div>
                <div className={`text-sm flex items-center justify-center gap-1 mt-1 ${
                  timeline.change >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {timeline.changePercent > 0 ? '+' : ''}{timeline.changePercent}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{timeline.subtimelines}</div>
                <div className="text-sm text-muted-foreground">Sub-timelines</div>
                <div className="text-sm text-primary mt-1">
                  <GitBranch className="h-3 w-3 inline mr-1" />
                  Active
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{timeline.rating}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
                <div className="text-sm text-accent mt-1">
                  <Star className="h-3 w-3 inline mr-1 fill-current" />
                  Top tier
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{timeline.investedMembers}</div>
                <div className="text-sm text-muted-foreground">Investors</div>
                <div className="text-sm text-primary mt-1">
                  <Users className="h-3 w-3 inline mr-1" />
                  Growing
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-7 overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subtimelines">Sub-timelines</TabsTrigger>
              <TabsTrigger value="capital">Capital Flow</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="matching">Matching</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <h4 className="font-medium mb-2">Progress Status</h4>
                        <div className="text-2xl font-bold text-primary">{timeline.status}</div>
                        <div className="text-sm text-muted-foreground">Current Phase</div>
                      </div>
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <h4 className="font-medium mb-2">Performance</h4>
                        <div className="text-2xl font-bold text-success">+{timeline.changePercent}%</div>
                        <div className="text-sm text-muted-foreground">Overall Growth</div>
                      </div>
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <h4 className="font-medium mb-2">Members</h4>
                        <div className="text-2xl font-bold text-primary">{timeline.investedMembers}</div>
                        <div className="text-sm text-muted-foreground">Active Contributors</div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{timeline.description}</p>
                    </div>
                    
                    {timeline.tags && (
                      <div>
                        <h4 className="font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {timeline.tags.map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subtimelines" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Sub-timelines ({timeline.subtimelines})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">🔗</div>
                          <div>
                            <div className="font-medium">Sub-timeline {i}</div>
                            <div className="text-sm text-muted-foreground">Connected project component</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Active</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Sub-timeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="capital">
              <CapitalFlow />
            </TabsContent>

            <TabsContent value="transactions">
              <FinancialTransactions />
            </TabsContent>

            <TabsContent value="customize">
              <TimelineCustomization />
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <FileAttachments 
                attachments={timeline.attachments}
                recordings={timeline.recordings}
              />
            </TabsContent>

            <TabsContent value="matching" className="space-y-4">
              <MatchingSystem currentTimeline={timeline} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investment Panel */}
          {timeline.invested ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-success">Investment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Invested Amount:</span>
                    <span className="font-semibold">{formatCurrency(timeline.investedAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Current Value:</span>
                    <span className="font-semibold">{formatCurrency(timeline.value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Returns:</span>
                    <span className="font-semibold text-success">
                      +{formatCurrency(timeline.change)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm">ROI:</span>
                    <span className="font-semibold text-success">
                      {timeline.changePercent}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Increase Investment
                  </Button>
                  <Button variant="outline" className="w-full">
                    Withdraw Profits
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Investment Opportunity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Valuation:</span>
                    <span className="font-semibold">{formatCurrency(timeline.value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Min Investment:</span>
                    <span className="font-semibold">$1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expected ROI:</span>
                    <span className="font-semibold text-success">15-25%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    onClick={() => setShowInvestmentModal(true)}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Invest Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <GitBranch className="h-4 w-4 mr-2" />
                View Sub-timelines
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Paperclip className="h-4 w-4 mr-2" />
                Add Attachment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                Share Timeline
              </Button>
            </CardContent>
          </Card>

          {/* Related Timelines */}
          <Card>
            <CardHeader>
              <CardTitle>Related Timelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTimelines.slice(0, 3).map((related) => (
                <div 
                  key={related.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => navigate(`/timeline/${related.id}`)}
                >
                  <div className="text-lg">{related.type === 'project' ? '🚀' : '👤'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{related.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(related.value)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Investment Modal */}
      <InvestmentModal 
        timeline={timeline}
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
      />
    </div>
  );
};