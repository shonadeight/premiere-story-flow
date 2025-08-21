-- Fix database schema issues for user preference tables
-- Make user_id NOT NULL and add foreign key constraints

-- Add NOT NULL constraint and foreign key for user_contribution_types
ALTER TABLE public.user_contribution_types 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.user_contribution_types 
ADD CONSTRAINT fk_user_contribution_types_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add NOT NULL constraint and foreign key for user_expectations
ALTER TABLE public.user_expectations 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.user_expectations 
ADD CONSTRAINT fk_user_expectations_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add NOT NULL constraint and foreign key for user_interest_areas
ALTER TABLE public.user_interest_areas 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.user_interest_areas 
ADD CONSTRAINT fk_user_interest_areas_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add NOT NULL constraint and foreign key for user_outcome_sharing
ALTER TABLE public.user_outcome_sharing 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.user_outcome_sharing 
ADD CONSTRAINT fk_user_outcome_sharing_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add missing RLS policies for UPDATE and DELETE operations
-- User contribution types policies
CREATE POLICY "Users can update own contribution types" 
ON public.user_contribution_types 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contribution types" 
ON public.user_contribution_types 
FOR DELETE 
USING (auth.uid() = user_id);

-- User expectations policies
CREATE POLICY "Users can update own expectations" 
ON public.user_expectations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expectations" 
ON public.user_expectations 
FOR DELETE 
USING (auth.uid() = user_id);

-- User interest areas policies
CREATE POLICY "Users can update own interests" 
ON public.user_interest_areas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interests" 
ON public.user_interest_areas 
FOR DELETE 
USING (auth.uid() = user_id);

-- User outcome sharing policies
CREATE POLICY "Users can update own outcome sharing" 
ON public.user_outcome_sharing 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own outcome sharing" 
ON public.user_outcome_sharing 
FOR DELETE 
USING (auth.uid() = user_id);

-- Email verification codes policies
CREATE POLICY "Users can update own verification codes" 
ON public.email_verification_codes 
FOR UPDATE 
USING (email = auth.email());

CREATE POLICY "Users can delete own verification codes" 
ON public.email_verification_codes 
FOR DELETE 
USING (email = auth.email());

-- Profiles DELETE policy
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);