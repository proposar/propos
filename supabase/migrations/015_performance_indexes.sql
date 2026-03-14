-- Composite indexes for faster list queries (user_id + created_at DESC)
CREATE INDEX IF NOT EXISTS idx_proposals_user_created_desc ON proposals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_user_created_desc ON invoices(user_id, created_at DESC);
