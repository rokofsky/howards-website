

# Add drag-and-drop reordering to admin webinars

## Steps

### 1. Database migration
Add `sort_order` integer column (default 0) to `webinars` table. Backfill existing rows sequentially by title.

### 2. Edge function update (`supabase/functions/admin-webinars/index.ts`)
Add `"reorder"` action accepting `{ items: [{ id, sort_order }] }` — loops through and updates each row's `sort_order`.

### 3. Admin UI (`src/pages/AdminWebinars.tsx`)
- Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Wrap webinar list in `DndContext` + `SortableContext`
- Make each webinar row a sortable item with a `GripVertical` drag handle
- On drag end: reorder local state, call edge function with `action: "reorder"`
- Fetch ordered by `sort_order` ascending

### 4. Public page (`src/pages/ServiceDetail.tsx`)
Change `.order("title")` to `.order("sort_order", { ascending: true })`.

### Files changed
- New migration SQL
- `supabase/functions/admin-webinars/index.ts`
- `src/pages/AdminWebinars.tsx`
- `src/pages/ServiceDetail.tsx`
- `package.json` (add @dnd-kit packages)

