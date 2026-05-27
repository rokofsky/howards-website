ALTER TABLE public.storytelling_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.storytelling_sessions;