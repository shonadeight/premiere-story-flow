import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, DollarSign, MessageSquare, TrendingUp, Star } from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { useState } from 'react';

interface SubscribeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline: Timeline;
}

export const SubscribeModal = ({ open, onOpenChange, timeline }: SubscribeModalProps) => {
  const [subscriptionType, setSubscriptionType] = useState<'free' | 'premium'>('free');
  const [notifications, setNotifications] = useState({
    milestones: true,
    updates: true,
    trading: false,
    community: true
  });
  const [email, setEmail] = useState('');

  const subscriptionPlans = [
    {
      type: 'free' as const,
      name: 'Free Updates',
      price: '$0/month',
      features: [
        'Basic timeline updates',
        'Milestone notifications',
        'Community access'
      ]
    },
    {
      type: 'premium' as const,
      name: 'Premium Insights',
      price: '$9.99/month',
      features: [
        'Real-time updates',
        'Advanced analytics',
        'Trading notifications',
        'Priority support',
        'Exclusive content'
      ]
    }
  ];

  const handleSubscribe = () => {
    console.log('Subscribing with:', { subscriptionType, notifications, email });
    // Implement subscription logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Subscribe to {timeline.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subscription Plans */}
          <div className="space-y-3">
            <h3 className="font-semibold">Choose Your Plan</h3>
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.type}
                className={`cursor-pointer transition-all ${
                  subscriptionType === plan.type 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSubscriptionType(plan.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        subscriptionType === plan.type
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`} />
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <p className="text-sm text-muted-foreground">{plan.price}</p>
                      </div>
                    </div>
                    {plan.type === 'premium' && (
                      <Badge variant="default">Most Popular</Badge>
                    )}
                  </div>
                  <ul className="space-y-1 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold">Notification Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Label htmlFor="milestones">Milestone achievements</Label>
                </div>
                <Switch
                  id="milestones"
                  checked={notifications.milestones}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, milestones: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="updates">Timeline updates</Label>
                </div>
                <Switch
                  id="updates"
                  checked={notifications.updates}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, updates: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <Label htmlFor="trading">Trading alerts</Label>
                </div>
                <Switch
                  id="trading"
                  checked={notifications.trading}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, trading: checked }))
                  }
                  disabled={subscriptionType === 'free'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <Label htmlFor="community">Community discussions</Label>
                </div>
                <Switch
                  id="community"
                  checked={notifications.community}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, community: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSubscribe}
              disabled={!email}
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};