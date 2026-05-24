-- Remove the SECURITY DEFINER function approach
REVOKE EXECUTE ON FUNCTION public.get_public_storytelling_sessions() FROM anon, authenticated, public;
DROP FUNCTION IF EXISTS public.get_public_storytelling_sessions();

-- Recreate the public view as SECURITY INVOKER (default-safe)
DROP VIEW IF EXISTS public.storytelling_sessions_public;
CREATE VIEW public.storytelling_sessions_public
WITH (security_invoker = on) AS
SELECT id, session_date, title, description
FROM public.storytelling_sessions;

GRANT SELECT ON public.storytelling_sessions_public TO anon, authenticated;

-- Allow SELECT on base table for anon/authenticated, but only on safe columns
DROP POLICY IF EXISTS "Deny direct public reads on storytelling_sessions" ON public.storytelling_sessions;

CREATE POLICY "Public can read safe session columns"
ON public.storytelling_sessions
FOR SELECT
TO anon, authenticated
USING (true);

-- Revoke all column access first, then grant only safe columns
REVOKE SELECT ON public.storytelling_sessions FROM anon, authenticated;
GRANT SELECT (id, session_date, title, description, created_at) ON public.storytelling_sessions TO anon, authenticated;