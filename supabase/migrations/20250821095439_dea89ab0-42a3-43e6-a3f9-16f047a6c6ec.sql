-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  professional_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user contribution types table
CREATE TABLE public.user_contribution_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contribution_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user expectations table
CREATE TABLE public.user_expectations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expectation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user outcome sharing table
CREATE TABLE public.user_outcome_sharing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  outcome_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user interest areas table
CREATE TABLE public.user_interest_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  interest TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email verification codes table
CREATE TABLE public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_contribution_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_expectations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_outcome_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interest_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to manage their own data
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own contribution types" ON public.user_contribution_types
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contribution types" ON public.user_contribution_types
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own expectations" ON public.user_expectations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expectations" ON public.user_expectations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own outcome sharing" ON public.user_outcome_sharing
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outcome sharing" ON public.user_outcome_sharing
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own interests" ON public.user_interest_areas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interests" ON public.user_interest_areas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Email verification codes - allow public read/insert for verification process
CREATE POLICY "Anyone can insert verification codes" ON public.email_verification_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read verification codes" ON public.email_verification_codes
  FOR SELECT USING (true);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();