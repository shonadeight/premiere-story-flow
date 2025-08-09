import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Send, 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Target,
  Users,
  BarChart3,
  Plus,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  LinkIcon,
  X,
  UserPlus
} from 'lucide-react';
import { mockUser, mockTimelines } from '@/data/mockData';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  suggestions?: string[];
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    type: 'ai' | 'user' | 'contact';
  }>;
  linkedTimelines: string[];
  unreadCount: number;
}

export const Assistant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>('conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const isModal = location.pathname === '/assistant-modal';
  const isMobile = window.innerWidth < 768;

  const availableMembers = [
    { id: '1', name: 'Sarah Chen', role: 'Partner', avatar: 'SC' },
    { id: '2', name: 'Alex Rivera', role: 'Developer', avatar: 'AR' },
    { id: '3', name: 'Mike Johnson', role: 'Investor', avatar: 'MJ' },
    { id: '4', name: 'Lisa Wang', role: 'Advisor', avatar: 'LW' },
  ];

  const conversations: Conversation[] = [
    {
      id: 'conv-1',
      title: 'Investment Strategy Analysis',
      lastMessage: 'Based on your portfolio, I recommend...',
      timestamp: '2 minutes ago',
      participants: [
        { id: 'ai-1', name: 'AI Assistant', type: 'ai' }
      ],
      linkedTimelines: ['timeline-1', 'timeline-2'],
      unreadCount: 0
    },
    {
      id: 'conv-2', 
      title: 'Sarah Chen Partnership',
      lastMessage: 'Thanks for sharing the contract details',
      timestamp: '1 hour ago',
      participants: [
        { id: 'sarah-1', name: 'Sarah Chen', type: 'contact' },
        { id: 'ai-1', name: 'AI Assistant', type: 'ai' }
      ],
      linkedTimelines: ['timeline-3'],
      unreadCount: 2
    },
    {
      id: 'conv-3',
      title: 'DeFi Protocol Research',
      lastMessage: 'Smart contract audit completed',
      timestamp: '3 hours ago', 
      participants: [
        { id: 'alex-1', name: 'Alex Rivera', type: 'contact' },
        { id: 'ai-1', name: 'AI Assistant', type: 'ai' }
      ],
      linkedTimelines: ['timeline-4'],
      unreadCount: 0
    }
  ];

  const messages: ChatMessage[] = [
    {
      id: 'msg-1',
      content: 'Hello! How can I help you optimize your timeline investments today?',
      sender: 'ai',
      timestamp: '10:30 AM'
    },
    {
      id: 'msg-2', 
      content: 'I want to analyze the performance of my AI SaaS timeline',
      sender: 'user',
      timestamp: '10:32 AM'
    },
    {
      id: 'msg-3',
      content: 'Perfect! I\'ve analyzed your AI SaaS timeline. Here\'s what I found:\n\n📈 Current valuation: $45,000 (+23.5%)\n💰 Total invested: $30,000\n⭐ Performance score: 8.7/10\n\nWould you like me to show detailed analytics or suggest optimization strategies?',
      sender: 'ai',
      timestamp: '10:33 AM',
      suggestions: ['Show detailed analytics', 'Suggest optimizations', 'Compare with similar timelines']
    }
  ];

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message logic here
    setCurrentMessage('');
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateNewChat = () => {
    setShowCreateChat(true);
  };

  if (isModal && isMobile) {
    return (
      <div className="fixed inset-0 bg-background z-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 p-4 border-b">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Assistant</h1>
          </div>
          
          {!selectedConversation ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleCreateNewChat}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <Card 
                      key={conv.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{conv.title}</h3>
                          <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{conv.lastMessage}</p>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {conv.participants.map(p => p.name).join(', ')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-4 p-4 border-b">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <h2 className="font-medium">{conversations.find(c => c.id === selectedConversation)?.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {conversations.find(c => c.id === selectedConversation)?.participants.map(p => p.name).join(', ')}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAddMembers(true)}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start"
                              onClick={() => setCurrentMessage(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Conversations List */}
        <div className="w-80 border-r">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleCreateNewChat}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/train')}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Train
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedConversation === conversation.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-1">{conversation.title}</h4>
                      <div className="flex items-center gap-1">
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {conversation.participants.slice(0, 3).map((participant) => (
                          <Avatar key={participant.id} className="h-5 w-5 border border-background">
                            <AvatarFallback className="text-xs">
                              {participant.type === 'ai' ? '🤖' : participant.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      
                      {conversation.linkedTimelines.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <LinkIcon className="h-3 w-3 mr-1" />
                          {conversation.linkedTimelines.length}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">
                        {conversations.find(c => c.id === selectedConversation)?.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>
                          {conversations.find(c => c.id === selectedConversation)?.participants.map(p => p.name).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowAddMembers(true)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                          </div>
                        </div>
                        
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="w-full text-left justify-start"
                                onClick={() => setCurrentMessage(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Members Modal */}
      <Dialog open={showAddMembers} onOpenChange={setShowAddMembers}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Members to Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Search members..." />
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedMembers.includes(member.id) ? 'bg-primary/10' : 'hover:bg-accent'
                    }`}
                    onClick={() => toggleMemberSelection(member.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                    {selectedMembers.includes(member.id) && (
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddMembers(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  setShowAddMembers(false);
                  setSelectedMembers([]);
                }}
              >
                Add Members ({selectedMembers.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};