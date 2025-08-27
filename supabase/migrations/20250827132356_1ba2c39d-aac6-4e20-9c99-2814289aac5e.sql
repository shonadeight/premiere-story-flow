-- Add onboarding_completed flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;

-- Update existing profiles to mark them as completed (for backward compatibility)
UPDATE public.profiles 
SET onboarding_completed = true 
WHERE name IS NOT NULL;