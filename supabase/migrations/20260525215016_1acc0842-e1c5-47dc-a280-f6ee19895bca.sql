DROP POLICY IF EXISTS "Allow public read access" ON public.storytelling_sessions;

CREATE POLICY "Deny public select on storytelling_sessions"
ON public.storytelling_sessions
FOR SELECT
TO public
USING (false);