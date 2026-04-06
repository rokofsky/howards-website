

# What's left to build — single implementation step

## Status check
| Item | Done? |
|------|-------|
| 4 secrets (ADMIN_PASSWORD, ZOOM_*) | No — zero stored |
| Admin edge function | No — doesn't exist |
| Admin page UI | No — doesn't exist |
| Route in App.tsx | No — not added |
| INSERT/DELETE RLS policies | No — only SELECT exists |

## What I'll do (all at once)

1. **Store 4 secrets** — ADMIN_PASSWORD, ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET with the values you already gave me. You'll see a prompt to confirm each one.

2. **Migration** — Add INSERT and DELETE RLS policies on `storytelling_sessions` for the `anon` role.

3. **Edge function** `admin-sessions` — POST to create a session, DELETE to remove one. Validates password against ADMIN_PASSWORD secret.

4. **Admin page** at `/admin/sessions` — password gate (remembered per tab), form to add sessions, table to delete them.

5. **Route** — add `/admin/sessions` to App.tsx.

This is the same plan that's been approved three times. The only thing that's blocked it is the secrets approval dialog — you'll need to click "approve" on those prompts when they appear.

