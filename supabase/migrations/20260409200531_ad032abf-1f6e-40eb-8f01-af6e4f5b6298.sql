
-- 1. storytelling_sessions: Remove anon write policies if they exist
DROP POLICY IF EXISTS "Allow insert for anon" ON public.storytelling_sessions;
DROP POLICY IF EXISTS "Allow update for anon" ON public.storytelling_sessions;
DROP POLICY IF EXISTS "Allow delete for anon" ON public.storytelling_sessions;

-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view sessions" ON public.storytelling_sessions;

-- Create a view that hides zoom columns for public consumption
CREATE OR REPLACE VIEW public.storytelling_sessions_public AS
SELECT id, title, description, session_date, created_at
FROM public.storytelling_sessions;

-- Grant access to the view for anon and authenticated roles
GRANT SELECT ON public.storytelling_sessions_public TO anon, authenticated;

-- 2. contact_submissions: ensure RLS is enabled and add INSERT policy
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. registrations: ensure RLS is enabled and add INSERT policy
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for sessions"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. session_signups: ensure RLS is enabled and add INSERT policy  
ALTER TABLE public.session_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for sessions"
ON public.session_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
