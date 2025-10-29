-- Seed Data: Create Demo Accounts for Testing
-- Note: These are for development/testing only. Change passwords in production!

-- ============================================
-- ADMIN ACCOUNTS
-- ============================================
-- Email: admin@echoes.vn
-- Password: admin123
-- Role: admin
-- Access: Full system access

-- Email: admin2@echoes.vn  
-- Password: admin123
-- Role: admin
-- Access: Full system access

-- Email: admin3@echoes.vn
-- Password: admin123
-- Role: admin
-- Access: Full system access

-- ============================================
-- USER ACCOUNTS (Regular Users)
-- ============================================
-- Email: user1@echoes.vn
-- Password: user123
-- Stars: 50
-- Role: user
-- Status: Can browse, shop, forum

-- Email: user2@echoes.vn
-- Password: user123
-- Stars: 150
-- Role: user
-- Status: Can browse, shop, forum

-- Email: user3@echoes.vn
-- Password: user123
-- Stars: 250 (Eligible for shop!)
-- Role: user
-- Status: Can apply for shop

-- Email: user4@echoes.vn
-- Password: user123
-- Stars: 180
-- Role: user
-- Status: Almost eligible for shop

-- Email: user5@echoes.vn
-- Password: user123
-- Stars: 300 (Eligible for shop!)
-- Role: user
-- Status: Can apply for shop

-- ============================================
-- SHOP OWNER ACCOUNTS
-- ============================================
-- Email: shop1@echoes.vn
-- Password: shop123
-- Shop Name: Heritage Crafts
-- Package: BASIC (300K)
-- Role: shopOwner
-- Status: Active shop with products

-- Email: shop2@echoes.vn
-- Password: shop123
-- Shop Name: Vietnam Treasures
-- Package: PRO (500K)
-- Role: shopOwner
-- Status: Active shop with products

-- ============================================
-- NOTES FOR MANUAL ACCOUNT CREATION
-- ============================================
-- Since Supabase Auth requires actual sign-up process,
-- you need to create these accounts through the app:

-- Method 1: Use Supabase Dashboard
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" 
-- 3. Enter email and password
-- 4. Confirm user
-- 5. Then run update queries below to set roles/stars

-- Method 2: Use the app registration
-- 1. Go to /register or /register-enhanced
-- 2. Sign up with the emails above
-- 3. Then run update queries below

-- ============================================
-- UPDATE QUERIES (Run after creating accounts)
-- ============================================

-- Create function to find user_id by email
CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = user_email LIMIT 1;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update admin accounts
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Admin 1
  v_user_id := get_user_id_by_email('admin@echoes.vn');
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (user_id, role, stars, is_email_verified, is_phone_verified, metadata)
    VALUES (v_user_id, 'admin', 0, true, true, jsonb_build_object('displayName', 'Admin User', 'isAdmin', true))
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin', metadata = jsonb_build_object('displayName', 'Admin User', 'isAdmin', true);
  END IF;

  -- Admin 2
  v_user_id := get_user_id_by_email('admin2@echoes.vn');
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (user_id, role, stars, is_email_verified, is_phone_verified, metadata)
    VALUES (v_user_id, 'admin', 0, true, true, jsonb_build_object('displayName', 'Admin Two', 'isAdmin', true))
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin', metadata = jsonb_build_object('displayName', 'Admin Two', 'isAdmin', true);
  END IF;

  -- Admin 3
  v_user_id := get_user_id_by_email('admin3@echoes.vn');
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (user_id, role, stars, is_email_verified, is_phone_verified, metadata)
    VALUES (v_user_id, 'admin', 0, true, true, jsonb_build_object('displayName', 'Admin Three', 'isAdmin', true))
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin', metadata = jsonb_build_object('displayName', 'Admin Three', 'isAdmin', true);
  END IF;
END $$;

