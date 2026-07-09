-- Explicit restrictive SELECT policy to prevent reading session signup emails
CREATE POLICY "No public read access to session signups"
ON public.session_signups
FOR SELECT
USING (false);