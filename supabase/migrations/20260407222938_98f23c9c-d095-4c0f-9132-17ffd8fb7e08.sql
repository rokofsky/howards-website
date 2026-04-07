
-- Remove anonymous write policies from storytelling_sessions
DROP POLICY IF EXISTS "Allow insert for anon" ON public.storytelling_sessions;
DROP POLICY IF EXISTS "Allow update for anon" ON public.storytelling_sessions;
DROP POLICY IF EXISTS "Allow delete for anon" ON public.storytelling_sessions;

-- Remove anonymous write policies from webinars
DROP POLICY IF EXISTS "Allow insert for anon" ON public.webinars;
DROP POLICY IF EXISTS "Allow update for anon" ON public.webinars;
DROP POLICY IF EXISTS "Allow delete for anon" ON public.webinars;

-- Remove public SELECT on session_signups (edge function uses service role key)
DROP POLICY IF EXISTS "Anyone can view signups" ON public.session_signups;
