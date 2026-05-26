## Plan: Set `security_invoker = true` on flagged views

### Scope
Only the view `public.storytelling_sessions_public` exists in this project. The security scanner is still flagging it as SECURITY DEFINER, so re-apply the `security_invoker` setting explicitly.

### Change
Run a migration that does:

```sql
ALTER VIEW public.storytelling_sessions_public SET (security_invoker = true);
```

### Not touched
- No RLS policies modified
- No table structures changed
- No column changes to the view
- No grants changed

### Verification
After the migration, re-run the security scan to confirm the SECURITY DEFINER warning clears.