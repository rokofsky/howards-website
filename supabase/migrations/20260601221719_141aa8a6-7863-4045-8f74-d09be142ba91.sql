ALTER FUNCTION public.get_published_storytelling_sessions() SECURITY INVOKER;
ALTER FUNCTION public.increment_vote(text, text, text, text, text) SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.get_published_storytelling_sessions() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_vote(text, text, text, text, text) TO anon, authenticated;