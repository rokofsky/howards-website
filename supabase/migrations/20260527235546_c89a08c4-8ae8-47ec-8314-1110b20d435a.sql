
-- 1. Remove permissive public SELECT on storytelling_sessions (zoom_link/zoom_meeting_id leak)
DROP POLICY IF EXISTS "Public can view published sessions" ON public.storytelling_sessions;

-- Add explicit deny SELECT for anon/authenticated; service_role (edge functions) bypasses RLS
CREATE POLICY "Deny public select on storytelling_sessions"
ON public.storytelling_sessions
FOR SELECT
TO anon, authenticated
USING (false);

-- 2. Remove storytelling_sessions from realtime publication (not used in client)
ALTER PUBLICATION supabase_realtime DROP TABLE public.storytelling_sessions;

-- 3. Add explicit deny SELECT/UPDATE/DELETE on webinar_orders for public
CREATE POLICY "Deny public select on webinar_orders"
ON public.webinar_orders
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny public update on webinar_orders"
ON public.webinar_orders
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny public delete on webinar_orders"
ON public.webinar_orders
FOR DELETE
TO anon, authenticated
USING (false);
