

# Webinar cards grid + admin "Add Webinar" button

## What you'll see
- `/services/online-webinars` shows webinars as cards in a 3-column grid
- Each card: title, description, "Inquire" button that scrolls to the contact form
- A visible "Add Webinar" button below the grid — labeled clearly, navigates to `/admin/webinars`
- Admin page lets you add, edit, and delete webinar cards

## Technical details

### 1. Card grid — `src/pages/ServiceDetail.tsx`
Replace stacked webinar list with responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Each card: title, description, "Inquire" button scrolling to contact form.

### 2. Visible "Add Webinar" button — `src/pages/ServiceDetail.tsx`
A clearly labeled "Add Webinar" button below the card grid, navigating to `/admin/webinars`. Styled as a normal button (not hidden).

### 3. Admin page — `src/pages/AdminWebinars.tsx` (new file)
Password-protected (same pattern as `AdminSessions.tsx`):
- Form with Title + Description to add a new webinar
- Existing webinars shown with Edit/Delete
- Edit populates form, switches to update mode

### 4. Database: `webinars` table + migration
Table: `id`, `slug`, `title`, `description`, `created_at`. RLS: public SELECT, password-protected writes via edge function. Seed 18 existing webinars. After creation, I'll show you how to view and manage this table in Lovable Cloud.

### 5. Data source switch
`ServiceDetail.tsx` and `WebinarDetail.tsx` fetch from database instead of hardcoded file. Full CRUD available from the admin page.

### 6. Route — `src/App.tsx`
Add `/admin/webinars` route.

## Files modified
- `src/pages/ServiceDetail.tsx` — card grid + "Add Webinar" button
- `src/pages/AdminWebinars.tsx` — new file
- `src/pages/WebinarDetail.tsx` — fetch from DB
- `src/App.tsx` — new route
- New migration: create `webinars` table + seed data

