

# Implement mobile 3×3 grid for services

## Problem
The services section still uses a horizontal swipe carousel on mobile. The approved plan to show all 9 services in a compact 3×3 grid was never applied.

## Changes — one file: `src/components/ServicesGrid.tsx`

### 1. Update `ServiceCard` with responsive classes
- Height: `h-28 md:h-64`
- Padding: `p-2 md:p-6`
- Title: `text-xs md:text-lg`
- Hide subtitle and hook on mobile: `hidden md:block`

### 2. Replace mobile carousel with grid
Replace the "Mobile Carousel" `div` (lines 57–64):
```
<div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide">
  ...shrink-0 w-[280px]...
</div>
```
with:
```
<div className="md:hidden grid grid-cols-3 gap-2">
  {services.map((s, i) => (
    <ServiceCard key={s.id} {...s} index={i} />
  ))}
</div>
```

One file, CSS class changes only. All 9 services visible at once on mobile, no scrolling needed.

