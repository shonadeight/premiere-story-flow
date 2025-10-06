import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NegotiationSession {
  id: string;
  contribution_id: string;
  giver_user_id: string;
  receiver_user_id: string;
  mode: 'strict' | 'flexible';
  status: 'proposed' | 'revised' | 'agreed' | 'rejected' | 'cancelled';
  current_proposal_id?: string;
  created_at: string;
  updated_at: string;
}

export interface NegotiationProposal {
  id: string;
  session_id: string;
  proposed_by: string;
  proposal_data: any; // Contains all #SharedContributionStepsSetup fields
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'superseded';
  created_at: string;
}

export interface NegotiationMessage {
  id: string;
  session_id: string;
  sender_user_id: string;
  message_type: 'text' | 'call_recording' | 'file';
  content?: string;
  file_url?: string;
  metadata?: any;
  created_at: string;
}

export const useNegotiation = (contributionId?: string) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<NegotiationSession[]>([]);
  const [currentSession, setCurrentSession] = useState<NegotiationSession | null>(null);
  const [proposals, setProposals] = useState<NegotiationProposal[]>([]);
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Load sessions for a contribution
  const loadSessions = async (contribId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('negotiation_sessions')
        .select('*')
        .eq('contribution_id', contribId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions((data || []) as NegotiationSession[]);
    } catch (error: any) {
      toast({
        title: 'Error loading negotiations',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load proposals for a session
  const loadProposals = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('negotiation_proposals')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals((data || []) as NegotiationProposal[]);
    } catch (error: any) {
      toast({
        title: 'Error loading proposals',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Load messages for a session
  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('negotiation_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as NegotiationMessage[]);
    } catch (error: any) {
      toast({
        title: 'Error loading messages',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Create a new negotiation session
  const createSession = async (
    contributionId: string,
    giverUserId: string,
    receiverUserId: string,
    mode: 'strict' | 'flexible'
  ) => {
    try {
      const { data, error } = await supabase
        .from('negotiation_sessions')
        .insert({
          contribution_id: contributionId,
          giver_user_id: giverUserId,
          receiver_user_id: receiverUserId,
          mode,
          status: 'proposed'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Negotiation started',
        description: mode === 'strict' 
          ? 'Terms are set. Other party can accept or reject.'
          : 'Negotiation opened. You can now exchange proposals.'
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error starting negotiation',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  // Submit a proposal
  const submitProposal = async (
    sessionId: string,
    proposalData: any,
    message?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('negotiation_proposals')
        .insert({
          session_id: sessionId,
          proposed_by: user.id,
          proposal_data: proposalData,
          message,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Proposal submitted',
        description: 'Your proposal has been sent for review.'
      });

      await loadProposals(sessionId);
      return data;
    } catch (error: any) {
      toast({
        title: 'Error submitting proposal',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  // Accept a proposal
  const acceptProposal = async (proposalId: string, sessionId: string) => {
    try {
      // Update proposal status
      await supabase
        .from('negotiation_proposals')
        .update({ status: 'accepted' })
        .eq('id', proposalId);

      // Update session status
      await supabase
        .from('negotiation_sessions')
        .update({ 
          status: 'agreed',
          current_proposal_id: proposalId
        })
        .eq('id', sessionId);

      toast({
        title: 'Proposal accepted',
        description: 'Agreement reached! Contribution can now proceed.'
      });

      await loadProposals(sessionId);
      await loadSessions(contributionId!);
    } catch (error: any) {
      toast({
        title: 'Error accepting proposal',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Reject a proposal
  const rejectProposal = async (proposalId: string, sessionId: string) => {
    try {
      await supabase
        .from('negotiation_proposals')
        .update({ status: 'rejected' })
        .eq('id', proposalId);

      toast({
        title: 'Proposal rejected',
        description: 'You can submit a counter-proposal.'
      });

      await loadProposals(sessionId);
    } catch (error: any) {
      toast({
        title: 'Error rejecting proposal',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Send a message
  const sendMessage = async (
    sessionId: string,
    content: string,
    messageType: 'text' | 'call_recording' | 'file' = 'text',
    fileUrl?: string,
    metadata?: any
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('negotiation_messages')
        .insert({
          session_id: sessionId,
          sender_user_id: user.id,
          message_type: messageType,
          content,
          file_url: fileUrl,
          metadata
        });

      if (error) throw error;

      await loadMessages(sessionId);
    } catch (error: any) {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Load data on mount if contributionId provided
  useEffect(() => {
    if (contributionId) {
      loadSessions(contributionId);
    }
  }, [contributionId]);

  return {
    sessions,
    currentSession,
    setCurrentSession,
    proposals,
    messages,
    loading,
    createSession,
    submitProposal,
    acceptProposal,
    rejectProposal,
    sendMessage,
    loadSessions,
    loadProposals,
    loadMessages
  };
};
