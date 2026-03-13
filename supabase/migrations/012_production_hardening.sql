-- ============================================================
-- Migration 012: Production Hardening — March 2026
-- Fixes: referral columns, welcome email tracking, public proposal RLS
-- ============================================================

-- 1. Add missing columns to profiles for the referral system
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_earnings DECIMAL(10,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE;

-- 2. Create referral_signups view (maps referrals table to what the UI/API expects)
CREATE OR REPLACE VIEW referral_signups AS
SELECT
  r.id,
  r.referrer_id,
  r.referee_email        AS referred_email,
  r.referred_at          AS signed_up_at,
  (r.completed_upgrade_at IS NOT NULL) AS converted_to_paid
FROM referrals r;

-- 3. Add unique index on referral_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code) WHERE referral_code IS NOT NULL;

-- 4. FIX: Public proposal RLS — previously exposed drafts if share_id was guessed
--    Drop the old overly-broad policy and replace with a safe one
DROP POLICY IF EXISTS "Public can view proposals by share_id" ON proposals;

CREATE POLICY "Public can view sent proposals by share_id"
  ON proposals
  FOR SELECT
  USING (
    share_id IS NOT NULL
    AND status IN ('sent', 'viewed', 'accepted', 'declined')
  );

-- 5. Add index on proposals.status for better performance on the new policy
CREATE INDEX IF NOT EXISTS idx_proposals_share_id_status ON proposals(share_id, status) WHERE share_id IS NOT NULL;

-- 6. Add function to auto-generate referral code on profile creation
CREATE OR REPLACE FUNCTION generate_referral_code(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate: REF-XXXXXXXX (8 chars from user id prefix + random suffix)
    code := 'REF-' || UPPER(LEFT(REPLACE(user_id::TEXT, '-', ''), 4)) || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
    SELECT COUNT(*) INTO exists_check FROM profiles WHERE referral_code = code;
    EXIT WHEN exists_check = 0;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- 7. Backfill referral codes for existing users who don't have one
UPDATE profiles
SET referral_code = generate_referral_code(id)
WHERE referral_code IS NULL;

-- 8. Auto-generate referral code on new user creation (update existing trigger)
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    generate_referral_code(NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
