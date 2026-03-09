-- Migration: Add expiry_reminder_sent to proposals table
ALTER TABLE public.proposals
ADD COLUMN expiry_reminder_sent BOOLEAN DEFAULT false;

-- Add comment
COMMENT ON COLUMN public.proposals.expiry_reminder_sent IS 'Whether a 48-hour expiration reminder has been sent for this proposal';
