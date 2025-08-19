import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Brain,
  Plus,
  UserPlus,
  LinkIcon,
  Search
} from 'lucide-react';
import { Timeline } from '@/types/timeline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline: Timeline;
}

export const ConversationModal = ({ open, onOpenChange, timeline }: ConversationModalProps) => {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'create' | 'chat'>('list');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['ai-assistant']);
  const [conversationTitle, setConversationTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');

  const availableMembers = [
    { id: 'ai-assistant', name: 'AI Assistant', type: 'ai', avatar: '🤖' },
    { id: 'sarah-chen', name: 'Sarah Chen', type: 'contact', avatar: 'SC' },
    { id: 'alex-rivera', name: 'Alex Rivera', type: 'contact', avatar: 'AR' },
    { id: 'mike-johnson', name: 'Mike Johnson', type: 'contact', avatar: 'MJ' },
  ];

  const conversations = [
    {
      id: '1',
      title: `${timeline.title} - Strategy Discussion`,
      participants: ['AI Assistant', 'Sarah Chen'],
      lastMessage: 'I think we should focus on the Q3 milestones...',
      timestamp: '2 hours ago',
      unreadCount: 3
    },
    {
      id: '2', 
      title: 'Weekly Progress Review',
      participants: ['AI Assistant'],
      lastMessage: 'Based on current metrics, you\'re ahead of schedule',
      timestamp: '1 day ago',
      unreadCount: 0
    }
  ];

  const handleCreateConversation = () => {
    if (!conversationTitle.trim() || selectedMembers.length === 0) return;
    
    console.log('Creating conversation:', {
      title: conversationTitle,
      members: selectedMembers,
      linkedTimeline: timeline.id
    });
    
    setView('chat');
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => {
      if (memberId === 'ai-assistant') {
        // AI Assistant is always included and can't be removed
        return prev;
      }
      return prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId];
    });
  };

  if (view === 'create') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Start New Conversation
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Conversation Title</label>
              <Input
                placeholder="e.g., Project Planning Discussion"
                value={conversationTitle}
                onChange={(e) => setConversationTitle(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Select Members</label>
                <Badge variant="outline">{selectedMembers.length} selected</Badge>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {availableMembers
                    .filter(member => 
                      member.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => toggleMemberSelection(member.id)}
                          disabled={member.id === 'ai-assistant'}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{member.type}</div>
                          </div>
                        </div>
                        {member.id === 'ai-assistant' && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                    ))
                  }
                </div>
              </ScrollArea>
            </div>

            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Linked Timeline</span>
              </div>
              <p className="text-sm text-muted-foreground">{timeline.title}</p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setView('list')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleCreateConversation}
                disabled={!conversationTitle.trim() || selectedMembers.length === 0}
                className="flex-1"
              >
                Start Conversation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversations
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Timeline-linked conversations and AI assistance
            </p>
            <Button size="sm" onClick={() => setView('create')}>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  navigate(`/assistant?conversation=${conversation.id}`);
                  onOpenChange(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{conversation.title}</h4>
                    <div className="flex items-center gap-2">
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {conversation.participants.join(', ')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">
                  Start a new conversation with AI assistance or invite team members to discuss this timeline.
                </p>
                <Button variant="outline" size="sm" onClick={() => setView('create')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Start Conversation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};