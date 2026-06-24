DROP POLICY IF EXISTS "Anyone can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can delete blog posts" ON public.blog_posts;
REVOKE INSERT, UPDATE, DELETE ON public.blog_posts FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.blog_posts FROM authenticated;