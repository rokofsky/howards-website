
-- Create storytelling_sessions table
CREATE TABLE public.storytelling_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_date TIMESTAMPTZ NOT NULL,
  zoom_link TEXT,
  zoom_meeting_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create session_signups table
CREATE TABLE public.session_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.storytelling_sessions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.storytelling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_signups ENABLE ROW LEVEL SECURITY;

-- Public can read sessions
CREATE POLICY "Anyone can view sessions"
  ON public.storytelling_sessions
  FOR SELECT
  USING (true);

-- Public can insert signups
CREATE POLICY "Anyone can sign up"
  ON public.session_signups
  FOR INSERT
  WITH CHECK (true);

-- Public can read signups (needed for checking if already signed up)
CREATE POLICY "Anyone can view signups"
  ON public.session_signups
  FOR SELECT
  USING (true);
