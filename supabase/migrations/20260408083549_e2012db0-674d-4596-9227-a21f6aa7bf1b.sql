
-- Remove public INSERT on registrations (edge function uses service role key)
DROP POLICY IF EXISTS "Anyone can register" ON public.registrations;

-- Remove public INSERT on session_signups (edge function uses service role key)
DROP POLICY IF EXISTS "Anyone can sign up" ON public.session_signups;

-- Remove public INSERT on contact_submissions (will be routed through edge function)
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
