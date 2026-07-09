DROP POLICY IF EXISTS "Deny public select on storytelling_sessions" ON public.storytelling_sessions;
CREATE POLICY "Public can view published sessions"
ON public.storytelling_sessions
FOR SELECT
TO anon, authenticated
USING (status = 'published');