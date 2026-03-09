-- Extra metadata for contract e-signatures
-- Stores basic evidence about where the contract was signed from.

ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS client_signed_ip TEXT,
  ADD COLUMN IF NOT EXISTS client_signed_user_agent TEXT;

