ALTER TABLE public.webinars ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY title ASC) - 1 AS rn
  FROM public.webinars
)
UPDATE public.webinars SET sort_order = numbered.rn FROM numbered WHERE webinars.id = numbered.id;