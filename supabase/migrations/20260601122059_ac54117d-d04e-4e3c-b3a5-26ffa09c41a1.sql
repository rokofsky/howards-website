
CREATE OR REPLACE FUNCTION increment_vote(
  p_sheet_key text,
  p_row_id text,
  p_element_box text,
  p_vote text,
  p_previous text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_up_delta integer := 0;
  v_down_delta integer := 0;
BEGIN
  -- Compute deltas based on previous vote state
  IF p_previous = 'up' THEN
    v_up_delta := v_up_delta - 1;
  ELSIF p_previous = 'down' THEN
    v_down_delta := v_down_delta - 1;
  END IF;

  IF p_vote = 'up' THEN
    v_up_delta := v_up_delta + 1;
  ELSIF p_vote = 'down' THEN
    v_down_delta := v_down_delta + 1;
  ELSIF p_vote = 'nullify_up' THEN
    -- already subtracted up above; nothing else to add
    NULL;
  ELSIF p_vote = 'nullify_down' THEN
    -- already subtracted down above; nothing else to add
    NULL;
  END IF;

  INSERT INTO public.votes (sheet_key, row_id, element_box, up_count, down_count)
  VALUES (p_sheet_key, p_row_id, p_element_box,
    GREATEST(0, v_up_delta),
    GREATEST(0, v_down_delta)
  )
  ON CONFLICT (sheet_key, row_id, element_box)
  DO UPDATE SET
    up_count   = GREATEST(0, public.votes.up_count + v_up_delta),
    down_count = GREATEST(0, public.votes.down_count + v_down_delta);
END;
$$;

GRANT EXECUTE ON FUNCTION increment_vote TO anon;
GRANT EXECUTE ON FUNCTION increment_vote TO authenticated;
