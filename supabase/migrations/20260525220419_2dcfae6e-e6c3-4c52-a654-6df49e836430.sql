ALTER VIEW public.storytelling_sessions_public SET (security_invoker = off);
GRANT SELECT ON public.storytelling_sessions_public TO anon, authenticated;