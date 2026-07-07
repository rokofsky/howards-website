# Database Reference — WordPress Migration Handover

Read-only reference for eight Supabase tables used by this application.

**Method.** Column lists are taken verbatim from the generated Supabase types file (`src/integrations/supabase/types.ts`). Read/write maps and business rules come from `rg` searches across `src/**` and `supabase/functions/**` and cite the files that prove the behavior. Anything not directly evidenced in the codebase is called out as such — no columns, SQL, or rules are invented.

Tags used below: `read`, `write`, `read+write`. Sections order: `blog_posts`, `webinars`, `keynote_topics`, `storytelling_sessions`, `prompts`, `votes`, `session_signups`, `webinar_orders`.

---

## 1. `blog_posts`

**Purpose.** Bilingual (English + Czech) long-form blog articles rendered on the public site and managed from the in-app admin.

**Read/write map**

- Pages: `src/pages/Blog.tsx` (read), `src/pages/BlogPost.tsx` (read), `src/pages/RokofAdmin.tsx` (read + insert + update + delete)
- Components: `src/components/BlogPreview.tsx` (read)
- Edge Functions: none
- RPCs / Views: none

**Columns (from `types.ts`)**

| Column                       | Type                             |
| ---------------------------- | -------------------------------- | ---- |
| `id`                         | uuid                             |
| `slug`                       | text                             |
| `title_en`, `title_cs`       | text                             |
| `excerpt_en`, `excerpt_cs`   | text                             |
| `content_en`, `content_cs`   | text                             |
| `category_en`, `category_cs` | text                             |
| `date_en`, `date_cs`         | text (display-only date strings) |
| `image_url`                  | text                             | null |
| `published`                  | boolean                          |
| `sort_order`                 | number                           |
| `created_at`, `updated_at`   | timestamp                        |

**Relationships.** None declared.

**Business rules (verified)**

- Public reads filter `published = true` (`Blog.tsx`, `BlogPost.tsx`, `BlogPreview.tsx`).
- Public ordering is `sort_order ASC, created_at DESC` (`BlogPreview.tsx`).
- Bilingual fallback pattern `*_cs || *_en` when locale is Czech (`BlogPreview.tsx`).
- Admin toggles publication via an `update({ published })` call (`RokofAdmin.tsx`).

**Data migration recommendation.** **All** — evergreen bilingual content actively rendered on `/blog` and `/blog/:slug`.

**Recommended WordPress equivalent.** Native `post` type + WPML/Polylang for the `_cs`/`_en` pair; `date_en`/`date_cs` become display strings in ACF (they are text, not timestamps).

**Migration notes.** Preserve `slug` as `post_name`. Map `sort_order` to `menu_order`. `image_url` → featured image (re-upload to Media Library). Keep both language variants as linked translations rather than merging.

---

## 2. `webinars`

**Purpose.** Catalog of webinar offerings shown in the "Live Webinars" service grid and on each webinar detail page; also selectable in the order form.

**Read/write map**

- Pages: `src/pages/WebinarDetail.tsx` (read), `src/pages/ServiceDetail.tsx` (read), `src/pages/AdminWebinars.tsx` (read + insert + update + delete + reorder)
- Components: `src/components/WebinarOrderForm.tsx` (read — resolves slugs to ids)
- Edge Functions: `supabase/functions/admin-webinars/index.ts` (insert, update, delete — admin auth via HMAC token / password)
- RPCs / Views: none

**Columns (from `types.ts`)**

| Column                          | Type      |
| ------------------------------- | --------- |
| `id`                            | uuid      |
| `slug`                          | text      |
| `title`, `title_cs`             | text      |
| `description`, `description_cs` | text      |
| `details`, `details_cs`         | text      |
| `active`                        | boolean   |
| `sort_order`                    | number    |
| `created_at`, `updated_at`      | timestamp |

**Relationships.** None declared. Referenced indirectly by `webinar_orders.session_ids` / `session_id` (see below), but no FK.

**Business rules (verified)**

- Admin list ordering is `sort_order ASC` (`AdminWebinars.tsx`).
- Drag reorder rewrites `sort_order` per row (`AdminWebinars.tsx`).
- `active` toggled via `update({ active })` (`AdminWebinars.tsx`).
- Bilingual pairs: English is `title`/`description`/`details`, Czech is `*_cs`.
- Admin writes go through the `admin-webinars` edge function with HMAC-signed token or `ADMIN_PASSWORD` fallback.

