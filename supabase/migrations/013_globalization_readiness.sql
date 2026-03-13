-- ============================================================
-- Migration 013: Globalization & Compliance — March 2026
-- Adds support for GDPR/Privacy toggles and international readiness
-- ============================================================

-- Add GDPR compliance toggle to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gdpr_compliant_mode BOOLEAN DEFAULT FALSE;

-- Add index to country for potential regional analytics
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country) WHERE country IS NOT NULL;

-- Ensure currency column is ready for defaults (already exists in some forms, but let's be explicit)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
