

# All hero photos: zoom out from 1.25 to 1

## Change

In `src/components/HeroSection.tsx`, change the default initial scale from `1.08` to `1.25` for all slides, and remove the per-slide `slideScales` override since it's no longer needed.

### File: `src/components/HeroSection.tsx`
- Remove the `slideScales` constant entirely
- Change `initial={{ opacity: 0, scale: slideScales[current] ?? 1.08 }}` to `initial={{ opacity: 0, scale: 1.25 }}`

