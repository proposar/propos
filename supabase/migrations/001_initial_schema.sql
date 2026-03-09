-- Propella initial schema
-- 1. PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  business_name TEXT,
  business_type TEXT,
  avatar_url TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'America/New_York',
  bio TEXT,
  signature_text TEXT,
  logo_url TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_plan TEXT DEFAULT 'free',
  subscription_period_end TIMESTAMPTZ,
  proposals_used_this_month INTEGER DEFAULT 0,
  proposals_reset_date DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENTS TABLE
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  country TEXT,
  notes TEXT,
  tags TEXT[],
  total_proposals INTEGER DEFAULT 0,
  won_proposals INTEGER DEFAULT 0,
  total_value DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROPOSALS TABLE
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  title TEXT NOT NULL,
  project_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_company TEXT,
  project_scope TEXT NOT NULL,
  budget_amount DECIMAL(12,2),
  budget_currency TEXT DEFAULT 'USD',
  timeline TEXT,
  deliverables TEXT[],
  additional_notes TEXT,
  generated_content TEXT,
  executive_summary TEXT,
  tone TEXT DEFAULT 'professional',
  template_id UUID,
  custom_sections JSONB DEFAULT '[]',
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  viewer_ip TEXT,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  follow_up_sent BOOLEAN DEFAULT FALSE,
  follow_up_at TIMESTAMPTZ,
  is_template BOOLEAN DEFAULT FALSE,
  template_name TEXT,
  generation_model TEXT DEFAULT 'claude-sonnet-4-20250514',
  generation_tokens INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROPOSAL VIEWS TABLE (analytics)
CREATE TABLE proposal_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  duration_seconds INTEGER,
  scrolled_to_percent INTEGER
);

-- 5. TEMPLATES TABLE
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  use_count INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACTIVITY LOG TABLE
CREATE TABLE activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_proposals_user_id ON proposals(user_id);
CREATE INDEX idx_proposals_share_id ON proposals(share_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_client_id ON proposals(client_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_proposal_views_proposal_id ON proposal_views(proposal_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users manage own clients" ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own proposals" ON proposals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view proposals by share_id" ON proposals FOR SELECT USING (share_id IS NOT NULL);
CREATE POLICY "Users manage own activity" ON activity_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own views" ON proposal_views FOR ALL USING (
  proposal_id IN (SELECT id FROM proposals WHERE user_id = auth.uid())
);
CREATE POLICY "Anyone can view public templates" ON templates FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "Users manage own templates" ON templates FOR ALL USING (auth.uid() = user_id);

-- TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
