CREATE TABLE public.webinar_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    chosen_date text NOT NULL,
    created_at timestamptz DEFAULT now()
);

GRANT INSERT ON public.webinar_orders TO anon;
GRANT INSERT ON public.webinar_orders TO authenticated;
GRANT ALL ON public.webinar_orders TO service_role;

ALTER TABLE public.webinar_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert webinar orders"
ON public.webinar_orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);