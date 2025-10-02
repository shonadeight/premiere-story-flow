import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Plus, 
  MessageSquare, 
  Bell, 
  User, 
  Brain,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContributionWizard } from '@/components/contributions/ContributionWizard';
import { supabase } from '@/integrations/supabase/client';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contributionWizardOpen, setContributionWizardOpen] = useState(false);
  const [defaultTimelineId, setDefaultTimelineId] = useState<string>('');

  useEffect(() => {
    loadDefaultTimeline();
  }, []);

  const loadDefaultTimeline = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: timelines } = await supabase
        .from('timelines')
        .select('id')
        .eq('user_id', user.id)
        .eq('timeline_type', 'personal')
        .limit(1)
        .maybeSingle();

      if (timelines) {
        setDefaultTimelineId(timelines.id);
      }
    } catch (error) {
      console.error('Error loading timeline:', error);
    }
  };

  const handleNavClick = (item: any, e: React.MouseEvent) => {
    if (item.path === '/create') {
      e.preventDefault();
      setContributionWizardOpen(true);
      return;
    }
    
    if (item.modal) {
      e.preventDefault();
      // Open fullscreen modal on mobile
      if (window.innerWidth < 768) {
        if (item.path === '/assistant') {
          navigate('/assistant-modal');
        }
      } else {
        navigate(item.path);
      }
    } else {
      navigate(item.path);
    }
  };

  const navItems = [
    { icon: TrendingUp, label: 'Portfolio', path: '/', modal: false },
    { icon: Plus, label: 'Create', path: '/create', modal: true },
    { icon: MessageSquare, label: 'Assistant', path: '/assistant', modal: true },
    { icon: Wallet, label: 'Wallet', path: '/wallet', modal: false },
    { icon: User, label: 'Profile', path: '/profile', modal: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-md border-t border-border/50 z-50 lg:hidden">
      <div className="flex items-center justify-around px-1 py-1 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/portfolio');
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex-col h-auto py-2 px-2 gap-0.5 relative transition-all duration-200 min-h-[44px] ${
                isActive 
                  ? 'text-primary bg-primary/5 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              onClick={(e) => handleNavClick(item, e)}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
              {item.label === 'Assistant' && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-accent">
                  !
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      <ContributionWizard
        open={contributionWizardOpen}
        onOpenChange={setContributionWizardOpen}
        timelineId={defaultTimelineId}
      />
    </nav>
  );
};