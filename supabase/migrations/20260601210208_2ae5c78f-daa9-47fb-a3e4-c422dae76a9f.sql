CREATE OR REPLACE FUNCTION public.get_published_storytelling_sessions()
RETURNS TABLE (
  id uuid,
  session_date timestamptz,
  title text,
  description text,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, session_date, title, description, status
  FROM public.storytelling_sessions
  WHERE status = 'published'
    AND session_date >= now()
  ORDER BY session_date ASC;
$$;

REVOKE ALL ON FUNCTION public.get_published_storytelling_sessions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_published_storytelling_sessions() TO anon, authenticated;