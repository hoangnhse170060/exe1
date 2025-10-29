-- Verification System for Enhanced Registration

-- Email verification table
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phone verification table
CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extend user_profiles with new fields
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('user', 'shopOwner', 'admin')) DEFAULT 'user';
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS shop_id UUID;

-- Indexes for verification lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON public.email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires ON public.email_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON public.phone_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_expires ON public.phone_verifications(expires_at);

-- Enable RLS
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email verifications
CREATE POLICY "Users can view their own email verifications" ON public.email_verifications
  FOR SELECT USING (true); -- Allow checking verification status

CREATE POLICY "Service can insert email verifications" ON public.email_verifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update email verifications" ON public.email_verifications
  FOR UPDATE USING (true);

-- RLS Policies for phone verifications  
CREATE POLICY "Users can view their own phone verifications" ON public.phone_verifications
  FOR SELECT USING (true);

CREATE POLICY "Service can insert phone verifications" ON public.phone_verifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update phone verifications" ON public.phone_verifications
  FOR UPDATE USING (true);

-- Function to clean expired verifications
CREATE OR REPLACE FUNCTION clean_expired_verifications()
RETURNS void AS $$
BEGIN
  DELETE FROM public.email_verifications WHERE expires_at < NOW();
  DELETE FROM public.phone_verifications WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
BEGIN
  code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  RETURN code;
END;
$$ LANGUAGE plpgsql;
