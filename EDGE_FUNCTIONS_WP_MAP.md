# Edge Functions → WordPress Migration Map

Scope: every function directory present in `supabase/functions/` plus any function name referenced from `src/` even when the folder is missing. All conclusions are drawn only from files verified in this repository.

## Inventory reconciliation vs. the requested list

Verified by listing `supabase/functions/`:

| Deployed folder | In user's list? |
| --- | --- |
| `admin-keynote-topics` | No — extra, not in prompt |
| `admin-reference-scans` | Yes |
| `admin-sessions` | Yes |
| `admin-webinars` | Yes |
| `cast-vote` | Yes |
| `create-zoom-meeting` | Yes |
| `generate-thumbnails` | Yes |
| `send-contact-email` | Yes |
| `send-webinar-email` | Yes |
| `signup-for-session` | Yes |

Requested but **not present** in `supabase/functions/`:

- `manage-prompt` — no folder, but referenced by `src/components/StorySandbox.tsx` at lines 697, 729, 774 (three `fetch(".../functions/v1/manage-prompt", …)` calls). Classification: **Orphaned deployment reference** — the frontend calls an endpoint whose source is not in this repo (either deleted, deployed out-of-band, or never committed). Callers still exist, so it is not orphaned from the UI side, but there is no code to migrate from here.
- `translate-to-czech` (user spelled `translate-to-Czech`) — no folder, but referenced by `src/pages/AdminWebinars.tsx:50` and `src/pages/RokofAdmin.tsx:42`. Same status as `manage-prompt`: **UI callers exist, no source file in repo**.
- `sheets-proxy` — no folder in `supabase/functions/`, no references anywhere in `src/` (verified via `rg`). **Does not exist in this codebase.**
- `super-responder` — same: no folder, no references. **Does not exist in this codebase.**
- `zoom-webhook` — same: no folder, no references. **Does not exist in this codebase.** (Zoom is called outbound from `create-zoom-meeting` and `signup-for-session`; no inbound webhook handler is present.)

Everything below documents only functions with source in this repo. `manage-prompt`, `translate-to-czech`, `sheets-proxy`, `super-responder`, `zoom-webhook` are addressed again in the retire/rebuild section.

---

## 1. `admin-keynote-topics`  — Admin

1. **Purpose** — CRUD + reorder for the `keynote_topics` table. Actions: `create`, `update`, `reorder`, plus the standard `verify` gate implied by shared HMAC helpers. Source: `supabase/functions/admin-keynote-topics/index.ts`.
2. **Frontend callers** — None verified. `rg -n "admin-keynote-topics|keynote-topics" src/` returns only route/link matches for the public `/keynote-topics` page (`src/App.tsx:235`, `src/components/PricingSection.tsx:134`, `src/pages/ServiceDetail.tsx:469`, `src/hooks/useLanguageRouting.ts:11`). No `functions.invoke("admin-keynote-topics", …)` and no `fetch(".../admin-keynote-topics")` call exists in `src/`.
3. **Database dependencies** — Reads/writes `public.keynote_topics` via service-role client.
4. **External services** — None.
5. **Env vars** — `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
6. **Auth model** — Shared HMAC-signed admin token OR raw `ADMIN_PASSWORD` in body (`isAuthorized` helper).
7. **WP migration** — Not needed as a bespoke REST route: if `keynote_topics` becomes a WP CPT, the built-in `/wp/v2/<cpt>` endpoints + admin UI cover create/update/reorder (reorder via `menu_order`).
8. **Security** — `current_user_can('edit_posts')` (or a custom capability) + REST nonce; no unauthenticated writes.
9. **Migration priority** — **Optional / Retire in place** (no verified UI caller).
10. **Dependencies** — WP CPT for keynote topics must exist first if kept.
11. **Failure impact** — None observable from the app; no page invokes it. The public `/keynote-topics` page reads from the DB, not from this function.
12. **Current usage status** — **Orphaned (no verified callers)**.

## 2. `admin-reference-scans`  — Admin

1. **Purpose** — Upload / list / delete / rename PDF or image scans stored in the `reference-scans` bucket and mirrored in the `reference_scans` table. Source: `supabase/functions/admin-reference-scans/index.ts`.
2. **Frontend callers** — `src/components/admin/ReferenceScansManager.tsx` at lines 78, 103, 119 (three `supabase.functions.invoke("admin-reference-scans", …)`).
3. **Database dependencies** — Table `public.reference_scans`; Storage bucket `reference-scans` (upload/remove).
4. **External services** — None.
5. **Env vars** — `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
6. **Auth model** — Plain `ADMIN_PASSWORD` in body (no HMAC token path here — verified in `index.ts`).
7. **WP migration** — Custom REST route `POST /rokof/v1/reference-scans` backed by WP Media Library (attachments) + a CPT or options row storing slot metadata; delete/list mirror WP media handlers.
8. **Security** — `current_user_can('upload_files')` + REST nonce; enforce MIME allow-list (PDF/JPG/PNG/WEBP — already done in code) and max size server-side.
9. **Migration priority** — **Must migrate** (admin feature actively used).
10. **Dependencies** — WP media library + slot-mapping storage (CPT or option) must exist first.
11. **Failure impact** — Admin cannot upload/replace/delete reference scans; public `/references` viewer keeps working against already-migrated files.
12. **Current usage status** — **Active**.

