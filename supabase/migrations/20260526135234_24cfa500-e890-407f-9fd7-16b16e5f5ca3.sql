DROP VIEW IF EXISTS public.storytelling_sessions_public;
CREATE VIEW public.storytelling_sessions_public
WITH (security_invoker = true) AS
SELECT id, session_date, title, description, status
FROM public.storytelling_sessions
WHERE status = 'published';
GRANT SELECT ON public.storytelling_sessions_public TO anon, authenticated;