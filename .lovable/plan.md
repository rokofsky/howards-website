# Plan: Generate `DATABASE_REFERENCE.md`

Create one new file at the project root: `DATABASE_REFERENCE.md`. No application code will be modified.

## Investigation steps (read-only)

1. Read the verified schema from `src/integrations/supabase/types.ts` (authoritative for columns, relationships, RPCs, views).
2. Grep for every reference to each table across `src/**` (pages, components, hooks) and `supabase/functions/**` (edge functions) to enumerate readers/writers.
3. Cross-check RPCs (`get_published_storytelling_sessions`, `increment_vote`) and the `storytelling_sessions_public` view.
4. Note only behavior directly evidenced by code (e.g. `eq("published", true)`, `.order("sort_order")`, bilingual `_cs`/`_en` selects, HMAC token flow, Zoom/Resend calls inside a function that reads/writes the table).

## File structure

**Header** — purpose (WordPress migration handover), method (columns pulled from generated Supabase types, cross-verified against code; behavior claims cited to files), explicit note that anything not verifiable is marked as such rather than invented.

**One section per table**, in this order: `blog_posts`, `webinars`, `keynote_topics`, `storytelling_sessions`, `prompts`, `votes`, `session_signups`, `webinar_orders`.

Each section contains these fixed subsections:

1. **Purpose** — one paragraph.
2. **Read/write map** — bulleted, grouped as Pages / Components / Edge Functions / RPCs & Views, each entry tagged `read` / `write` / `read+write`.
3. **Columns** — table of name + type from `types.ts`; columns present in schema but with no verified app usage are listed and flagged `(schema only, no verified app usage)`. No fabricated SQL.
4. **Relationships** — only those declared in `types.ts` Relationships arrays or evident from code joins/lookups.
5. **Business rules** *(new, required)* — short bulleted summary of verified application logic tied to this table only. Examples of the kind of rules included when the code proves them: publication filter (`published = true`), ordering (`sort_order` then `created_at`), bilingual field fallback (`*_cs || *_en`), status filter (`status = 'published'`), HMAC-signed admin token flow, Zoom S2S meeting creation on signup, Resend confirmation email on order, `increment_vote` RPC semantics, honeypot / rate-limit gates. Anything not directly grep-able is omitted.
6. **Data migration recommendation** *(new, required)* — exactly one of **All / Some / None**, followed by a one-sentence justification (e.g. "All — evergreen bilingual content actively rendered on `/blog`"; "None — ephemeral admin-session artefact replaced by WP nonces").
7. **Recommended WordPress equivalent** — native Post, Custom Post Type (suggested slug), custom `$wpdb` table, ACF field group, WP options, or "retire".
8. **Migration notes** — special handling: bilingual fields, unique constraints, FK → CPT relationship (`post_parent` or ACF relationship), RPC → PHP helper, view → `WP_Query`, HMAC → nonce, Zoom/Resend rewiring, thumbnail regeneration, etc.

**Final section — Cross-table migration order**: short ordered list with a one-line rationale each (parents before children, e.g. `storytelling_sessions` before `session_signups`; `webinars` before `webinar_orders`).

## Explicit non-goals

- No code changes, no migrations, no edge function edits.
- No invented columns, types, or SQL — unverifiable items are explicitly labelled.
- Business rules are limited to behavior that appears in the source; nothing inferred from table names alone.

## Deliverable

A single new file: `DATABASE_REFERENCE.md` at the project root. Nothing else changes.