## 3. `admin-sessions`  — Admin

1. **Purpose** — Admin gate + CRUD for `storytelling_sessions`. Actions include `verify` (issues an HMAC token used by other admin functions), `list`, `create`, `update`, and (per file structure) additional session mutations. Source: `supabase/functions/admin-sessions/index.ts`.
2. **Frontend callers** — `src/lib/adminAuth.ts:59` (`invoke("admin-sessions", …)`). This is the shared admin sign-in helper used by the admin surface. Also referenced from `supabase/functions/create-zoom-meeting/index.ts` (comment noting the pattern is copied) — not a runtime call.
3. **Database dependencies** — `public.storytelling_sessions`.
4. **External services** — None directly (Zoom is a separate function).
5. **Env vars** — `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
6. **Auth model** — HMAC-signed token (30-day max age) or `ADMIN_PASSWORD` in body; `verify` action mints the token consumed by `admin-webinars`, `admin-keynote-topics`, `create-zoom-meeting`.
7. **WP migration** — Replace token issuance with the native WP login/nonce system. Sessions become a CPT with meta for `session_date`, `zoom_link`, `zoom_meeting_id`, `status`; CRUD via `/wp/v2/<cpt>` or a small custom route.
8. **Security** — Rely on `wp_get_current_user()` + `current_user_can`; no HMAC needed. REST nonce on writes.
9. **Migration priority** — **Must migrate** — it is the admin auth entry point.
10. **Dependencies** — WP user with the intended admin capability; session CPT/schema.
11. **Failure impact** — Entire admin console unusable: `adminAuth.ts` can't verify, downstream admin functions that accept the issued token also break.
12. **Current usage status** — **Active**.

## 4. `admin-webinars`  — Admin

1. **Purpose** — CRUD + reorder for the `webinars` table (`create`, `update`, `reorder`, `delete`). Source: `supabase/functions/admin-webinars/index.ts`.
2. **Frontend callers** — `src/pages/ServiceDetail.tsx:92` (`invoke("admin-webinars", …)`). Note: `src/pages/AdminWebinars.tsx` also exists but its only external `fetch` in the searched set is to `translate-to-czech`; if it hits `admin-webinars`, it does so only via imports not surfaced by the `rg` on that literal.
3. **Database dependencies** — `public.webinars`.
4. **External services** — None.
5. **Env vars** — `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
6. **Auth model** — Same shared HMAC token / password pattern (`isAuthorized`).
7. **WP migration** — Webinars as a CPT; native `/wp/v2/<cpt>` for create/update/delete, `menu_order` for reorder. Slug generation mirrors WP's `sanitize_title` — drop the custom slugifier.
8. **Security** — `current_user_can('edit_posts')` (or custom cap) + REST nonce.
9. **Migration priority** — **Must migrate**.
10. **Dependencies** — Webinar CPT exists; admin auth (`admin-sessions` replacement) in place.
11. **Failure impact** — Admin cannot manage webinar catalog; public webinar pages continue rendering existing data.
12. **Current usage status** — **Active**.

## 5. `cast-vote`  — Public API

