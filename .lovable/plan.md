

# Wire up contact form emails via Resend

## Overview

Create the database table, an edge function that sends emails via Resend, and update the contact form to save submissions and trigger emails. Uses the already-configured `RESEND_API_KEY` and sender `info@rokofsky.com`.

## Steps

### 1. Database migration: `contact_submissions` table

Create table with fields: `id` (uuid PK), `name`, `email`, `message`, `service`, `company_name`, `group_size`, `preferred_dates`, `project_type`, `timeline`, `copy_to_me` (boolean), `created_at`. Public insert RLS policy (no auth required, since this is a public contact form).

### 2. Edge function: `send-contact-email`

New function at `supabase/functions/send-contact-email/index.ts`:
- Accepts JSON body with form fields + `type` ("notification" or "copy")
- **Notification email** (always sent): to `info@rokofsky.com`, from `info@rokofsky.com`, contains all form details (name, email, message, service, company, group size, timeline)
- **Copy email** (when "Send me a copy" checked): to submitter's email, from `info@rokofsky.com`, confirms receipt and includes their message back to them
- Calls Resend API directly using the `RESEND_API_KEY` secret
- HTML templates inline with warm earthy styling matching the site (terracotta accents, Inter font)
- Input validation with early return on bad data

### 3. Update `ContactForm.tsx`

Replace the current no-op `handleSubmit` with:
1. Set loading state
2. Generate UUID, insert into `contact_submissions`
3. Invoke `send-contact-email` with type "notification"
4. If `copyToMe` checked, invoke again with type "copy"
5. Show success or error toast
6. Keep the existing success UI on completion

### Files changed
- New migration SQL — `contact_submissions` table + public insert RLS
- `supabase/functions/send-contact-email/index.ts` — new edge function
- `src/components/ContactForm.tsx` — wire up real submit logic