**Data migration recommendation.** **All** — small curated catalog powering the live pages.

**Recommended WordPress equivalent.** Custom Post Type `webinar` with ACF fields for `details`/`details_cs` and WPML/Polylang for the bilingual pair; `menu_order` for sort, post status for `active`.

**Migration notes.** Preserve `slug` as `post_name` so `/services/live-webinars/:slug` redirects cleanly. Replace HMAC admin auth with WP nonces + `current_user_can('manage_options')`.

---

## 3. `keynote_topics`

**Purpose.** Keynote-talk topics displayed on `/keynote-topics` and referenced by the inquiry modal.

**Read/write map**

- Pages: `src/pages/KeynoteTopics.tsx` (read), `src/pages/RokofAdmin.tsx` (read + insert + update + delete + reorder)
- Components: `src/components/KeynoteInquiryModal.tsx` (read)
- Edge Functions: `supabase/functions/admin-keynote-topics/index.ts` (insert, update, reorder, delete — admin auth)
- RPCs / Views: none

**Columns (from `types.ts`)**

| Column                     | Type      |
| -------------------------- | --------- |
| `id`                       | uuid      |
| `title`                    | text      |
| `description`              | text      |
| `active`                   | boolean   |
| `sort_order`               | number    |
| `created_at`, `updated_at` | timestamp |

**Relationships.** None declared.

**Business rules (verified)**

- Admin lists ordered by `sort_order ASC` (`RokofAdmin.tsx`, `admin-keynote-topics/index.ts`).
- `active` toggled with `update({ active })`; delete is hard delete (`RokofAdmin.tsx`).
- Edge function enforces `title` max 300 chars, `description` max 5000 chars, defaults `sort_order = 0`, `active = true`.
- **Not bilingual** in schema — single-language `title`/`description`.

**Data migration recommendation.** **All** — small structured list actively rendered.

**Recommended WordPress equivalent.** Custom Post Type `keynote_topic` (title = post_title, description = post_content or ACF field, `menu_order` for sort, post status for `active`).

**Migration notes.** Because the schema is monolingual, decide during migration whether to introduce a Czech variant via WPML or leave as-is.

---

## 4. `storytelling_sessions`

**Purpose.** Scheduled online storytelling workshop sessions users can sign up for; carries the Zoom meeting details for each session.

**Read/write map**

- Pages: `src/pages/StorytellingWorkshops.tsx` (read — via edge function, not direct select), `src/pages/AdminSessions.tsx` (read + insert + update + delete), `src/pages/Diagnostics.tsx` (read)
- Components: none directly
- Edge Functions: `supabase/functions/admin-sessions/index.ts` (read + insert + update + delete — admin auth), `supabase/functions/signup-for-session/index.ts` (read — fetches `zoom_link`, `zoom_meeting_id`, `session_date`, `title` for a session id)
- RPCs / Views: `get_published_storytelling_sessions()` (returns non-sensitive columns for future-dated `status = 'published'` rows, ordered by `session_date ASC`); view `storytelling_sessions_public` (non-sensitive projection).

**Columns (from `types.ts`)**

| Column            | Type                     |
| ----------------- | ------------------------ | ---------------- |
| `id`              | uuid                     |
| `title`           | text                     | null             |
| `description`     | text                     | null             |
| `session_date`    | timestamp with time zone |
| `status`          | text                     |
| `zoom_link`       | text                     | null (sensitive) |
| `zoom_meeting_id` | text                     | null (sensitive) |
| `created_at`      | timestamp                |

**Relationships.** `session_signups.session_id → storytelling_sessions.id` (also references the `storytelling_sessions_public` view).

**Business rules (verified)**

- Public listing goes through the `get_published_storytelling_sessions` RPC / public view, which projects only non-sensitive columns and filters `status = 'published'`.
- Workspace rule (workspace knowledge, cited in `StorytellingWorkshops.tsx` comment): do **not** apply date-based filters client-side; filter by `status = 'published'` only. The RPC itself does apply `session_date >= now()`.
- Admin sanitizes `zoom_meeting_id` by stripping non-digits before insert/update (`AdminSessions.tsx`, `admin-sessions/index.ts`).
- `signup-for-session` reads the row, requests a Zoom S2S OAuth token (`ZOOM_ACCOUNT_ID`/`ZOOM_CLIENT_ID`/`ZOOM_CLIENT_SECRET`), registers the user against `zoom_meeting_id`, then writes to `registrations` (not `session_signups`).

