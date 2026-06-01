CREATE TABLE public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_key text NOT NULL,
  character text,
  incident text,
  constraint_text text,
  setting text,
  prompt text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_prompts_sheet_key ON public.prompts(sheet_key);

GRANT SELECT ON public.prompts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO service_role;

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prompts"
ON public.prompts
FOR SELECT
TO anon, authenticated
USING (true);