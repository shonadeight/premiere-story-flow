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

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (item: any, e: React.MouseEvent) => {
    if (item.modal) {
      e.preventDefault();
      // Open fullscreen modal on mobile
      if (window.innerWidth < 768) {
        if (item.path === '/create') {
          navigate('/create-modal');
        } else if (item.path === '/assistant') {
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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/portfolio');
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`flex-col h-auto py-2 px-3 gap-1 relative ${
                isActive ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={(e) => handleNavClick(item, e)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
              {item.label === 'Assistant' && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-accent">
                  !
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};