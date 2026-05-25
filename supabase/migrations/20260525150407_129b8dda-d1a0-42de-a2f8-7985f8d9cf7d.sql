ALTER TABLE public.storytelling_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.storytelling_sessions;
DROP POLICY IF EXISTS "Public can read safe session columns" ON public.storytelling_sessions;

CREATE POLICY "Allow public read access"
ON public.storytelling_sessions
FOR SELECT
TO anon, authenticated
USING (true);

DROP VIEW IF EXISTS public.storytelling_sessions_public;

CREATE VIEW public.storytelling_sessions_public
WITH (security_invoker = on) AS
SELECT
  id,
  session_date,
  title,
  description,
  status
FROM public.storytelling_sessions
WHERE status = 'published';

GRANT SELECT ON public.storytelling_sessions TO anon, authenticated;
GRANT SELECT ON public.storytelling_sessions_public TO anon, authenticated;