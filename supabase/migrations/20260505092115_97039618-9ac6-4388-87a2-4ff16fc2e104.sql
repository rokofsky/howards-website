
-- Tighten storage.objects policies for reference-scans bucket.
-- Drop any permissive anon/public write policies. Service role (used by the
-- admin edge function) bypasses RLS, so no replacement write policies are
-- needed. Public file URLs still work via the public bucket's CDN endpoint.

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT p.polname
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'storage'
      AND c.relname = 'objects'
      AND (
        pg_get_expr(p.polqual, p.polrelid) ILIKE '%reference-scans%'
        OR pg_get_expr(p.polwithcheck, p.polrelid) ILIKE '%reference-scans%'
      )
      AND p.polcmd IN ('a','w','d','*')  -- INSERT, UPDATE, DELETE, ALL
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.polname);
  END LOOP;
END $$;
