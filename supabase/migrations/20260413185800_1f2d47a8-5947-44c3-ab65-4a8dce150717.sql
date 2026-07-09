
-- Drop the overly permissive SELECT policy on storytelling_sessions
DROP POLICY IF EXISTS "Public can read sessions via view" ON public.storytelling_sessions;

-- Add a restrictive SELECT policy that only exposes non-sensitive columns via the view
-- Deny direct SELECT on the base table from anon/authenticated
CREATE POLICY "No direct select on storytelling_sessions"
  ON public.storytelling_sessions
  FOR SELECT
  USING (false);
