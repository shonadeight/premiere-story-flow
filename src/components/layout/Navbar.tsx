import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { mockUser } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-card/95 backdrop-blur-md sticky top-0 z-50 border-b border-border/50">
      <div className="px-3 h-14 flex items-center justify-between max-w-screen-xl mx-auto">
        {/* App Logo/Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PT</span>
          </div>
          <span className="font-bold text-lg">PrimeTimelines</span>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-accent">
              3
            </Badge>
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-auto p-0">
                <Avatar>
                  <AvatarImage src={mockUser.avatar} />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-2">
                <div className="px-2 py-1.5 border-b">
                  <p className="text-sm font-medium">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ${mockUser.portfolioValue.toLocaleString()} Portfolio
                  </p>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => navigate('/auth')}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};