1. **Purpose** — Records upvote/downvote/nullify on Story Sandbox rows via the `increment_vote` RPC. Source: `supabase/functions/cast-vote/index.ts`.
2. **Frontend callers** — `src/components/StorySandbox.tsx:593` (`fetch(".../functions/v1/cast-vote", …)`).
3. **Database dependencies** — RPC `public.increment_vote` (declared in `<db-functions>`); underlying table `public.votes`.
4. **External services** — None.
5. **Env vars** — `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
6. **Auth model** — Public, unauthenticated. Only field-shape validation (`VALID_VOTES`).
7. **WP migration** — Custom REST route `POST /rokof/v1/vote` writing to a custom `$wpdb` table (or transient counters). Given `DATABASE_REFERENCE.md` recommends not migrating vote data, this endpoint may not need to exist post-migration.
8. **Security** — Add server-side rate limiting (IP + row_id), REST nonce for logged-in users, and a bot check (hCaptcha) — none exist today.
9. **Migration priority** — **Optional** (retire together with Story Sandbox voting if the feature is dropped; otherwise migrate later).
10. **Dependencies** — Story Sandbox feature retained in WP; replacement vote store.
11. **Failure impact** — Story Sandbox voting silently fails (fetch rejects); browsing the sandbox still works.
12. **Current usage status** — **Active**.

## 6. `create-zoom-meeting`  — Admin

1. **Purpose** — Admin-only helper that mints a Zoom S2S OAuth token, creates a Zoom meeting, PATCHes it to require registration, then re-reads it to return `registration_url`. Source: `supabase/functions/create-zoom-meeting/index.ts`.
2. **Frontend callers** — `src/pages/AdminSessions.tsx:95` (`invoke("create-zoom-meeting", …)`).
3. **Database dependencies** — None directly (the returned URL is stored back on `storytelling_sessions` by the admin UI via `admin-sessions`).
4. **External services** — Zoom (`https://zoom.us/oauth/token`, `https://api.zoom.us/v2/users/me/meetings`, PATCH + GET on the meeting).
5. **Env vars** — `ADMIN_PASSWORD`, `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`.
6. **Auth model** — HMAC admin token OR raw `ADMIN_PASSWORD` in body (inline copy of the helper).
7. **WP migration** — Admin-only REST route `POST /rokof/v1/zoom/meetings` in a plugin; keep Zoom S2S credentials in encrypted options or `wp-config.php` constants.
8. **Security** — `current_user_can('manage_options')` + REST nonce; never expose Zoom secrets client-side.
9. **Migration priority** — **Must migrate** (admin cannot create sessions with a Zoom link otherwise).
10. **Dependencies** — WP admin auth; Zoom credentials copied to the new secret store; `storytelling_sessions` CPT to receive the returned meeting info.
11. **Failure impact** — Admin can still create sessions manually with a pasted Zoom link, but auto-provisioning breaks.
12. **Current usage status** — **Active**.

## 7. `generate-thumbnails`  — Background job

1. **Purpose** — Batch renders page-1 PNG thumbnails for every `reference_scans` row that lacks one, using `npm:mupdf`, and stores them under `reference-scans/thumbnails/`. Source: `supabase/functions/generate-thumbnails/index.ts`.
2. **Frontend callers** — None. `rg -n "generate-thumbnails|generate_thumbnails" src/` returns nothing.
3. **Database dependencies** — Table `public.reference_scans` (read `pdf_path`, update `thumbnail_path`); Storage bucket `reference-scans` (download PDFs, upload PNG thumbnails).
4. **External services** — None (mupdf runs in the function).
5. **Env vars** — `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
6. **Auth model** — Password-in-body admin gate (per file header comments and same pattern as other admins). Invoked manually — no cron declared in `supabase/config.toml` (verified: only one config file exists).
7. **WP migration** — WP-CLI command or scheduled `wp_cron` event: `wp rokof generate-thumbnails`; PDF rendering via `Imagick` (`Imagick::readImage($pdf . '[0]')`) or Ghostscript.
8. **Security** — CLI: rely on shell auth. REST: `current_user_can('manage_options')` + nonce.
9. **Migration priority** — **Can migrate later** (one-off / operator-invoked utility; thumbnails already generated survive migration if the bucket is copied).
10. **Dependencies** — Reference scans migrated to WP media; PDF renderer installed on host.
11. **Failure impact** — New PDFs uploaded post-migration have no thumbnail on `/references`; existing thumbnails keep working.
12. **Current usage status** — **Legacy (still referenced)** — no frontend caller, but operationally needed after uploads. If it is never run manually anymore, downgrade to **Migration candidate for retirement**.

## 8. `send-contact-email`  — Public API

1. **Purpose** — Sends inquiry notification to `info@rokofsky.com` and a bilingual copy to the visitor, using Resend. Source: `supabase/functions/send-contact-email/index.ts`.
2. **Frontend callers** — `src/components/ContactForm.tsx:198` (`invoke("send-contact-email", …)`).
3. **Database dependencies** — Writes are done from `ContactForm` itself to `public.contact_submissions`; the function is email-only (no DB writes verified in the excerpt shown; extend if additional actions exist).
4. **External services** — Resend (`https://api.resend.com/emails`).
5. **Env vars** — `RESEND_API_KEY` (and, if verified elsewhere in the file, `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` for anti-abuse lookups — pattern used in `send-webinar-email`).
6. **Auth model** — Public. Relies on frontend validation + Resend rate limits. No HMAC or shared secret verified for this endpoint.
7. **WP migration** — Custom REST route `POST /rokof/v1/contact` using `wp_mail()` with an SMTP plugin, or keep Resend via `WP HTTP API` + a stored key.
8. **Security** — Add honeypot + Cloudflare Turnstile/hCaptcha; server-side rate limit per IP; enforce email regex (already done); sanitize with `wp_kses`.
9. **Migration priority** — **Must migrate** (primary conversion path from public site).
10. **Dependencies** — SMTP or Resend transport in WP; contact-submissions table/CPT if history is kept.
11. **Failure impact** — Contact form silently or visibly errors; no lead notifications reach Howard.
12. **Current usage status** — **Active**.

