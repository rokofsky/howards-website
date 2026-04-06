

# Storytelling Sessions: Landing Page + Registration Flow

**Cost: 1 credit**

Most of the infrastructure already exists. The work is upgrading the UI and wiring things together properly.

## What exists today
- `storytelling_sessions` table with `id`, `session_date`, `zoom_link`, `zoom_meeting_id`
- `session_signups` table with `session_id`, `email`
- RLS policies allowing public SELECT on sessions and public INSERT on signups
- Edge function `signup-for-session` that saves signup + calls Zoom registrant API
- A basic landing page at `/storytelling-workshops`

## What needs to change

### 1. Database: new `registrations` table
Create a new `registrations` table as requested (separate from existing `session_signups`):
- `id` (uuid, PK)
- `first_name` (text, not null)
- `email` (text, not null)
- `session_title` (text, not null)
- `session_date` (timestamptz, not null)
- `zoom_meeting_id` (text)
- `created_at` (timestamptz, default now())

RLS: public INSERT allowed, no SELECT/UPDATE/DELETE for public.

Also add `title` and `description` columns to `storytelling_sessions` so sessions can display meaningful info on cards.

### 2. Edge Function: rewrite `signup-for-session`
Update to accept `first_name`, `email`, `session_id`. The function will:
- Look up session details (title, date, zoom_meeting_id)
- Insert into `registrations` with all fields
- Call Zoom `POST /meetings/{meetingId}/registrants` with `first_name` and `email`
- Return success with session name and date, or error message
- Keep existing CORS and Zoom S2S OAuth pattern (already correct)

### 3. Secrets: request Zoom credentials
Prompt you to supply `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET` via the secrets tool.

### 4. Frontend: redesign `StorytellingWorkshops.tsx`
- **Card grid**: Replace the current list with a responsive grid of cards, each showing title, formatted date/time (local timezone via `date-fns`), short description, and a "Reserve your spot" CTA button.
- **Registration modal**: Clicking the button opens a Dialog modal with a form for first name and email only. Session title, date, and zoom_meeting_id are passed as hidden context (not shown in the form, not exposing admin details).
- **Submission**: Form calls `supabase.functions.invoke('signup-for-session', ...)` instead of direct DB insert.
- **Success state**: On success, the modal shows "You're registered! Check your email for your Zoom link." with the session name and date. On failure, show an error with a retry option.

### 5. No changes needed
- No admin email exposed anywhere
- No notification to site owner
- Zoom handles confirmation email automatically

## Technical details

```text
User clicks "Reserve your spot"
  → Modal opens (first_name + email form)
  → Submit calls Edge Function
  → Edge Function:
      1. Validates input
      2. Looks up session from storytelling_sessions
      3. INSERT into registrations table
      4. POST to Zoom /meetings/{id}/registrants
      5. Returns { success, session_title, session_date }
  → Modal shows success/error state
```

Files modified:
- `supabase/functions/signup-for-session/index.ts` — rewrite handler
- `src/pages/StorytellingWorkshops.tsx` — card grid + modal UI
- 1 new migration for `registrations` table + `storytelling_sessions` column additions