-- Update regular user accounts
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- User 1 (50 stars)
  v_user_id := get_user_id_by_email('user1@echoes.vn');
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (user_id, role, stars, is_email_verified, is_phone_verified, metadata)
    VALUES (v_user_id, 'user', 50, true, true, jsonb_build_object('displayName', 'Nguyen Van A', 'phone', '0901234567'))
    ON CONFLICT (user_id) DO UPDATE SET stars = 50, metadata = jsonb_build_object('displayName', 'Nguyen Van A', 'phone', '0901234567');
  END IF;

  -- User 2 (150 stars)
  v_user_id := get_user_id_by_email('user2@echoes.vn');
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (user_id, role, stars, is_email_verified, is_phone_verified, metadata)
    VALUES (v_user_id, 'user', 150, true, true, jsonb_build_object('displayName', 'Tran Thi B', 'phone', '0901234568'))
    ON CONFLICT (user_id) DO UPDATE SET stars = 150, metadata = jsonb_build_object('displayName', 'Tran Thi B', 'phone', '0901234568');
  END IF;

  -- User 3 (250 stars - eligible for shop)
  v_user_id := get_user_id_by_email('user3@echoes.vn');
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (user_id, role, stars, is_email_verified, is_phone_verified, metadata)
    VALUES (v_user_id, 'user', 250, true, true, jsonb_build_object('displayName', 'Le Van C', 'phone', '0901234569'))
    ON CONFLICT (user_id) DO UPDATE SET stars = 250, metadata = jsonb_build_object('displayName', 'Le Van C', 'phone', '0901234569');
  END IF;

  -- User 4 (180 stars)
  v_user_id := get_user_id_by_email('user4@echoes.vn');
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (user_id, role, stars, is_email_verified, is_phone_verified, metadata)
    VALUES (v_user_id, 'user', 180, true, true, jsonb_build_object('displayName', 'Pham Thi D', 'phone', '0901234570'))
    ON CONFLICT (user_id) DO UPDATE SET stars = 180, metadata = jsonb_build_object('displayName', 'Pham Thi D', 'phone', '0901234570');
  END IF;

  -- User 5 (300 stars - eligible for shop)
  v_user_id := get_user_id_by_email('user5@echoes.vn');
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (user_id, role, stars, is_email_verified, is_phone_verified, metadata)
    VALUES (v_user_id, 'user', 300, true, true, jsonb_build_object('displayName', 'Hoang Van E', 'phone', '0901234571'))
    ON CONFLICT (user_id) DO UPDATE SET stars = 300, metadata = jsonb_build_object('displayName', 'Hoang Van E', 'phone', '0901234571');
  END IF;
END $$;

-- ============================================
-- INSTRUCTIONS TO CREATE ACCOUNTS
-- ============================================

-- OPTION 1: Create via Supabase Dashboard (Recommended for testing)
-- 1. Open Supabase Dashboard: https://app.supabase.com
-- 2. Go to Authentication → Users
-- 3. Click "Add user" for each account above
-- 4. After creating, run this migration to set roles and stars

-- OPTION 2: Create via Application
-- 1. Go to http://localhost:5174/register
-- 2. Register each account manually
-- 3. Then run the UPDATE queries above in Supabase SQL Editor

-- OPTION 3: Programmatic Creation (if you have service role key)
-- Use Supabase Admin API with service_role key to create users directly

-- ============================================
-- VERIFICATION
-- ============================================

-- Check all accounts:
SELECT 
  au.email,
  up.role,
  up.stars,
  up.is_email_verified,
  up.is_phone_verified,
  up.metadata->>'displayName' as display_name,
  CASE 
    WHEN up.role = 'admin' THEN 'Full Access'
    WHEN up.stars >= 200 THEN 'Can Request Shop'
    ELSE 'Regular User'
  END as status
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'admin@echoes.vn', 'admin2@echoes.vn', 'admin3@echoes.vn',
  'user1@echoes.vn', 'user2@echoes.vn', 'user3@echoes.vn', 'user4@echoes.vn', 'user5@echoes.vn',
  'shop1@echoes.vn', 'shop2@echoes.vn'
)
ORDER BY up.role DESC, up.stars DESC;

-- ============================================
-- SECURITY NOTE
-- ============================================
-- ⚠️ WARNING: These are test accounts with simple passwords
-- ⚠️ DO NOT use these in production
-- ⚠️ Always use strong passwords in production
-- ⚠️ Change all passwords immediately after testing
