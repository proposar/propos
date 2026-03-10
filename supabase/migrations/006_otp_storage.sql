-- Create OTP storage table for email verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP NOT NULL,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5
);

-- Create index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);

-- Create index for cleanup of expired codes
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);

-- Enable RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for OTP verification (no auth required at send/verify time)
CREATE POLICY "Allow insert otp" ON otp_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select otp" ON otp_codes FOR SELECT USING (true);
CREATE POLICY "Allow update otp" ON otp_codes FOR UPDATE USING (true);
CREATE POLICY "Allow delete otp" ON otp_codes FOR DELETE USING (true);
