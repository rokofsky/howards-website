

# Update Zoom Credentials

The edge function logs confirm `"Invalid client_id or client_secret"` — the stored values are stale.

## What I'll do

Update two secrets with your new Zoom Server-to-Server OAuth app credentials:

| Secret | New Value |
|--------|-----------|
| `ZOOM_CLIENT_ID` | `yQ8u4hiMQFux4RxTColasw` |
| `ZOOM_CLIENT_SECRET` | `63auofGJEjWUeU9b5IQxoclzkXZQZHFW` |

No code changes needed. After this, the signup edge function should authenticate with Zoom successfully.

## After the update

Test end-to-end:
1. Go to `/admin/sessions` and verify a session has a numeric Zoom meeting ID
2. Go to `/storytelling-workshops` and register with your email
3. Check the Zoom meeting's registrant list to confirm the name appears
4. Check your inbox for Zoom's confirmation email

