
-- Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('reference-scans', 'reference-scans', true)
ON CONFLICT (id) DO NOTHING;

-- Public read on bucket objects
CREATE POLICY "Public can read reference-scans"
ON storage.objects FOR SELECT
USING (bucket_id = 'reference-scans');

-- Table
CREATE TABLE public.reference_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_number integer NOT NULL UNIQUE CHECK (slot_number >= 1 AND slot_number <= 80),
  pdf_path text NOT NULL,
  title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reference_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reference scans"
ON public.reference_scans FOR SELECT
USING (true);

-- No insert/update/delete policies => only service role can mutate

CREATE INDEX idx_reference_scans_slot ON public.reference_scans(slot_number);