## 9. `send-webinar-email`  — Public API

1. **Purpose** — Two-mail flow (confirmation to customer + notification to `howard@rokofsky.com`) after a webinar order, gated by shared-secret + a recent `webinar_orders` row for the same email. Source: `supabase/functions/send-webinar-email/index.ts`.
2. **Frontend callers** — `src/components/WebinarOrderForm.tsx:165` (`invoke("send-webinar-email", …)`).
3. **Database dependencies** — Reads `public.webinar_orders` (`select id … eq customer_email … gte created_at`) to enforce the 10-minute abuse window; no writes.
4. **External services** — Resend.
5. **Env vars** — `RESEND_API_KEY`, `WEBINAR_FORM_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
6. **Auth model** — Shared `WEBINAR_FORM_SECRET` posted in body + recency check against `webinar_orders`.
7. **WP migration** — Custom REST route `POST /rokof/v1/webinar-notify` that runs on the `save_post`/order-insert hook instead of a separate call, eliminating the need for the shared secret.
8. **Security** — Rotate the shared secret if kept; add per-IP rate limit; validate email server-side (already done); `wp_kses` on user-supplied strings.
9. **Migration priority** — **Must migrate** (part of paid-inquiry path).
10. **Dependencies** — `webinar_orders` storage (or its WP replacement); Resend/SMTP transport; front-end order form pointing at the new route.
11. **Failure impact** — Customer receives no confirmation; Howard receives no order notification (order row still exists if `WebinarOrderForm` writes it separately, but nobody is alerted).
12. **Current usage status** — **Active**.

## 10. `signup-for-session`  — Public API

1. **Purpose** — Validates input, calls Zoom S2S OAuth, registers the participant against the meeting's `/registrants` endpoint, tolerates "already registered" (code 200) and "registration disabled" (codes 3001/3027/404), then inserts a row into `public.registrations`. Source: `supabase/functions/signup-for-session/index.ts`.
2. **Frontend callers** — `src/pages/StorytellingWorkshops.tsx:81` (`invoke("signup-for-session", …)`).
3. **Database dependencies** — Reads `public.storytelling_sessions` (by id); inserts into `public.registrations`. (`session_signups` is NOT written here — see `DATABASE_REFERENCE.md`.) A related migration file is referenced: `supabase/migrations/20260526160434_….sql`.
4. **External services** — Zoom OAuth + Zoom Meetings API (`/oauth/token`, `/v2/meetings/{id}/registrants`).
5. **Env vars** — `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
6. **Auth model** — Public. Only shape validation + UUID regex on `session_id`.
7. **WP migration** — Custom REST route `POST /rokof/v1/session-signup` doing the same Zoom OAuth + registrant call server-side; write registration into a custom table or CPT.
8. **Security** — Add rate limit (per IP + per email), captcha, and stricter email verification; keep Zoom secrets server-side only.
9. **Migration priority** — **Must migrate** (public sign-up path for storytelling sessions).
10. **Dependencies** — Sessions CPT/table exists with `zoom_meeting_id`; Zoom credentials in WP; registrations storage.
11. **Failure impact** — Visitors on `/storytelling-workshops` cannot register; Howard loses public-session pipeline.
12. **Current usage status** — **Active**.

