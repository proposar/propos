CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  client_name TEXT NOT NULL,
  client_email TEXT,
  freelancer_signature TEXT,
  client_signature TEXT,
  freelancer_signed_at TIMESTAMPTZ,
  client_signed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  invoice_number TEXT NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  status TEXT DEFAULT 'draft',
  line_items JSONB DEFAULT '[]',
  subtotal DECIMAL(12,2),
  discount_percent DECIMAL(5,2) DEFAULT 0,
  tax_percent DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  payment_link TEXT,
  notes TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contracts_proposal_id ON contracts(proposal_id);
CREATE INDEX idx_contracts_user_id ON contracts(user_id);
CREATE INDEX idx_contracts_share_id ON contracts(share_id);
CREATE INDEX idx_invoices_proposal_id ON invoices(proposal_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_share_id ON invoices(share_id);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contracts" ON contracts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own invoices" ON invoices FOR ALL USING (auth.uid() = user_id);
