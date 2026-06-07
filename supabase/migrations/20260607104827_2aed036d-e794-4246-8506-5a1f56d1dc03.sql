CREATE POLICY "Anyone can insert prompts" ON public.prompts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update prompts" ON public.prompts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete prompts" ON public.prompts FOR DELETE TO anon, authenticated USING (true);
GRANT INSERT, UPDATE, DELETE ON public.prompts TO anon, authenticated;
GRANT ALL ON public.prompts TO service_role;