import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'investment' | 'opportunity' | 'outcome' | 'message' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  data?: any;
}

export const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'High-Potential Investment Match',
      description: 'AI Startup "NeuralEdge" matches your investment criteria. 92% compatibility score.',
      timestamp: '2024-08-01T09:30:00Z',
      read: false,
      actionUrl: '/timeline/new-opportunity',
      priority: 'high',
      data: { value: 45000, roi: 28 }
    },
    {
      id: '2',
      type: 'outcome',
      title: 'Timeline Outcome Shared',
      description: 'Sarah Chen Partnership generated $2,400 in shared revenue from AI SaaS Platform.',
      timestamp: '2024-08-01T08:15:00Z',
      read: false,
      actionUrl: '/timeline/2',
      priority: 'medium',
      data: { amount: 2400, timeline: 'Sarah Chen Partnership' }
    },
    {
      id: '3',
      type: 'investment',
      title: 'Investment Proposal Received',
      description: 'Michael Rodriguez wants to invest $8,000 in your Mobile App Development timeline.',
      timestamp: '2024-07-31T16:45:00Z',
      read: true,
      actionUrl: '/timeline/3',
      priority: 'high',
      data: { amount: 8000, investor: 'Michael Rodriguez' }
    },
    {
      id: '4',
      type: 'system',
      title: 'AI Analysis Complete',
      description: 'Portfolio optimization suggestions are ready. Potential 15% return increase identified.',
      timestamp: '2024-07-31T14:20:00Z',
      read: false,
      actionUrl: '/assistant',
      priority: 'medium',
      data: { optimization: '15% increase' }
    },
    {
      id: '5',
      type: 'message',
      title: 'New Chat Message',
      description: 'Sarah Chen sent a message about the ML model performance metrics.',
      timestamp: '2024-07-31T12:30:00Z',
      read: true,
      actionUrl: '/assistant',
      priority: 'low'
    },
    {
      id: '6',
      type: 'opportunity',
      title: 'Market Trend Alert',
      description: 'AI sector showing 23% growth. Consider increasing AI timeline allocations.',
      timestamp: '2024-07-30T10:15:00Z',
      read: true,
      actionUrl: '/portfolio',
      priority: 'medium',
      data: { sector: 'AI', growth: 23 }
    }
  ];

  const filteredNotifications = mockNotifications.filter(n => 
    filter === 'all' || (filter === 'unread' && !n.read)
  );

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'investment': return DollarSign;
      case 'opportunity': return Target;
      case 'outcome': return TrendingUp;
      case 'message': return MessageSquare;
      case 'system': return Zap;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Stay updated with AI recommendations and timeline activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </div>

      {/* AI Insights Summary */}
      <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Insights Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold">3 New Opportunities</div>
              <div className="text-sm text-muted-foreground">High match potential</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="font-semibold">$3,600 Outcomes</div>
              <div className="text-sm text-muted-foreground">This week</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
              <div className="font-semibold">2 Action Items</div>
              <div className="text-sm text-muted-foreground">Require attention</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Filters */}
      <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All ({mockNotifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={filter} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-medium mb-2">No notifications</h4>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <Card 
                    key={notification.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      !notification.read ? 'border-primary/40 bg-primary/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'investment' ? 'bg-primary/10' :
                          notification.type === 'opportunity' ? 'bg-accent/10' :
                          notification.type === 'outcome' ? 'bg-success/10' :
                          notification.type === 'message' ? 'bg-blue-500/10' :
                          'bg-muted'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            notification.type === 'investment' ? 'text-primary' :
                            notification.type === 'opportunity' ? 'text-accent' :
                            notification.type === 'outcome' ? 'text-success' :
                            notification.type === 'message' ? 'text-blue-500' :
                            'text-muted-foreground'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.description}
                          </p>
                          
                          {/* Data Display */}
                          {notification.data && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {notification.data.value && (
                                <Badge variant="secondary" className="text-xs">
                                  ${notification.data.value.toLocaleString()}
                                </Badge>
                              )}
                              {notification.data.amount && (
                                <Badge variant="secondary" className="text-xs">
                                  ${notification.data.amount.toLocaleString()}
                                </Badge>
                              )}
                              {notification.data.roi && (
                                <Badge variant="secondary" className="text-xs">
                                  {notification.data.roi}% ROI
                                </Badge>
                              )}
                              {notification.data.growth && (
                                <Badge variant="secondary" className="text-xs">
                                  +{notification.data.growth}% growth
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                            </div>
                            {notification.actionUrl && (
                              <Button variant="ghost" size="sm">
                                View Details
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};