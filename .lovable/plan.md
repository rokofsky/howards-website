

# Fix: New sessions not appearing after admin creation

## Root cause
The edge function routes by HTTP method (`req.method`), but `supabase.functions.invoke` may not reliably forward custom methods in all environments. Both "verify" and "create" arrive as POST — the create path *should* work, but there's no clear feedback if it silently fails.

## Fix (single step)

### 1. Edge function — route by `action` field instead of HTTP method
Change `admin-sessions` to use `body.action` for routing:
- `action: "verify"` → password check (already works)
- `action: "create"` → insert session
- `action: "delete"` → delete session

This eliminates any ambiguity about HTTP methods.

### 2. Admin page — send `action` field in all requests
- `handleCreate`: add `action: "create"` to body
- `handleDelete`: add `action: "delete"` to body, switch from `method: "DELETE"` to `method: "POST"`
- Add better error feedback: check `res.data?.error` in addition to `res.error`

### Files changed
| File | Change |
|------|--------|
| `supabase/functions/admin-sessions/index.ts` | Route by `action` field |
| `src/pages/AdminSessions.tsx` | Add `action` to request bodies, improve error handling |

