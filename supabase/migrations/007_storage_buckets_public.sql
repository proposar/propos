-- Ensure avatars and logos buckets exist and are PUBLIC
-- Run in Supabase Dashboard > SQL Editor if logos/avatars images don't load
-- The upload API uses getPublicUrl() which requires buckets to be public

-- Create buckets if they don't exist (Supabase storage.buckets)
-- If buckets already exist, create via Dashboard: Storage > New bucket > avatars (public), logos (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true), ('logos', 'logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies for avatars bucket
DROP POLICY IF EXISTS "Authenticated upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;

CREATE POLICY "Authenticated upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated update avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Policies for logos bucket
DROP POLICY IF EXISTS "Authenticated upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update logos" ON storage.objects;
DROP POLICY IF EXISTS "Public read logos" ON storage.objects;

CREATE POLICY "Authenticated upload logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Authenticated update logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'logos');

CREATE POLICY "Public read logos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'logos');
