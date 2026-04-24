-- Restrict direct SELECT on storytelling_sessions to hide zoom_link and zoom_meeting_id from public.
-- The public-safe view `storytelling_sessions_public` already exposes only non-sensitive fields,
-- and edge functions use the service role to access full rows.

DROP POLICY IF EXISTS "Public can read non-sensitive session fields" ON public.storytelling_sessions;

CREATE POLICY "Deny direct public reads on storytelling_sessions"
ON public.storytelling_sessions
FOR SELECT
USING (false);