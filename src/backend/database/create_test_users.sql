-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all authenticated users"
ON auth.users
FOR SELECT
TO authenticated
USING (true);

-- Insert test users with different roles
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('admin@ahq.com', crypt('admin123', gen_salt('bf')), now(), '{"role": "TOTAL"}'),
  ('operador@ahq.com', crypt('operador123', gen_salt('bf')), now(), '{"role": "OPERACIONAL"}'),
  ('usuario@ahq.com', crypt('usuario123', gen_salt('bf')), now(), '{"role": "NIVEL_1"}');