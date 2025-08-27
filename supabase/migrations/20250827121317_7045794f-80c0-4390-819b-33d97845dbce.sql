-- Fix security vulnerability in email_verification_codes table
-- Remove the insecure policy that allows anyone to insert codes
DROP POLICY IF EXISTS "Anyone can insert verification codes" ON public.email_verification_codes;

-- Create secure policy that only allows authenticated users to insert their own codes
CREATE POLICY "Users can insert own verification codes" 
ON public.email_verification_codes 
FOR INSERT 
WITH CHECK (auth.email() = email);

-- Add policy for service role to manage verification codes (for system operations)
CREATE POLICY "Service role can manage all verification codes" 
ON public.email_verification_codes 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add automatic cleanup function for expired codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.email_verification_codes 
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add constraint to prevent multiple unused codes per email (without time-based function)
-- This will prevent code flooding attacks
ALTER TABLE public.email_verification_codes 
ADD CONSTRAINT unique_unused_code_per_email 
EXCLUDE (email WITH =) WHERE (used = false);