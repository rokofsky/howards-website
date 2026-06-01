-- Allow anon/authenticated to read ONLY safe marketing columns of published sessions
-- Step 1: Remove blanket deny SELECT, add scoped policy
DROP POLICY IF EXISTS "Deny public select on storytelling_sessions" ON public.storytelling_sessions;

CREATE POLICY "Public can read published session marketing info"
  ON public.storytelling_sessions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Step 2: Column-level grants — give anon/authenticated SELECT only on safe columns
REVOKE SELECT ON public.storytelling_sessions FROM anon, authenticated;
GRANT SELECT (id, session_date, title, description, status) ON public.storytelling_sessions TO anon, authenticated;

-- Step 3: Make the public view use invoker so column grants are enforced
ALTER VIEW public.storytelling_sessions_public SET (security_invoker = true);