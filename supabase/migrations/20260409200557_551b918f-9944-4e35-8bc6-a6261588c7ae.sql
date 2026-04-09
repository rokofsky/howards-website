
-- Add SELECT policy for anon/authenticated so the security_invoker view works
-- The view itself only exposes safe columns
CREATE POLICY "Public can read sessions via view"
ON public.storytelling_sessions
FOR SELECT
TO anon, authenticated
USING (true);
