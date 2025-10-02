-- =====================================================
-- PHASE 1: SHONACOIN CONTRIBUTION SYSTEM DATABASE SCHEMA
-- =====================================================

-- Create enum types for contribution system
CREATE TYPE public.contribution_category AS ENUM (
  'financial',
  'intellectual',
  'marketing',
  'assets'
);

CREATE TYPE public.financial_subtype AS ENUM (
  'cash',
  'debt',
  'equity',
  'revenue_share',
  'profit_share',
  'pledges'
);

CREATE TYPE public.marketing_subtype AS ENUM (
  'leads_onboarding',
  'leads_followup',
  'leads_conversion',
  'leads_retention'
);

CREATE TYPE public.intellectual_subtype AS ENUM (
  'coaching',
  'tutoring',
  'project_development',
  'project_planning',
  'mentorship',
  'consultation',
  'research',
  'perspectives',
  'customer_support',
  'capacity_building'
);

CREATE TYPE public.asset_subtype AS ENUM (
  'farm_tools',
  'land',
  'livestock',
  'seeds',
  'construction_tools',
  'houses',
  'office_tools',
  'office_spaces',
  'digital_assets',
  'software',
  'data_assets',
  'vehicles',
  'custom'
);

CREATE TYPE public.contribution_status AS ENUM (
  'draft',
  'setup_incomplete',
  'ready_to_receive',
  'ready_to_give',
  'negotiating',
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE public.timeline_type AS ENUM (
  'personal',
  'profile',
  'project',
  'financial',
  'intellectual',
  'marketing',
  'assets'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Timelines table (root container for contributions)
CREATE TABLE public.timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  timeline_type timeline_type NOT NULL DEFAULT 'personal',
  is_public BOOLEAN DEFAULT false,
  parent_timeline_id UUID REFERENCES public.timelines(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Contributions table (main contribution records)
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_id UUID NOT NULL REFERENCES public.timelines(id) ON DELETE CASCADE,
  creator_user_id UUID NOT NULL,
  title TEXT,
  description TEXT,
  category contribution_category NOT NULL,
  status contribution_status DEFAULT 'draft' NOT NULL,
  is_timeline BOOLEAN DEFAULT false,
  complete_later BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Contribution subtypes (tracks selected subtypes per contribution)
CREATE TABLE public.contribution_subtypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  subtype_name TEXT NOT NULL,
  configuration JSONB DEFAULT '{}',
  direction TEXT NOT NULL CHECK (direction IN ('to_give', 'to_receive')),
  step_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(contribution_id, subtype_name, direction)
);

-- Contribution setup steps (tracks completion of steps 5-13)
CREATE TABLE public.contribution_setup_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number BETWEEN 5 AND 13),
  step_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  skipped BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(contribution_id, step_number)
);

-- Valuation records
CREATE TABLE public.contribution_valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  subtype_name TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('to_give', 'to_receive')),
  valuation_type TEXT NOT NULL CHECK (valuation_type IN ('fixed', 'formula', 'custom')),
  amount DECIMAL,
  currency TEXT DEFAULT 'USD',
  formula TEXT,
  breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insights configuration
CREATE TABLE public.contribution_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  subtype_name TEXT,
  insight_type TEXT NOT NULL,
  configuration JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Follow-up records
CREATE TABLE public.contribution_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  subtype_name TEXT,
  followup_status TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Smart rules
CREATE TABLE public.contribution_smart_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  subtype_name TEXT,
  rule_name TEXT NOT NULL,
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Ratings
CREATE TABLE public.contribution_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  rater_user_id UUID NOT NULL,
  rating_value INTEGER CHECK (rating_value BETWEEN 1 AND 10),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Files
CREATE TABLE public.contribution_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  subtype_name TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Contributors (participants in a contribution)
CREATE TABLE public.contribution_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('giver', 'receiver', 'admin', 'viewer')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(contribution_id, user_id, role)
);

-- Knots (linked timelines/knowledge nodes)
CREATE TABLE public.contribution_knots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  linked_timeline_id UUID REFERENCES public.timelines(id) ON DELETE CASCADE,
  knot_type TEXT NOT NULL CHECK (knot_type IN ('merge', 'value_sharing', 'cross_link')),
  configuration JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_timelines_user_id ON public.timelines(user_id);
CREATE INDEX idx_timelines_parent_id ON public.timelines(parent_timeline_id);
CREATE INDEX idx_contributions_timeline_id ON public.contributions(timeline_id);
CREATE INDEX idx_contributions_creator ON public.contributions(creator_user_id);
CREATE INDEX idx_contributions_status ON public.contributions(status);
CREATE INDEX idx_contribution_subtypes_contribution_id ON public.contribution_subtypes(contribution_id);
CREATE INDEX idx_contribution_setup_steps_contribution_id ON public.contribution_setup_steps(contribution_id);
CREATE INDEX idx_contribution_contributors_user_id ON public.contribution_contributors(user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_timelines_updated_at
  BEFORE UPDATE ON public.timelines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contributions_updated_at
  BEFORE UPDATE ON public.contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contribution_setup_steps_updated_at
  BEFORE UPDATE ON public.contribution_setup_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_subtypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_setup_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_smart_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_knots ENABLE ROW LEVEL SECURITY;

-- Timelines policies
CREATE POLICY "Users can view own timelines"
  ON public.timelines FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own timelines"
  ON public.timelines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own timelines"
  ON public.timelines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own timelines"
  ON public.timelines FOR DELETE
  USING (auth.uid() = user_id);

-- Contributions policies
CREATE POLICY "Users can view contributions in accessible timelines"
  ON public.contributions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.timelines t
      WHERE t.id = contributions.timeline_id
      AND (t.user_id = auth.uid() OR t.is_public = true)
    )
  );

CREATE POLICY "Users can insert contributions"
  ON public.contributions FOR INSERT
  WITH CHECK (auth.uid() = creator_user_id);

CREATE POLICY "Users can update own contributions"
  ON public.contributions FOR UPDATE
  USING (auth.uid() = creator_user_id);

CREATE POLICY "Users can delete own contributions"
  ON public.contributions FOR DELETE
  USING (auth.uid() = creator_user_id);

-- Contribution subtypes policies
CREATE POLICY "Users can view contribution subtypes"
  ON public.contribution_subtypes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_subtypes.contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert contribution subtypes"
  ON public.contribution_subtypes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update contribution subtypes"
  ON public.contribution_subtypes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete contribution subtypes"
  ON public.contribution_subtypes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

-- Apply similar policies to other tables (abbreviated for brevity)
CREATE POLICY "Users can manage own contribution setup steps"
  ON public.contribution_setup_steps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own contribution valuations"
  ON public.contribution_valuations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own contribution insights"
  ON public.contribution_insights FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own contribution followups"
  ON public.contribution_followups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own contribution smart rules"
  ON public.contribution_smart_rules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view contribution ratings"
  ON public.contribution_ratings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    ) OR rater_user_id = auth.uid()
  );

CREATE POLICY "Users can insert contribution ratings"
  ON public.contribution_ratings FOR INSERT
  WITH CHECK (auth.uid() = rater_user_id);

CREATE POLICY "Users can manage own contribution files"
  ON public.contribution_files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage contribution contributors"
  ON public.contribution_contributors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage contribution knots"
  ON public.contribution_knots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );