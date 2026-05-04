-- Registrations: explicit deny for all public access
CREATE POLICY "Deny public select on registrations"
ON public.registrations FOR SELECT TO public USING (false);

CREATE POLICY "Deny public insert on registrations"
ON public.registrations FOR INSERT TO public WITH CHECK (false);

CREATE POLICY "Deny public update on registrations"
ON public.registrations FOR UPDATE TO public USING (false) WITH CHECK (false);

CREATE POLICY "Deny public delete on registrations"
ON public.registrations FOR DELETE TO public USING (false);

-- Storytelling sessions: deny public writes (reads already denied)
CREATE POLICY "Deny public insert on storytelling_sessions"
ON public.storytelling_sessions FOR INSERT TO public WITH CHECK (false);

CREATE POLICY "Deny public update on storytelling_sessions"
ON public.storytelling_sessions FOR UPDATE TO public USING (false) WITH CHECK (false);

CREATE POLICY "Deny public delete on storytelling_sessions"
ON public.storytelling_sessions FOR DELETE TO public USING (false);

-- Session signups: ensure explicit deny for writes too
CREATE POLICY "Deny public insert on session_signups"
ON public.session_signups FOR INSERT TO public WITH CHECK (false);

CREATE POLICY "Deny public update on session_signups"
ON public.session_signups FOR UPDATE TO public USING (false) WITH CHECK (false);

CREATE POLICY "Deny public delete on session_signups"
ON public.session_signups FOR DELETE TO public USING (false);