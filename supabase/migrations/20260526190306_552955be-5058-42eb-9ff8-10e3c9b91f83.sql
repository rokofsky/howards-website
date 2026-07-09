ALTER TABLE public.webinar_orders 
  ADD COLUMN IF NOT EXISTS session_ids uuid[],
  ADD COLUMN IF NOT EXISTS chosen_dates text[],
  ALTER COLUMN chosen_date DROP NOT NULL;