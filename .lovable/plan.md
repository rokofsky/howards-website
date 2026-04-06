

# Complete the Admin Page + Connect Zoom

Two things to finish: (1) build the admin page, and (2) connect Zoom credentials.

## Step 1 — Set secrets
You'll be prompted to enter 4 secrets:
- **ADMIN_PASSWORD** — your chosen password for the admin page
- **ZOOM_ACCOUNT_ID** — from your Zoom Server-to-Server OAuth app
- **ZOOM_CLIENT_ID** — from the same Zoom app
- **ZOOM_CLIENT_SECRET** — from the same Zoom app

## Step 2 — Database: add RLS policies
Add INSERT and DELETE policies on `storytelling_sessions` for the `anon` role (the edge function enforces password checks server-side).

## Step 3 — New edge function: `admin-sessions`
- Accepts POST (create session) and DELETE (delete session)
- Validates password against `ADMIN_PASSWORD` secret
- Uses service role key for database operations

## Step 4 — New page: `src/pages/AdminSessions.tsx`
- Password gate (sessionStorage — enter once per tab)
- Form: title, description, date/time, Zoom link, Zoom Meeting ID
- Table of all sessions with delete buttons
- Not linked from public navigation

## Step 5 — Route in `src/App.tsx`
Add `/admin/sessions` → `AdminSessions`

## Files changed
- `src/pages/AdminSessions.tsx` — new
- `src/App.tsx` — add route
- `supabase/functions/admin-sessions/index.ts` — new
- 1 migration for INSERT + DELETE RLS policies

