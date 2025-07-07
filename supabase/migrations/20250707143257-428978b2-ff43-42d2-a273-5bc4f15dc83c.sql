
-- Create table for authorized emails
CREATE TABLE public.authorized_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the admin email
INSERT INTO public.authorized_emails (email) VALUES ('compras.hcm@labcmi.org.br');

-- Enable Row Level Security
ALTER TABLE public.authorized_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read authorized emails (needed for signup validation)
CREATE POLICY "Anyone can read authorized emails" 
  ON public.authorized_emails 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Create policy to prevent unauthorized modifications
CREATE POLICY "Only authenticated users can modify authorized emails" 
  ON public.authorized_emails 
  FOR ALL 
  TO authenticated
  USING (false)
  WITH CHECK (false);
