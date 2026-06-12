CREATE TABLE public.keynote_topics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.keynote_topics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.keynote_topics TO authenticated;
GRANT ALL ON public.keynote_topics TO service_role;

ALTER TABLE public.keynote_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active keynote topics"
  ON public.keynote_topics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert keynote topics"
  ON public.keynote_topics FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update keynote topics"
  ON public.keynote_topics FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete keynote topics"
  ON public.keynote_topics FOR DELETE TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_keynote_topics_updated_at
  BEFORE UPDATE ON public.keynote_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();