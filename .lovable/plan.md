

# Fix inline inquiry form width on webinar page

## What changes

The expanded inquiry form moves **outside** the per-card grid column so it's no longer squeezed to 1/3 width. Instead it renders below the grid at a comfortable width (~`max-w-2xl`, roughly 672px) centered within the container. On mobile it naturally spans full width.

## Technical detail

### File: `src/pages/ServiceDetail.tsx`

**Current**: `AnimatePresence` + `ContactForm` is nested inside each grid item → form is column-width (narrow).

**New**: Remove the `AnimatePresence` block from inside the `.map()`. Add a single `AnimatePresence` block **after** the grid `</div>`. It renders when `expandedWebinar` is set, using `max-w-2xl mx-auto` for comfortable desktop width and full-width on mobile. Same slide-down + fade animation. The selected webinar's title is looked up from the `webinars` array to pass as `serviceName`.

```
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards only — no form inside */}
</div>

<AnimatePresence>
  {expandedWebinar && (
    <motion.div className="max-w-2xl mx-auto mt-6">
      <ContactForm serviceName={...} showServiceFields />
    </motion.div>
  )}
</AnimatePresence>
```

### Files changed
- `src/pages/ServiceDetail.tsx` only

