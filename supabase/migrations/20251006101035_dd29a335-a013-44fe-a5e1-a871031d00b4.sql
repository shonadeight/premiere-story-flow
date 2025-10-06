-- Phase 4: Negotiation System Database Schema
-- Aligned with #ContributionsRules and Negotiation Adder requirements

-- Negotiation Sessions Table
CREATE TABLE IF NOT EXISTS public.negotiation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  giver_user_id UUID NOT NULL,
  receiver_user_id UUID NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('strict', 'flexible')),
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'revised', 'agreed', 'rejected', 'cancelled')),
  current_proposal_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Negotiation Proposals Table
-- Stores all proposal versions (giver and receiver expectations)
CREATE TABLE IF NOT EXISTS public.negotiation_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.negotiation_sessions(id) ON DELETE CASCADE,
  proposed_by UUID NOT NULL,
  proposal_data JSONB NOT NULL, -- Contains all #SharedContributionStepsSetup fields
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'superseded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Negotiation Messages Table
-- In-app chat, call recordings, file attachments
CREATE TABLE IF NOT EXISTS public.negotiation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.negotiation_sessions(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'call_recording', 'file')),
  content TEXT,
  file_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Negotiation Audit Log Table
-- Tracks all actions for accountability
CREATE TABLE IF NOT EXISTS public.negotiation_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.negotiation_sessions(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_user_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_negotiation_sessions_contribution ON public.negotiation_sessions(contribution_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_sessions_giver ON public.negotiation_sessions(giver_user_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_sessions_receiver ON public.negotiation_sessions(receiver_user_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_sessions_status ON public.negotiation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_negotiation_proposals_session ON public.negotiation_proposals(session_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_messages_session ON public.negotiation_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_audit_session ON public.negotiation_audit_log(session_id);

-- Enable Row Level Security
ALTER TABLE public.negotiation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for negotiation_sessions
-- Users can view sessions they are part of
CREATE POLICY "Users can view own negotiation sessions"
  ON public.negotiation_sessions
  FOR SELECT
  USING (
    auth.uid() = giver_user_id OR 
    auth.uid() = receiver_user_id
  );

-- Users can create sessions for contributions they own
CREATE POLICY "Users can create negotiation sessions"
  ON public.negotiation_sessions
  FOR INSERT
  WITH CHECK (
    auth.uid() = giver_user_id OR 
    auth.uid() = receiver_user_id
  );

-- Users can update sessions they are part of
CREATE POLICY "Users can update own negotiation sessions"
  ON public.negotiation_sessions
  FOR UPDATE
  USING (
    auth.uid() = giver_user_id OR 
    auth.uid() = receiver_user_id
  );

-- RLS Policies for negotiation_proposals
CREATE POLICY "Users can view proposals in their sessions"
  ON public.negotiation_proposals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.negotiation_sessions ns
      WHERE ns.id = negotiation_proposals.session_id
      AND (ns.giver_user_id = auth.uid() OR ns.receiver_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create proposals in their sessions"
  ON public.negotiation_proposals
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.negotiation_sessions ns
      WHERE ns.id = negotiation_proposals.session_id
      AND (ns.giver_user_id = auth.uid() OR ns.receiver_user_id = auth.uid())
    )
  );

-- RLS Policies for negotiation_messages
CREATE POLICY "Users can view messages in their sessions"
  ON public.negotiation_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.negotiation_sessions ns
      WHERE ns.id = negotiation_messages.session_id
      AND (ns.giver_user_id = auth.uid() OR ns.receiver_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their sessions"
  ON public.negotiation_messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_user_id AND
    EXISTS (
      SELECT 1 FROM public.negotiation_sessions ns
      WHERE ns.id = negotiation_messages.session_id
      AND (ns.giver_user_id = auth.uid() OR ns.receiver_user_id = auth.uid())
    )
  );

-- RLS Policies for negotiation_audit_log
CREATE POLICY "Users can view audit log in their sessions"
  ON public.negotiation_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.negotiation_sessions ns
      WHERE ns.id = negotiation_audit_log.session_id
      AND (ns.giver_user_id = auth.uid() OR ns.receiver_user_id = auth.uid())
    )
  );

CREATE POLICY "System can insert audit log"
  ON public.negotiation_audit_log
  FOR INSERT
  WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_negotiation_sessions_updated_at
  BEFORE UPDATE ON public.negotiation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION public.log_negotiation_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.negotiation_audit_log (
    session_id,
    action,
    actor_user_id,
    details
  ) VALUES (
    NEW.session_id,
    TG_OP,
    auth.uid(),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$;

-- Trigger to log all proposal actions
CREATE TRIGGER log_proposal_actions
  AFTER INSERT OR UPDATE ON public.negotiation_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.log_negotiation_action();