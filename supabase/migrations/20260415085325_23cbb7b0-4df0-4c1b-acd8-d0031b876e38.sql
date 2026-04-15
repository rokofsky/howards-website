DROP VIEW IF EXISTS public.storytelling_sessions_public;

CREATE VIEW public.storytelling_sessions_public
WITH (security_invoker=off) AS
SELECT id, title, description, session_date, created_at
FROM public.storytelling_sessions;