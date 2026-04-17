
Currently no — the `/references/scans` page reads from a hardcoded array in `ReferenceScans.tsx`, and slots only fill when a PDF is manually placed in `public/scans/` and the code is edited. There is no admin upload flow.

Here's a plan to make it admin-manageable:

## Plan: Admin-managed reference scans

**1. Storage**
- Create a public Supabase storage bucket `reference-scans` for PDFs.
- Create a `reference_scans` table: `id`, `slot_number` (1–80), `pdf_path`, `title`, `created_at`.
- RLS: public can SELECT; only admin edge function can INSERT/UPDATE/DELETE (service role).

**2. Admin upload UI (in `RokofAdmin.tsx`)**
Add a new "Reference Scans" section with:
- A grid of 80 numbered slots showing current state (filled / empty).
- Per slot: file input (PDF only), optional title, Upload button, Replace, Delete.
- Calls a new edge function `admin-reference-scans` (password-protected like `admin-sessions`) that handles upload to storage + DB upsert.

**3. Public page (`ReferenceScans.tsx`)**
- Replace the hardcoded array with a Supabase query to `reference_scans`, ordered by `slot_number`.
- Render 80 slots; filled ones link to the public storage URL, empty ones stay as placeholders.

**4. References landing (`References.tsx`)**
- Update the 6 preview slots to also pull from the same table (first 6 by slot_number).

**Files**
- New: `supabase/functions/admin-reference-scans/index.ts`
- New migration: bucket + table + RLS
- Edit: `src/pages/RokofAdmin.tsx`, `src/pages/ReferenceScans.tsx`, `src/pages/References.tsx`

After approval I'll switch to default mode and implement it.
