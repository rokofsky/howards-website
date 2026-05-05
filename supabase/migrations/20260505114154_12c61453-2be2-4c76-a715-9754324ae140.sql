-- Drop any existing write policies on reference-scans (idempotent cleanup)
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT polname FROM pg_policy
    WHERE polrelid = 'storage.objects'::regclass
      AND polname IN (
        'reference-scans deny anon insert',
        'reference-scans deny anon update',
        'reference-scans deny anon delete'
      )
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.polname);
  END LOOP;
END$$;

-- Restrictive policies: deny INSERT/UPDATE/DELETE on reference-scans for non-service roles.
-- Service role bypasses RLS, so edge functions using SUPABASE_SERVICE_ROLE_KEY continue to work.
CREATE POLICY "reference-scans deny anon insert"
ON storage.objects AS RESTRICTIVE
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id <> 'reference-scans');

CREATE POLICY "reference-scans deny anon update"
ON storage.objects AS RESTRICTIVE
FOR UPDATE TO anon, authenticated
USING (bucket_id <> 'reference-scans');

CREATE POLICY "reference-scans deny anon delete"
ON storage.objects AS RESTRICTIVE
FOR DELETE TO anon, authenticated
USING (bucket_id <> 'reference-scans');