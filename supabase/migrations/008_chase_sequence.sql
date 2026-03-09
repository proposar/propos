-- Chase sequence: follow-up sequences and steps
CREATE TABLE follow_up_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE follow_up_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES follow_up_sequences(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  day_offset INTEGER NOT NULL,
  status TEXT DEFAULT 'scheduled',
  channel TEXT DEFAULT 'email',
  subject TEXT,
  body TEXT,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS sequence_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sequence_paused BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_follow_up_sequences_proposal_id ON follow_up_sequences(proposal_id);
CREATE INDEX idx_follow_up_sequences_user_id ON follow_up_sequences(user_id);
CREATE INDEX idx_follow_up_steps_proposal_id ON follow_up_steps(proposal_id);
CREATE INDEX idx_follow_up_steps_sequence_id ON follow_up_steps(sequence_id);
CREATE INDEX idx_follow_up_steps_scheduled_for ON follow_up_steps(scheduled_for);
CREATE INDEX idx_follow_up_steps_status ON follow_up_steps(status);

ALTER TABLE follow_up_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sequences" ON follow_up_sequences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own steps via sequence" ON follow_up_steps
  FOR ALL USING (
    proposal_id IN (SELECT id FROM proposals WHERE user_id = auth.uid())
  );

CREATE OR REPLACE FUNCTION cancel_sequence_on_close()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('accepted', 'declined') THEN
    UPDATE follow_up_steps
    SET status = 'cancelled'
    WHERE proposal_id = NEW.id
    AND status = 'scheduled';

    UPDATE follow_up_sequences
    SET status = 'completed'
    WHERE proposal_id = NEW.id
    AND status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_cancel_sequence ON proposals;
CREATE TRIGGER auto_cancel_sequence
  AFTER UPDATE OF status ON proposals
  FOR EACH ROW EXECUTE FUNCTION cancel_sequence_on_close();
