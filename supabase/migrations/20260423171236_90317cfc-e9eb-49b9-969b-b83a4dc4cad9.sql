CREATE POLICY "Deny all reads on contact submissions"
ON public.contact_submissions
FOR SELECT
USING (false);