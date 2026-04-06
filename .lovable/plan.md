

# Build Admin Page + Store Secrets — All at Once

Everything will be built in one implementation step.

## What gets built

### 1. Store 4 secrets
- `ADMIN_PASSWORD` = Blazoom1
- `ZOOM_ACCOUNT_ID` = PiAqqAywSTK6G_DdtnE6nA
- `ZOOM_CLIENT_ID` = 3l33aD8Q6OmAtSnhzpdiQ
- `ZOOM_CLIENT_SECRET` = v6UEcix4Enqi1WWxvklCqcFga9V3PiPd

### 2. Database migration
Add INSERT and DELETE RLS policies on `storytelling_sessions` for `anon` role (the edge function uses service role key, but policies are needed for completeness).

### 3. Edge function: `supabase/functions/admin-sessions/index.ts`
- Accepts POST (create) and DELETE (remove) requests
- Validates `password` field against `ADMIN_PASSWORD` secret
- Uses service role key for all DB operations
- Returns session data on success

### 4. New page: `src/pages/AdminSessions.tsx`
- Password prompt on first visit (stored in sessionStorage — lasts until tab closes)
- Form to create sessions: title, description, date/time, Zoom link, Zoom Meeting ID
- Table listing all sessions with delete buttons
- Not linked from any public navigation

### 5. Route in `src/App.tsx`
Add `/admin/sessions` → `AdminSessions`

## Files changed
| File | Action |
|------|--------|
| `supabase/functions/admin-sessions/index.ts` | New |
| `src/pages/AdminSessions.tsx` | New |
| `src/App.tsx` | Add route |
| 1 migration | INSERT + DELETE RLS policies |

## Access
Navigate to `yoursite.com/admin/sessions`, enter your password, and start managing sessions.

