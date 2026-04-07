

# Fix hero photos 9 and 8 positioning

## Problem
Photos at index 0 (hero-9) and index 8 (hero-8) are showing too low due to `objectPosition` overrides.

## Change
In `src/components/HeroSection.tsx`, remove the custom `objectPosition` entries for slides 0 and 8, keeping the default `"center center"` for all. The zoom-in animation (`scale: 1.08 → 1`) already handles the Ken Burns effect from full photo to center.

```ts
const slidePositions: Record<number, string> = {
  2: "center center",
  7: "center center",
};
```

This removes lines 20 and 23 (the overrides for index 0 and 8), so both default to `"center center"` — starting with the full photo centered and zooming in.

