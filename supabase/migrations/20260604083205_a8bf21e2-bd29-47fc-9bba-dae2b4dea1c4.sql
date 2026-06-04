
-- Blog posts: drop permissive write policies (writes go through edge function with service role)
DROP POLICY IF EXISTS "Anyone can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can delete blog posts" ON public.blog_posts;

-- Votes: drop direct insert/update policies; routed via SECURITY DEFINER function
DROP POLICY IF EXISTS "Anyone can insert votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can update votes" ON public.votes;

-- Make increment_vote security definer so it can bypass RLS
CREATE OR REPLACE FUNCTION public.increment_vote(p_sheet_key text, p_row_id text, p_element_box text, p_vote text, p_previous text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_up_delta integer := 0;
  v_down_delta integer := 0;
BEGIN
  IF p_previous = 'up' THEN
    v_up_delta := v_up_delta - 1;
  ELSIF p_previous = 'down' THEN
    v_down_delta := v_down_delta - 1;
  END IF;

  IF p_vote = 'up' THEN
    v_up_delta := v_up_delta + 1;
  ELSIF p_vote = 'down' THEN
    v_down_delta := v_down_delta + 1;
  ELSIF p_vote = 'nullify_up' THEN
    NULL;
  ELSIF p_vote = 'nullify_down' THEN
    NULL;
  END IF;

  INSERT INTO public.votes (sheet_key, row_id, element_box, up_count, down_count)
  VALUES (p_sheet_key, p_row_id, p_element_box,
    GREATEST(0, v_up_delta),
    GREATEST(0, v_down_delta)
  )
  ON CONFLICT (sheet_key, row_id, element_box)
  DO UPDATE SET
    up_count   = GREATEST(0, public.votes.up_count + v_up_delta),
    down_count = GREATEST(0, public.votes.down_count + v_down_delta);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.increment_vote(text, text, text, text, text) TO anon, authenticated;

-- Storytelling sessions: drop public select policy that exposes zoom fields
DROP POLICY IF EXISTS "Public can read published session marketing info" ON public.storytelling_sessions;
