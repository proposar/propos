-- Performance indexes for user-scoped list queries and email lookups

CREATE INDEX IF NOT EXISTS idx_proposals_user_created_at_desc
  ON proposals (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_user_created_at_desc
  ON invoices (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contracts_user_created_at_desc
  ON contracts (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_lower_email
  ON profiles (LOWER(email));
