

# Admin Page for Storytelling Sessions

A password-protected page at `/admin/sessions` to create and delete storytelling sessions.

## How it works

1. You navigate to `yoursite.com/admin/sessions`
2. A password field appears — enter your admin password
3. Once unlocked (remembered until you close the tab), you see:
   - A form to add new sessions (title, description, date/time, Zoom link, Meeting ID)
   - A list of all sessions (including past ones) with delete buttons
4. Changes appear immediately on the public Storytelling Sessions page

## Steps

### 1. Set up the admin password secret
You'll be prompted to enter your chosen `ADMIN_PASSWORD` — this is stored securely on the server, never in code.

### 2. Database: add RLS policies
Add INSERT and DELETE policies on `storytelling_sessions` for the `anon` role (the edge function will enforce password checks server-side before performing operations).

### 3. New edge function: `admin-sessions`
Handles two actions:
- **create**: validates password, inserts a new session row
- **delete**: validates password, deletes a session by ID

Password is checked against the `ADMIN_PASSWORD` secret. Uses service role key for database operations.

### 4. New page: `src/pages/AdminSessions.tsx`
- Password gate using `sessionStorage` (enter once per tab)
- Create form with fields: title, description, date/time, Zoom link, Zoom Meeting ID
- Table of all sessions with delete button (confirmation before deleting)
- Not linked from any public navigation

### 5. Route: update `src/App.tsx`
Add `/admin/sessions` route pointing to the new page.

### Files changed
- `src/pages/AdminSessions.tsx` — new file
- `src/App.tsx` — add route
- `supabase/functions/admin-sessions/index.ts` — new edge function
- 1 migration for INSERT + DELETE RLS policies on `storytelling_sessions`

