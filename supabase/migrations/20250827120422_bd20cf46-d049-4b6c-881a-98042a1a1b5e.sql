-- Clear the profile data for the current user to allow them to go through onboarding again
UPDATE profiles 
SET 
  name = NULL,
  phone = NULL,
  professional_role = NULL,
  updated_at = now()
WHERE user_id = 'a8cfc5ef-55de-4ce6-a0bc-d26c3758dafa';