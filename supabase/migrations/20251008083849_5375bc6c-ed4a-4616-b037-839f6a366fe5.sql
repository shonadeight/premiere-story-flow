-- Create contribution_rating_configs table for rating criteria
CREATE TABLE IF NOT EXISTS public.contribution_rating_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  criteria TEXT NOT NULL,
  max_rating INTEGER NOT NULL CHECK (max_rating >= 5 AND max_rating <= 10),
  scale_type TEXT NOT NULL DEFAULT '1-10',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contribution_rating_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own contribution rating configs"
  ON public.contribution_rating_configs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contributions c
      WHERE c.id = contribution_rating_configs.contribution_id
      AND c.creator_user_id = auth.uid()
    )
  );

-- Add index for performance
CREATE INDEX idx_contribution_rating_configs_contribution_id 
  ON public.contribution_rating_configs(contribution_id);