**Data migration recommendation.** **Some** — migrate upcoming/`published` sessions only; historical rows are operational artefacts and can be archived.

**Recommended WordPress equivalent.** Custom Post Type `story_session` with ACF fields `session_date` (datetime), `status`, `zoom_link`, `zoom_meeting_id`. Replace the RPC/view with a `WP_Query` using `meta_query` on `status` and `session_date`.

**Migration notes.** Keep `zoom_link` / `zoom_meeting_id` in server-only meta fields, never exposed to `wp-json` without auth. Re-issue Zoom S2S credentials in `wp-config.php`.

---

## 5. `prompts`

**Purpose.** Story-sandbox prompt rows (character / setting / incident / constraint / prompt text) rendered by the interactive Story Sandbox.

**Read/write map**

- Pages: `src/pages/Diagnostics.tsx` (read)
- Components: `src/components/StorySandbox.tsx` (read — `select("*")`)
- Edge Functions: none
- RPCs / Views: none

**Columns (from `types.ts`)**

| Column            | Type      |
| ----------------- | --------- | ---- |
| `id`              | uuid      |
| `sheet_key`       | text      |
| `character`       | text      | null |
| `setting`         | text      | null |
| `incident`        | text      | null |
| `constraint_text` | text      | null |
| `prompt`          | text      | null |
| `created_at`      | timestamp |

**Relationships.** No FKs declared. Logically pairs with `votes` via `(sheet_key, row_id)` — `row_id` is not stored on `prompts` in the schema; the sandbox component treats prompt rows as vote targets.

**Business rules (verified)**

- Fetched as a full-table select and rendered client-side (`StorySandbox.tsx`).
- No write path exists in the app — content is seeded/administered outside the UI.

**Data migration recommendation.** **All** — small static content set that drives the Story Sandbox page.

**Recommended WordPress equivalent.** Custom `$wpdb` table `wp_story_prompts` (same columns) or a Custom Post Type `story_prompt` with ACF fields; a plain table is closer to current usage.

**Migration notes.** No admin UI exists today, so provide either a CSV import or a minimal WP admin screen. Keep `sheet_key` as the grouping key used by the sandbox.

---

## 6. `votes`

**Purpose.** Aggregate up/down vote counts for individual sandbox elements, keyed by `(sheet_key, row_id, element_box)`.

**Read/write map**

- Pages: `src/pages/Diagnostics.tsx` (read)
- Components: `src/components/StorySandbox.tsx` (read — `select("sheet_key,row_id,element_box,up_count,down_count")`)
- Edge Functions: `supabase/functions/cast-vote/index.ts` (write via RPC only)
- RPCs / Views: `increment_vote(p_sheet_key, p_row_id, p_element_box, p_vote, p_previous)` — server-side upsert that adjusts `up_count`/`down_count` clamped at ≥ 0.

**Columns (from `types.ts`)**

| Column        | Type      |
| ------------- | --------- |
| `sheet_key`   | text      |
| `row_id`      | text      |
| `element_box` | text      |
| `up_count`    | number    |
| `down_count`  | number    |
| `updated_at`  | timestamp |

**Relationships.** No FKs declared. Logically joined to `prompts` on `sheet_key`.

**Business rules (verified)**

- Clients never write directly. `cast-vote` validates the vote value against `{"up","down","nullify_up","nullify_down"}` and calls the `increment_vote` RPC with SECURITY DEFINER semantics.
- RPC clamps counters at 0 and upserts on the composite key `(sheet_key, row_id, element_box)`.

**Data migration recommendation.** **None** — vote counts are ephemeral engagement metrics with no operational value in a fresh WP install; start clean.

**Recommended WordPress equivalent.** Custom `$wpdb` table `wp_story_votes` with a `UNIQUE (sheet_key, row_id, element_box)` index and an `ON DUPLICATE KEY UPDATE` PHP helper replacing the RPC. Expose via a public REST route protected by nonce + rate-limit.

**Migration notes.** Re-implement the "nullify" semantics in PHP. If preserving counts is desired, export as CSV and bulk-insert.

---

## 7. `session_signups`

**Purpose.** Per the schema, links a signup email to a `storytelling_sessions` row.

