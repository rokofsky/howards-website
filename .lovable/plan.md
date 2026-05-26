## Problem

The new `WebinarInquiryModal` (with the "Order Now (No payment req)" button) and `WebinarOrderForm` were only wired into `src/pages/WebinarDetail.tsx` (the per-webinar detail route `/services/online-webinars/:slug`).

The page the user is actually on — `/services/online-webinars` — is rendered by `src/pages/ServiceDetail.tsx`. Its grid of "Inquire" buttons still opens the original plain `<Dialog>` containing just a `<ContactForm>` (lines 178–201). That's why clicking Inquire shows nothing new.

## Fix (single file: `src/pages/ServiceDetail.tsx`)

1. Import the two new components:
   - `WebinarInquiryModal` from `@/components/WebinarInquiryModal`
   - `WebinarOrderForm` from `@/components/WebinarOrderForm`
2. Add a small piece of state: `showOrderForm` (boolean) and `orderInitialSlug` (string | undefined). Keep existing `expandedWebinar` to identify which webinar's inquiry modal is open.
3. Replace the existing `<Dialog>...<ContactForm/></Dialog>` block (lines 190–201) with `<WebinarInquiryModal>`, passing:
   - `open={!!expandedWebinar}`
   - `onOpenChange` → clears `expandedWebinar` on close
   - `webinarTitle` → current webinar's title
   - `onOrderNow` → closes inquiry modal, sets `orderInitialSlug` to current webinar's slug (look it up from `webinars` data), opens `WebinarOrderForm`
4. Render `<WebinarOrderForm open={showOrderForm} onOpenChange={setShowOrderForm} initialWebinarSlug={orderInitialSlug} />` once below.

## Notes

- `webinars` here comes from the DB (`webinar.id`, `webinar.title`, `webinar.slug`); confirm `slug` is present on the row (it is, based on `WebinarDetail.tsx` querying it). If not selected, include slug in the select.
- No backend / RLS / migration changes needed — that infrastructure already exists from the previous turns.
- Scope is strictly this one file; no styling or unrelated changes.