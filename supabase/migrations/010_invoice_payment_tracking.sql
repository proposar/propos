-- Add partial payment tracking to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS deposit_percent DECIMAL(5,2) DEFAULT 50;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid'; -- unpaid | deposit_paid | partially_paid | fully_paid

-- Create index for payment status queries
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_payment ON invoices(user_id, payment_status);

-- Add comment for clarity
COMMENT ON COLUMN invoices.amount_paid IS 'Amount received so far (tracks partial payments)';
COMMENT ON COLUMN invoices.deposit_percent IS 'Deposit percentage required (default 50% as per contract terms)';
COMMENT ON COLUMN invoices.payment_status IS 'Payment state: unpaid | deposit_paid | partially_paid | fully_paid';
