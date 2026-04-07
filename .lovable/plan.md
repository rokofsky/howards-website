

# Add Edit functionality and hidden admin link

## Changes

### 1. Hidden admin link in Footer (`src/components/Footer.tsx`)
Make the "Howard" text in the footer a clickable link to `/admin/sessions` — looks like normal text, only you know it's a link.

### 2. Add "update" action to edge function (`supabase/functions/admin-sessions/index.ts`)
Add `action === "update"` handler that takes `id` plus updatable fields (`title`, `description`, `session_date`, `zoom_link`, `zoom_meeting_id`) and runs `.update()` on the matching row.

### 3. Add RLS policy for UPDATE on `storytelling_sessions`
The table currently has no UPDATE policy. Add one allowing `anon` role to update, so the service-role edge function can update rows.

### 4. Add Edit mode to admin page (`src/pages/AdminSessions.tsx`)
- Add a pencil (Edit) icon button next to each session's Delete button
- Clicking Edit populates the form with that session's data and switches to "edit mode"
- Button changes to "Update Session" with a Cancel button
- Update calls the edge function with `action: "update"` and the session `id`
- After success, clears form, exits edit mode, refreshes list

### Files modified
- `src/components/Footer.tsx`
- `src/pages/AdminSessions.tsx`
- `supabase/functions/admin-sessions/index.ts`
- New migration for UPDATE RLS policy

