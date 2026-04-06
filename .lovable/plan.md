
# Fix Zoom signup so it actually registers people before showing success

## What I found
- Your workshops page currently shows success as long as the backend reaches the end of `signup-for-session`.
- The function inserts a local registration first, then tries Zoom, but it does not check whether Zoom actually accepted the registrant.
- It also swallows Zoom failures in a nested `try/catch`, so the user sees success even when Zoom rejected the request.
- In your session data, one newer record uses:
  - `zoom_link` = a Zoom registration URL
  - `zoom_meeting_id` = `841 4676 3709` with spaces
- That means the system is mixing two different Zoom concepts:
  - **Meeting link** = join link
  - **Registration link** = Zoom-hosted signup page
- For API-based registration, the app should use the **meeting ID** and let Zoom generate/send the confirmation email. The registration link should not be used as the join link field.

## Answer to your question
Use the **meeting ID** for backend registration.
- If you want this site’s signup form to register people automatically in Zoom, store:
  - **Zoom Meeting ID** = the meeting’s numeric ID
  - **Zoom Link** = the actual meeting join link
- Do **not** use the Zoom registration page URL as the join link value for this flow.

## What I will change

### 1. Make `signup-for-session` fail unless Zoom registration succeeds
Update the function so it:
- normalizes the meeting ID by removing spaces/non-digits
- checks the Zoom token response status
- checks the Zoom registrant response status
- reads and logs Zoom error bodies
- returns an error instead of success when Zoom rejects the signup
- only writes to `registrations` after Zoom confirms the registrant was created

### 2. Handle misconfigured sessions clearly
If a session has:
- no meeting ID
- an invalid meeting ID
- only a registration URL but no usable meeting ID

the function should return a clear message such as:
- “This session is not configured correctly yet.”
- “Zoom meeting ID is invalid.”

### 3. Prevent bad admin input going forward
Update the admin flow so when you save a session:
- meeting IDs are sanitized before storing
- the form labels make the distinction clearer:
  - “Zoom join link”
  - “Zoom meeting ID”
- optionally add helper text telling you not to paste the Zoom registration URL into the join-link field unless you intentionally want to send users there manually

### 4. Improve frontend feedback
Update `/storytelling-workshops` so the user sees the real error from the backend instead of the generic “Registration failed.”
That way if Zoom says:
- already registered
- invalid meeting
- registration disabled for this meeting

the page shows the actual reason.

## Important Zoom-side check
There is one likely Zoom setting issue to verify:
- the meeting must allow registration through the Zoom API
- if registration is disabled for that meeting, Zoom will reject registrants even with the correct meeting ID

So the app fix should include returning the exact Zoom error, because that will tell us whether the problem is:
- wrong meeting ID format
- wrong link type
- registration not enabled in Zoom
- duplicate email already registered

## Files to update
- `supabase/functions/signup-for-session/index.ts`
- `supabase/functions/admin-sessions/index.ts`
- `src/pages/AdminSessions.tsx`
- `src/pages/StorytellingWorkshops.tsx`

## Expected result
After this fix:
- no one sees a success card unless Zoom registration actually completed
- registrants should appear in your Zoom registrant list
- Zoom should send its own email when the meeting is configured correctly
- if something is wrong, the app will tell you exactly what Zoom rejected instead of failing silently
