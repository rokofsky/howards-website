

# Inline inquiry form per webinar card + password-protect "Add Webinar"

## What you'll see

- Clicking "Inquire" on a webinar card expands an animated contact form directly below that card (no page navigation)
- Only one card's form is open at a time — clicking another closes the previous
- The bottom `#inquiry-form` stays for general inquiries
- "Add Webinar" button uses the same password as the storytelling admin (shared `sessionStorage` key `admin_auth`)
- **Wrong password: 2 attempts allowed, then redirect to homepage**

## Technical details

### File: `src/pages/ServiceDetail.tsx`

**Inline inquiry form**
- Add `expandedWebinar` state (slug or null) to track which card's form is open
- On "Inquire" click, toggle `expandedWebinar`
- Below the clicked card, render `<ContactForm serviceName={webinar.title} showServiceFields />` wrapped in `AnimatePresence` + `motion.div` for slide-down + fade animation

**Password-protect "Add Webinar" button**
- Add states: `showPasswordPrompt`, `adminPassword`, `attempts` (starts at 0)
- On click: check `sessionStorage.getItem("admin_auth") === "true"` → navigate to `/admin/webinars`
- If not authenticated: show inline password input + submit button
- On submit: call `admin-webinars` edge function with `action: "verify"`
  - Correct → save to `sessionStorage`, navigate to `/admin/webinars`
  - Wrong → increment `attempts`, show error toast. If `attempts >= 2`, redirect to `/` immediately

### File: `src/pages/AdminWebinars.tsx`
- Same 2-attempt limit on the login screen: track failed attempts, redirect to `/` after 2 wrong tries (using `useNavigate`)

### Files changed
- `src/pages/ServiceDetail.tsx`
- `src/pages/AdminWebinars.tsx`

