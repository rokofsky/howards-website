
-- Fix security definer view by recreating with security_invoker
CREATE OR REPLACE VIEW public.storytelling_sessions_public 
WITH (security_invoker = true) AS
SELECT id, title, description, session_date, created_at
FROM public.storytelling_sessions;
