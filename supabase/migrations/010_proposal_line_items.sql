-- Proposal line items (synced with DB - applied via Supabase MCP)
CREATE TABLE IF NOT EXISTS proposal_line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit TEXT DEFAULT 'unit',
  rate DECIMAL(12,2) NOT NULL,
  amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * rate) STORED,
  is_optional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE proposals ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12,2);
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tax_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS grand_total DECIMAL(12,2);
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS line_items_enabled BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_line_items_proposal_id ON proposal_line_items(proposal_id);

ALTER TABLE proposal_line_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own line items" ON proposal_line_items;
CREATE POLICY "Users manage own line items" ON proposal_line_items
  FOR ALL USING (proposal_id IN (SELECT id FROM proposals WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can view line items by share_id" ON proposal_line_items;
CREATE POLICY "Public can view line items by share_id" ON proposal_line_items
  FOR SELECT USING (proposal_id IN (SELECT id FROM proposals WHERE share_id IS NOT NULL));
