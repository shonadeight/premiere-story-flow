-- Fix critical security vulnerability: restrict email verification codes access
-- Only allow users to read their own verification codes by email

-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Anyone can read verification codes" ON public.email_verification_codes;

-- Create a secure policy that only allows users to read their own verification codes
CREATE POLICY "Users can only read their own verification codes" 
ON public.email_verification_codes 
FOR SELECT 
USING (email = auth.email());

-- Keep the insert policy as is since verification codes need to be inserted by the system
-- The insert policy "Anyone can insert verification codes" remains unchanged