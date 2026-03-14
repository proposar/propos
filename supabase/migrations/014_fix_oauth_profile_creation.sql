-- ============================================================
-- Migration 014: Fix OAuth/OTP signup - "Database error: saving new user"
-- CRITICAL: Required for Google OAuth and email OTP signup to work
-- ============================================================
-- Root cause: handle_new_user trigger fails when inserting into profiles because:
-- 1. RLS blocks insert (auth.uid() is NULL during user creation)
-- 2. Trigger may run with empty search_path, so "profiles" table not found
-- ============================================================

-- Part 1: RLS - Allow profile creation when auth.uid() is NULL (trigger context)
DROP POLICY IF EXISTS "Allow profile creation for new auth users" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow profile creation for new auth users" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

-- Part 2: Fix handle_new_user trigger - set search_path and use public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    generate_referral_code(NEW.id)
  );
  RETURN NEW;
END;
$$;
