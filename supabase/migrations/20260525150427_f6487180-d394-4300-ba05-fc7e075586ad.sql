DROP POLICY IF EXISTS "Allow public read access" ON public.storytelling_sessions;

CREATE POLICY "Allow public read access"
ON public.storytelling_sessions
FOR SELECT
TO anon, authenticated
USING (status = 'published');

GRANT SELECT ON public.storytelling_sessions TO anon, authenticated;
GRANT SELECT ON public.storytelling_sessions_public TO anon, authenticated;