-- Fix "Database error: saving new user" when signing up with Google OAuth
-- The handle_new_user trigger inserts into profiles, but RLS blocks it because
-- auth.uid() is NULL during user creation. Add a policy that allows profile
-- creation for newly created auth users (id exists in auth.users).

-- Drop the restrictive insert policy and replace with one that allows trigger
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Policy 1: Users can insert their own profile when logged in (auth.uid() = id)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 2: Allow profile creation for new auth users (trigger context)
-- When handle_new_user runs, auth.uid() is NULL. This policy allows insert
-- when the id exists in auth.users (i.e. we're creating profile for a valid new user).
CREATE POLICY "Allow profile creation for new auth users" ON profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL
    AND id IN (SELECT id FROM auth.users)
  );
