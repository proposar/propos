-- Storage RLS policies for avatars and logos buckets
-- Run this in Supabase Dashboard > SQL Editor if buckets show "Policies: 0"
-- Required for profile avatar/logo uploads to work

-- Avatars bucket: authenticated users can upload, update (upsert), and read
CREATE POLICY "Authenticated upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated update avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Logos bucket: same for logos
CREATE POLICY "Authenticated upload logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Authenticated update logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'logos');

CREATE POLICY "Public read logos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'logos');
