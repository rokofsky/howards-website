

# Fix notification email: service in subject + reply-to inquirer

## Changes (one file: `supabase/functions/send-contact-email/index.ts`)

### 1. Subject line includes service
Change the notification subject from `"New inquiry from {name}"` to include the service when present: `"New inquiry: {service} — {name}"`.

### 2. Add reply-to header
Add `reply_to` field to the Resend API payload for notification emails, set to the inquirer's email. Clicking Reply in your inbox will address the inquirer directly.

No other changes needed. Requires redeployment of the edge function.

