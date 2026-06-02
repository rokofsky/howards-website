CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_cs TEXT NOT NULL,
  excerpt_en TEXT NOT NULL DEFAULT '',
  excerpt_cs TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  content_cs TEXT NOT NULL DEFAULT '',
  category_en TEXT NOT NULL DEFAULT '',
  category_cs TEXT NOT NULL DEFAULT '',
  date_en TEXT NOT NULL DEFAULT '',
  date_cs TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Anyone can read all blog posts (admin)"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert blog posts"
  ON public.blog_posts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update blog posts"
  ON public.blog_posts FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete blog posts"
  ON public.blog_posts FOR DELETE
  TO anon, authenticated
  USING (true);