**Read/write map**

- Pages: none reference `session_signups` directly.
- Components: none.
- Edge Functions: none reference `session_signups` directly. `signup-for-session/index.ts` writes to the separate `registrations` table, not this one.
- RPCs / Views: referenced only via the `session_signups_session_id_fkey` relationship in `types.ts`.

**Columns (from `types.ts`)**

| Column       | Type      |
| ------------ | --------- |
| `id`         | uuid      |
| `session_id` | uuid      |
| `email`      | text      |
| `created_at` | timestamp |

**Relationships.** `session_id → storytelling_sessions.id` (also targets the `storytelling_sessions_public` view).

**Business rules (verified).** **None verifiable from the codebase.** No read or write path was found; the table appears unused by the current application in favor of `registrations`.

**Data migration recommendation.** **None** — no verified app usage; treat as legacy/unused unless the operator confirms otherwise.

**Recommended WordPress equivalent.** Retire. If a signup log is still wanted, use the `registrations` equivalent (custom `$wpdb` table `wp_session_signups` or CPT `story_signup` referencing the `story_session` CPT).

**Migration notes.** Before retiring, run a `SELECT count(*)` on production to confirm the table is empty or dormant.

---

## 8. `webinar_orders`

**Purpose.** Orders placed via the "Order Now (no payment required)" webinar order form — stores customer contact and chosen webinar(s)/date(s).

**Read/write map**

- Pages: none read directly.
- Components: `src/components/WebinarOrderForm.tsx` (insert — one row per order after resolving webinar slugs → ids).
- Edge Functions: `supabase/functions/send-webinar-email/index.ts` (read — anti-abuse check that a matching order row exists in the last 10 minutes before sending confirmation email via Resend).
- RPCs / Views: none.

**Columns (from `types.ts`)**

| Column           | Type      |
| ---------------- | --------- | ------------------------------ |
| `id`             | uuid      |
| `customer_name`  | text      |
| `customer_email` | text      |
| `session_id`     | uuid      | null (legacy single-selection) |
| `session_ids`    | uuid[]    | null (multi-selection)         |
| `chosen_date`    | text      | null (legacy single-date)      |
| `chosen_dates`   | text[]    | null (multi-date)              |
| `created_at`     | timestamp | null                           |

Note: the singular `session_id`/`chosen_date` columns coexist with the plural array versions in the schema; current form code writes the plural arrays.

**Relationships.** No FK declared, but `session_id` / `session_ids` logically reference `webinars.id` (the form resolves selected slugs via `webinars` before inserting).

**Business rules (verified)**

- Order form inserts one row; then `send-webinar-email` is invoked. That function requires a matching `customer_email` order created within the last 10 minutes before it will send via Resend (anti-abuse).
- No admin CRUD path for `webinar_orders` exists in the codebase.

**Data migration recommendation.** **Some** — migrate rows still within business follow-up window (e.g. recent unfulfilled orders); older completed orders can be exported to CSV and archived rather than imported.

**Recommended WordPress equivalent.** Custom `$wpdb` table `wp_webinar_orders` with the same columns (or a private CPT `webinar_order` if you want the WP admin list view for free). Expose the insert via an authenticated REST route with a nonce + honeypot; keep the 10-minute anti-abuse window in a PHP helper.

**Migration notes.** Replace the Supabase edge-function pairing (insert → invoke `send-webinar-email`) with a single WP REST route that inserts the row and triggers `wp_mail()` / SMTP / Resend in the same request. Rewire the Resend API key into `wp-config.php`.

---

## 9. `inhouse_workshops`

**Purpose.** Catalog of corporate training and in-house workshop offerings displayed on dynamic routing pages and service sub-grids.

**Read/write map**

- Pages: `src/pages/InhouseWorkshops.tsx` (read), `src/pages/RokofAdmin.tsx` (read + insert + update + delete + reorder)
- Components: `src/components/WorkshopInquiryModal.tsx` (read)
- Edge Functions: `supabase/functions/admin-workshops/index.ts` (insert, update, reorder, delete — admin auth via HMAC token / password)
- RPCs / Views: none

**Columns (from `types.ts`)**

| Column                          | Type      |
| ------------------------------- | --------- | ---- |
| `id`                            | uuid      |
| `title`, `title_cs`             | text      |
| `description`, `description_cs` | text      |
| `duration`, `duration_cs`       | text      | null |
| `active`                        | boolean   |
| `sort_order`                    | number    |
| `created_at`, `updated_at`      | timestamp |