---

## Summary table

| # | Function | Category | Callers verified | Zoom | Resend | DB / Storage | Auth | Status | Priority |
| - | -------- | -------- | ---------------- | ---- | ------ | ------------ | ---- | ------ | -------- |
| 1 | admin-keynote-topics | Admin | None | – | – | `keynote_topics` | HMAC/password | Orphaned | Optional / Retire |
| 2 | admin-reference-scans | Admin | `ReferenceScansManager.tsx` | – | – | `reference_scans`, bucket `reference-scans` | Password | Active | Must migrate |
| 3 | admin-sessions | Admin | `src/lib/adminAuth.ts` | – | – | `storytelling_sessions` | HMAC/password, issues token | Active | Must migrate |
| 4 | admin-webinars | Admin | `ServiceDetail.tsx` | – | – | `webinars` | HMAC/password | Active | Must migrate |
| 5 | cast-vote | Public API | `StorySandbox.tsx` | – | – | RPC `increment_vote` → `votes` | Public | Active | Optional |
| 6 | create-zoom-meeting | Admin | `AdminSessions.tsx` | Yes | – | – | HMAC/password | Active | Must migrate |
| 7 | generate-thumbnails | Background job | None (operator only) | – | – | `reference_scans`, bucket `reference-scans` | Password | Legacy (still referenced) | Can migrate later |
| 8 | send-contact-email | Public API | `ContactForm.tsx` | – | Yes | none verified | Public | Active | Must migrate |
| 9 | send-webinar-email | Public API | `WebinarOrderForm.tsx` | – | Yes | `webinar_orders` (read) | Shared secret + recency | Active | Must migrate |
| 10 | signup-for-session | Public API | `StorytellingWorkshops.tsx` | Yes | – | `storytelling_sessions`, `registrations` | Public | Active | Must migrate |

---

## Recommended migration execution order

1. **Foundations in WP first** (no function code yet): create the CPTs / custom tables for storytelling sessions, webinars, keynote topics, reference scans metadata, registrations, and webinar orders (see `DATABASE_REFERENCE.md`). Copy Zoom + Resend secrets into WP.
2. **`admin-sessions` replacement** — WP already has auth; simply re-implement the CRUD used by `src/lib/adminAuth.ts`. This unlocks every other admin call because it currently issues the HMAC token.
3. **`create-zoom-meeting`** — depends on step 2 (admin auth) and Zoom creds; ships together with the sessions admin UI.
4. **`admin-webinars`** and **`admin-keynote-topics` (only if kept)** — trivial CRUD after step 2.
5. **`admin-reference-scans`** — needs WP media library + slot storage in place.
6. **`generate-thumbnails`** — can follow step 5; safe to migrate later or replace with an on-upload hook.
7. **`signup-for-session`** — public path; depends on sessions data + Zoom creds already migrated.
8. **`send-contact-email`** — independent; migrate whenever the contact form is cut over.
9. **`send-webinar-email`** — depends on `webinar_orders` storage; ideally fold into the order-insert hook so the shared secret disappears.
10. **`cast-vote`** — last; only if Story Sandbox voting is kept.

---

## Retire instead of rebuild

- **`admin-keynote-topics`** — no verified caller in `src/`; retire unless the operator confirms an unlisted admin surface uses it.
- **`generate-thumbnails`** — candidate for retirement if thumbnails are generated inline on upload in WP; keep only as a one-off backfill script.
- **`cast-vote`** — retire together with Story Sandbox voting; `DATABASE_REFERENCE.md` already recommends not migrating vote data.
- **`manage-prompt`** — no source in repo; if the Story Sandbox authoring surface is not being kept, remove the three `fetch` calls in `StorySandbox.tsx` (lines 697, 729, 774) and drop the endpoint entirely.
- **`translate-to-czech`** — no source in repo; if bilingual editing moves to WPML/Polylang in WP, delete the two frontend calls (`AdminWebinars.tsx:50`, `RokofAdmin.tsx:42`) instead of rebuilding.
- **`sheets-proxy`, `super-responder`, `zoom-webhook`** — not present in this codebase and not referenced by `src/`. Nothing to migrate or retire on this side; confirm with the operator that no external deployment relies on names by those spellings before considering the topic closed.
