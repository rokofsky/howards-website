

## Plan: Orange Background + Dark Brown Buttons

### Summary
Switch the site background to a warm orange tone and change buttons (currently gold/amber) to dark brown/espresso. Keep the petrol teal for secondary elements.

### Color Changes (in `src/index.css`)

**Light mode `:root`:**
- `--background`: change from warm off-white (`25 25% 96%`) to a soft warm orange (`30 70% 90%`) — light peachy-orange, not neon
- `--gold` (used for CTA/glass buttons): change from amber (`40 50% 48%`) to dark espresso brown (`20 40% 22%`) — reusing the current primary brown tone
- `--gold-foreground`: change to light cream (`35 30% 95%`) for legibility on dark brown
- `--card`: adjust to slightly lighter orange-tinted white (`30 40% 95%`) so cards still stand out
- `--secondary`, `--muted`: shift to orange-tinted neutrals for harmony

**Dark mode `.dark`:** Corresponding adjustments — darker orange-toned background, espresso buttons with light text.

### Button Variants (in `src/components/ui/button.tsx`)
- `glass`, `cta` variants currently use `bg-gold` — these will automatically pick up the new espresso brown via the CSS variable change
- No code changes needed in button.tsx

### Glass Effects (in `src/index.css`)
- Update `glow-gold` box-shadow hues from amber (`40 50% 48%`) to brown (`20 40% 22%`) to match new button color
- Update `glass-button` hover shadows similarly

### Files Modified
1. **`src/index.css`** — CSS custom properties (light + dark mode) and glass/glow utility classes
2. No other files need changes — colors flow through CSS variables

