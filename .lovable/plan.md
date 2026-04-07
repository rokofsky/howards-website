

# Show admin webinar list as a 3-column card grid

## What changes

Replace the vertical stacked list in `src/pages/AdminWebinars.tsx` with a 3-column card grid that mirrors the public webinar page layout. Each card shows title, description, an edit/delete button row, and a drag handle. This lets you see the exact visual order as it appears to visitors.

## Technical detail

### File: `src/pages/AdminWebinars.tsx`

**SortableWebinarRow component** — change from a horizontal flex row to a card matching the public page style:
- Outer wrapper: `rounded-lg border border-border bg-card p-5` (same classes as public cards)
- Title as `<h3>`, description below, drag handle + edit/delete buttons at bottom
- Keep all `useSortable` logic intact

**Grid container** — replace `<div className="space-y-3">` with `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">` (identical breakpoints to public page)

No other files changed. Drag-and-drop, edit modal, create form, and password protection stay the same.

