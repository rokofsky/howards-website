
-- Add status column with default 'draft'
ALTER TABLE public.storytelling_sessions
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft'
CHECK (status IN ('draft', 'published'));

-- Recreate the public view to include status (still excludes zoom_link, zoom_meeting_id, created_at)
DROP VIEW IF EXISTS public.storytelling_sessions_public;
CREATE VIEW public.storytelling_sessions_public
WITH (security_invoker=on) AS
SELECT id, session_date, title, description, status
FROM public.storytelling_sessions
WHERE status = 'published';

GRANT SELECT ON public.storytelling_sessions_public TO anon, authenticated;
