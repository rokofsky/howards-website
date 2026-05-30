CREATE TABLE public.votes (
  sheet_key TEXT NOT NULL,
  row_id TEXT NOT NULL,
  element_box TEXT NOT NULL,
  up_count INTEGER NOT NULL DEFAULT 0,
  down_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (sheet_key, row_id, element_box)
);

GRANT SELECT, INSERT, UPDATE ON public.votes TO anon;
GRANT SELECT, INSERT, UPDATE ON public.votes TO authenticated;
GRANT ALL ON public.votes TO service_role;

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes" ON public.votes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert votes" ON public.votes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update votes" ON public.votes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);