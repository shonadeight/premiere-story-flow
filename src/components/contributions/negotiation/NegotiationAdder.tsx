import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNegotiation } from '@/hooks/useNegotiation';
import { ComparisonView } from './ComparisonView';
import { ChatInterface } from './ChatInterface';
import { ProposalForm } from './ProposalForm';
import { HandshakeIcon, MessageSquare, FileText, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NegotiationAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contributionId: string;
  mode: 'strict' | 'flexible';
  giverUserId: string;
  receiverUserId: string;
}

export const NegotiationAdder = ({
  open,
  onOpenChange,
  contributionId,
  mode,
  giverUserId,
  receiverUserId
}: NegotiationAdderProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('comparison');
  const {
    sessions,
    currentSession,
    setCurrentSession,
    proposals,
    messages,
    createSession,
    submitProposal,
    acceptProposal,
    rejectProposal,
    sendMessage,
    loadSessions,
    loadProposals,
    loadMessages
  } = useNegotiation(contributionId);

  const handleStartNegotiation = async () => {
    const session = await createSession(contributionId, giverUserId, receiverUserId, mode);
    if (session) {
      setCurrentSession(session as any);
      loadProposals(session.id);
      loadMessages(session.id);
    }
  };

  const handleSubmitProposal = async (proposalData: any, message?: string) => {
    if (currentSession) {
      await submitProposal(currentSession.id, proposalData, message);
    }
  };

  const handleAccept = async (proposalId: string) => {
    if (currentSession) {
      await acceptProposal(proposalId, currentSession.id);
    }
  };

  const handleReject = async (proposalId: string) => {
    if (currentSession) {
      await rejectProposal(proposalId, currentSession.id);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (currentSession) {
      await sendMessage(currentSession.id, content);
    }
  };

  const content = (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HandshakeIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Negotiation</h3>
        </div>
        <Badge variant={mode === 'strict' ? 'destructive' : 'default'}>
          {mode === 'strict' ? 'Strict Mode' : 'Flexible Mode'}
        </Badge>
      </div>

      {!currentSession && sessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {mode === 'strict' 
              ? 'Start negotiation with non-negotiable terms. Other party can only accept or reject.'
              : 'Start flexible negotiation to exchange proposals and reach agreement.'}
          </p>
          <Button onClick={handleStartNegotiation}>
            <HandshakeIcon className="h-4 w-4 mr-2" />
            Start Negotiation
          </Button>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">
              <FileText className="h-4 w-4 mr-2" />
              Compare
            </TabsTrigger>
            <TabsTrigger value="proposals">
              <HandshakeIcon className="h-4 w-4 mr-2" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            <ComparisonView
              contributionId={contributionId}
              proposals={proposals}
              mode={mode}
            />
          </TabsContent>

          <TabsContent value="proposals" className="space-y-4">
            {mode === 'flexible' && (
              <ProposalForm
                onSubmit={handleSubmitProposal}
                contributionId={contributionId}
              />
            )}
            
            <div className="space-y-2">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={
                      proposal.status === 'accepted' ? 'default' :
                      proposal.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }>
                      {proposal.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {proposal.message && (
                    <p className="text-sm">{proposal.message}</p>
                  )}
                  {proposal.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(proposal.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(proposal.id)}>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Negotiation</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Negotiation</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
