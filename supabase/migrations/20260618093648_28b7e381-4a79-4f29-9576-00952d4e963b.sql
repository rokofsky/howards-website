-- Blog posts: restrict broad read to authenticated only
DROP POLICY IF EXISTS "Anyone can read all blog posts (admin)" ON public.blog_posts;
CREATE POLICY "Authenticated can read all blog posts"
  ON public.blog_posts FOR SELECT TO authenticated USING (true);

-- Keynote topics: remove broad authenticated write policies; writes happen via service-role edge function
DROP POLICY IF EXISTS "Authenticated can insert keynote topics" ON public.keynote_topics;
DROP POLICY IF EXISTS "Authenticated can update keynote topics" ON public.keynote_topics;
DROP POLICY IF EXISTS "Authenticated can delete keynote topics" ON public.keynote_topics;

REVOKE INSERT, UPDATE, DELETE ON public.keynote_topics FROM authenticated;