-- Restrict public SELECT on storytelling_sessions to non-sensitive columns only.
-- zoom_link and zoom_meeting_id must NEVER be exposed to anon/authenticated;
-- they are only served via the password-protected signup-for-session edge function.

REVOKE SELECT ON public.storytelling_sessions FROM anon, authenticated;

GRANT SELECT (id, session_date, title, description, status, created_at)
  ON public.storytelling_sessions TO anon, authenticated;

-- service_role retains full access (edge functions use it to read zoom_link/meeting_id).
GRANT ALL ON public.storytelling_sessions TO service_role;