**Relationships.** None declared.

**Business rules (verified)**

- Admin list ordering is strictly controlled via `sort_order ASC` (`RokofAdmin.tsx`).
- Fully bilingual schema framework supporting parallel tracking configurations (`title` vs `title_cs`, etc.).
- Admin writes run through a dedicated `admin-workshops` edge function requiring HMAC session token verification or the fallback backend password block.

**Data migration recommendation.** **All** — stable structural catalog content currently rendering live corporate offerings.

**Recommended WordPress equivalent.** Custom Post Type `inhouse_workshop` paired with Advanced Custom Fields (ACF) for localized `duration`/`description` parameters, utilizing WPML or Polylang for language switching.

---

## 10. `registrations`

**Purpose.** The live, active operational registry holding user-generated signups for public storytelling workshops. (Replaces the unused `session_signups` table).

**Read/write map**

- Pages: none read directly.
- Components: none directly.
- Edge Functions: `supabase/functions/signup-for-session/index.ts` (write — core insert destination after verifying meeting limits and validating inbound client payload schemas).
- RPCs / Views: none.

**Columns (from `types.ts`)**

| Column       | Type      |
| ------------ | --------- | ---- |
| `id`         | uuid      |
| `session_id` | uuid      |
| `email`      | text      |
| `name`       | text      | null |
| `created_at` | timestamp |

**Relationships.** `session_id` logically acts as a Foreign Key referencing `storytelling_sessions.id`.

**Business rules (verified)**

- The application bypasses the empty client-side `session_signups` structure entirely. Signups route via the `signup-for-session` Edge Function which inserts directly into this table.
- Inserts trigger a server-side Zoom API request to register the attendee against the explicit `zoom_meeting_id` and issue an automatic bilingual confirmation dispatch via Resend.

**Data migration recommendation.** **Some** — migrate active, upcoming session registration rows for live follow-ups. Historical records can be exported directly to a flat CSV file for offsite archiving.

**Recommended WordPress equivalent.** Custom `$wpdb` table `wp_workshop_registrations` (or a protected CPT `workshop_registration` referencing the `story_session` post type if an out-of-the-box admin list interface is preferred).

---

## 11. `contact_submissions`

**Purpose.** Persistent database audit log capturing all contact form submissions fired across the frontend site.

**Read/write map**

- Pages: none read directly.
- Components: `src/components/ContactForm.tsx` (indirect write path).
- Edge Functions: `supabase/functions/send-contact-email/index.ts` (write — updates/logs the submission payload securely on the backend alongside processing the outbound email relay).
- RPCs / Views: none.

**Columns (from `types.ts`)**

| Column       | Type      |
| ------------ | --------- | ---- |
| `id`         | uuid      |
| `name`       | text      |
| `email`      | text      |
| `subject`    | text      | null |
| `message`    | text      |
| `created_at` | timestamp |

**Relationships.** None declared.

**Business rules (verified)**

- Inbound data arrays pass through the `send-contact-email` edge infrastructure which sanitizes the input parameters, logs a backup snapshot row to this table, and triggers a direct notification to the admin via Resend.

**Data migration recommendation.** **None** — historical message logs have no structural layout value in a fresh installation. Start clean and let a native WP form processor log future messages.

## **Recommended WordPress equivalent.** Replace completely with a native WordPress contact form plugin framework (like Contact Form 7, Gravity Forms, or Fluent Forms) configured to store submission logs locally while dispatching admin updates via standard server SMTP.

## Cross-table migration order (Updated)

1. **`keynote_topics` & `inhouse_workshops`** — Completely self-contained content tables. Run these first as your base pipeline testing blocks.
2. **`webinars`** — Must exist prior to configuring orders.
3. **`storytelling_sessions`** — Crucial foundational layout required before user signups or tracking loops can be built.
4. **`registrations`** — Operational dependency mapping back directly to active storytelling sessions.
5. **`webinar_orders`** — Operational data requiring parent webinar IDs to resolve selections.
6. **`prompts` then `votes`** — Sandbox interface configuration blocks. Prompt matrix pulls first; user interaction tokens start clean.
7. **`blog_posts`** — Highly independent long-form content. Process last to ensure bilingual plugin routing mappings and URL taxonomies are firmly configured first.
