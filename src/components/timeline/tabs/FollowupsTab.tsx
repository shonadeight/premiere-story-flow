import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  Phone,
  Mail,
  Video,
  Users
} from 'lucide-react';

interface FollowupItem {
  id: string;
  title: string;
  type: 'call' | 'email' | 'meeting' | 'check-in';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  assignee: string;
  progress: number;
  notes?: string;
}

export const FollowupsTab = () => {
  const isMobile = useIsMobile();
  const [selectedFollowup, setSelectedFollowup] = useState<FollowupItem | null>(null);

  const mockFollowups: FollowupItem[] = [
    {
      id: '1',
      title: 'Client Onboarding Call',
      type: 'call',
      status: 'pending',
      dueDate: '2024-12-15',
      assignee: 'John Doe',
      progress: 0,
      notes: 'Initial consultation and requirements gathering'
    },
    {
      id: '2',
      title: 'Project Status Update',
      type: 'email',
      status: 'in-progress',
      dueDate: '2024-12-10',
      assignee: 'Jane Smith',
      progress: 60,
      notes: 'Weekly progress report to stakeholders'
    },
    {
      id: '3',
      title: 'Quarterly Review Meeting',
      type: 'meeting',
      status: 'completed',
      dueDate: '2024-12-05',
      assignee: 'Mike Johnson',
      progress: 100,
      notes: 'Completed with positive feedback'
    },
    {
      id: '4',
      title: 'Follow-up Check-in',
      type: 'check-in',
      status: 'overdue',
      dueDate: '2024-12-01',
      assignee: 'Sarah Wilson',
      progress: 25,
      notes: 'Needs immediate attention'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'check-in': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'in-progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'overdue': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-orange-500/10 text-orange-600 border-orange-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const FollowupDetail = ({ followup }: { followup: FollowupItem }) => (
    <div className="space-y-4 p-1">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(followup.type)}
            <h3 className="font-medium">{followup.title}</h3>
          </div>
          <Badge className={getStatusColor(followup.status)} variant="outline">
            {getStatusIcon(followup.status)}
            <span className="ml-1 capitalize">{followup.status}</span>
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{followup.progress}%</span>
          </div>
          <Progress value={followup.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Due Date:</span>
            <div className="font-medium">{followup.dueDate}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Assignee:</span>
            <div className="font-medium">{followup.assignee}</div>
          </div>
        </div>

        {followup.notes && (
          <div>
            <span className="text-muted-foreground text-sm">Notes:</span>
            <p className="text-sm mt-1">{followup.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 touch-manipulation">
            Update Progress
          </Button>
          <Button variant="outline" size="sm" className="flex-1 touch-manipulation">
            Reschedule
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Follow-ups ({mockFollowups.length})</h3>
        <Button size="sm" className="touch-manipulation">
          <Plus className="h-4 w-4 mr-2" />
          Add Follow-up
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {mockFollowups.filter(f => f.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {mockFollowups.filter(f => f.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {mockFollowups.filter(f => f.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {mockFollowups.filter(f => f.status === 'overdue').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Followups List */}
      <div className="space-y-3">
        {mockFollowups.map((followup) => (
          <Card key={followup.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              {isMobile ? (
                <Drawer>
                  <DrawerTrigger asChild>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(followup.type)}
                          <span className="font-medium text-sm">{followup.title}</span>
                        </div>
                        <Badge className={getStatusColor(followup.status)} variant="outline">
                          {followup.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{followup.progress}%</span>
                        </div>
                        <Progress value={followup.progress} className="h-1.5" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Due: {followup.dueDate}</span>
                        <span>{followup.assignee}</span>
                      </div>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Follow-up Details</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                      <FollowupDetail followup={followup} />
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <div 
                  className="space-y-3"
                  onClick={() => setSelectedFollowup(followup)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(followup.type)}
                      <span className="font-medium">{followup.title}</span>
                    </div>
                    <Badge className={getStatusColor(followup.status)} variant="outline">
                      {getStatusIcon(followup.status)}
                      <span className="ml-1 capitalize">{followup.status}</span>
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{followup.progress}%</span>
                    </div>
                    <Progress value={followup.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Due: {followup.dueDate}</span>
                    <span>Assigned to: {followup.assignee}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};