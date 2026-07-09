DROP VIEW IF EXISTS public.storytelling_sessions_public;

CREATE OR REPLACE FUNCTION public.get_public_storytelling_sessions()
RETURNS TABLE (
  id uuid,
  session_date timestamptz,
  title text,
  description text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, session_date, title, description
  FROM public.storytelling_sessions
  ORDER BY session_date ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_storytelling_sessions() TO anon, authenticated;