

## Plan: Multiple Feature Updates

This plan covers 6 distinct changes across design, navigation, blog, scroll behavior, and the Storytelling Sessions page.

---

### 1. Darker Glassmorphic Orange Background

**What:** Darken the `--background` CSS variable to a richer, deeper warm orange. Also darken the `--card` variable slightly so the white boxes on detail pages have a subtly darker background while keeping their borders.

**File:** `src/index.css` — adjust `:root` values:
- `--background`: from `30 70% 90%` to approximately `30 55% 82%` (darker warm orange)
- `--card`: from `30 40% 95%` to approximately `30 40% 90%` (slightly tinted)

---

### 2. "HR's book" Link in Header

**What:** Add a new nav item "HR's book" after "References" in the top menu bar. It links externally to the Amazon book page and shows a small book cover thumbnail beside the text.

**Files:**
- Download/save a book cover image to `src/assets/` (from the Amazon listing)
- `src/components/Header.tsx` — add to `navLinks` array a new entry with external URL. Render it as an `<a>` tag (not `<Link>`) with `target="_blank"`. Include a small `<img>` of the book cover (approx 24x32px) inline next to the text.

---

### 3. Blog System (Replace "Latest Insights")

**What:** Turn the static BlogPreview into a proper blog system with individual article pages and room for growth.

**Changes:**
- Rename section heading from "Latest Insights" to "Blog"
- Create a `src/data/blogPosts.ts` data file with the 3 existing posts (title, excerpt, date, slug, content placeholder)
- Make each blog card a `<Link>` to `/blog/:slug`
- Create `src/pages/BlogPost.tsx` — a detail page for individual posts using the Layout component, showing title, date, and content (placeholder text for now)
- Add route `/blog/:slug` in `App.tsx`
- The data file structure makes it easy to add more posts later (just add entries). The grid on the homepage will show up to 6 posts, wrapping naturally in the 3-column grid

---

### 4. Scroll to Top on Service Detail Pages

**What:** When clicking a service card, the detail page should scroll to the top instead of landing mid-page.

**File:** `src/pages/ServiceDetail.tsx` — add a `useEffect` that calls `window.scrollTo(0, 0)` on mount (when slug changes).

---

### 5. Storytelling Sessions Page Overhaul (with Zoom + Supabase)

**What:** Rebuild the `/storytelling-workshops` page into a full session management page with calendar, signup, and Zoom integration.

**Supabase setup (Lovable Cloud):**
- Create a `storytelling_sessions` table: `id`, `session_date` (timestamptz), `zoom_link` (text), `zoom_meeting_id` (text), `created_at`
- Create a `session_signups` table: `id`, `session_id` (FK), `email` (text), `created_at`
- Enable RLS: public can read sessions, public can insert signups

**Edge Function: `create-zoom-meeting`**
- Called when Howard adds a new session date
- Uses Zoom API (requires Zoom OAuth credentials stored as secrets) to create a scheduled meeting
- Returns the Zoom join link which gets stored in the sessions table

**Edge Function: `signup-for-session`**
- Accepts email + session_id
- Inserts signup record
- Adds attendee to Zoom meeting via Zoom API
- Sends the Zoom link to the email (via Lovable email or simple response)

**Page UI (`src/pages/StorytellingWorkshops.tsx`):**
- Header: "Storytelling Sessions"
- Description: "Join us in a round of neighborly storytelling. We come together on Zoom and take turns telling our story, anecdote, joke, whatever, and (if you want) get instant feedback from the others."
- Display upcoming sessions with "Next storytelling session: [date]"
- Calendar component for Howard to pick dates and create new sessions (admin functionality — will need a simple admin check or password)
- Signup form: just an email field + submit button per session
- On signup success: show confirmation with Zoom link

**Zoom API secret:** Will need to request a Zoom API credential (OAuth or Server-to-Server app) from Howard via the secrets tool.

---

### 6. Update Header Button Text

Change the CTA button text from "Storytelling Workshops" to "Storytelling Sessions" and update the link text in the mobile menu and footer accordingly (footer already says "Storytelling Sessions").

---

### Technical Details

**Files created:**
- `src/data/blogPosts.ts`
- `src/pages/BlogPost.tsx`
- `supabase/functions/create-zoom-meeting/index.ts`
- `supabase/functions/signup-for-session/index.ts`

**Files modified:**
- `src/index.css` (background + card colors)
- `src/components/Header.tsx` (book link + button text)
- `src/components/BlogPreview.tsx` (rename heading, use data file, add links)
- `src/pages/ServiceDetail.tsx` (scroll to top)
- `src/pages/StorytellingWorkshops.tsx` (full rewrite)
- `src/App.tsx` (add blog route)

**Migration:**
- Create `storytelling_sessions` and `session_signups` tables with RLS

**Secrets needed:**
- Zoom API credentials (will prompt Howard after infrastructure is ready)

