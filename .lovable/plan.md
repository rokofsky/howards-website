

# Fix: Inquiry form animation on webinar page

## Problem
The `height: 0 → "auto"` framer-motion animation isn't reliably rendering the form visible.

## Fix
In `src/pages/ServiceDetail.tsx` (around line 149–155), replace:
- `initial={{ height: 0, opacity: 0 }}` → `initial={{ opacity: 0, y: -10 }}`
- `animate={{ height: "auto", opacity: 1 }}` → `animate={{ opacity: 1, y: 0 }}`
- `exit={{ height: 0, opacity: 0 }}` → `exit={{ opacity: 0, y: -10 }}`
- Remove `overflow-hidden` from className

One file, ~4 lines changed.

