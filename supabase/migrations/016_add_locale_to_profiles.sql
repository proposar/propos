-- ============================================================
-- Migration 016: User Language Preference Sync
-- Adds support for persisting the user's preferred locale
-- ============================================================

-- Add locale column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';

-- Add index on locale to help with international growth analytics
CREATE INDEX IF NOT EXISTS idx_profiles_locale ON profiles(locale) WHERE locale IS NOT NULL;
