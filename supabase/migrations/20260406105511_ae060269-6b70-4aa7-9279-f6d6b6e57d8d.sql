
-- Add title and description columns to storytelling_sessions
ALTER TABLE public.storytelling_sessions
  ADD COLUMN title text,
  ADD COLUMN description text;

-- Create registrations table
CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  email text NOT NULL,
  session_title text NOT NULL,
  session_date timestamptz NOT NULL,
  zoom_meeting_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT only
CREATE POLICY "Anyone can register"
  ON public.registrations
  FOR INSERT
  TO public
  WITH CHECK (true);
