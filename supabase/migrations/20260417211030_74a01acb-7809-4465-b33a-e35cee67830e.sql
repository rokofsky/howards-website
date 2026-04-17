-- Recreate the public sessions view with security_invoker=on so it respects
-- the querying user's RLS, and add a permissive SELECT policy on the base
-- table so anonymous users can still read non-sensitive session info.
DROP VIEW IF EXISTS public.storytelling_sessions_public;

CREATE VIEW public.storytelling_sessions_public
WITH (security_invoker=on) AS
SELECT id, title, description, session_date, created_at
FROM public.storytelling_sessions;

-- Drop the deny-all policy and replace with column-aware access:
-- Allow public SELECT on the base table, but revoke column-level access to
-- the sensitive Zoom fields so only safe columns are readable.
DROP POLICY IF EXISTS "No direct select on storytelling_sessions" ON public.storytelling_sessions;

CREATE POLICY "Public can read non-sensitive session fields"
ON public.storytelling_sessions
FOR SELECT
TO anon, authenticated
USING (true);

-- Revoke table-level SELECT and grant only safe columns
REVOKE SELECT ON public.storytelling_sessions FROM anon, authenticated;
GRANT SELECT (id, title, description, session_date, created_at)
  ON public.storytelling_sessions TO anon, authenticated;

-- Ensure the view is readable
GRANT SELECT ON public.storytelling_sessions_public TO anon, authenticated;