

## Fix: Wrap "Service Pillars" in a styled text box

The Service Pillars content currently renders as plain paragraphs under a heading because `section.paragraphs` in `ServiceDetail.tsx` just outputs `<p>` tags with no container styling.

The intro content above it sits in a `rounded-lg p-8 mb-12 glass` (or `border border-gold/40 bg-card shadow-...` for executive tone) box, and the highlight below uses `rounded-lg border border-gold/50 bg-card px-6 py-5 shadow-...`.

### What I'll do

**File: `src/pages/ServiceDetail.tsx`** (lines 107-111)

Wrap section paragraphs in a styled container when the page has `tone: "executive"`. This will give the Service Pillars text the same card-style box treatment as the intro and highlight sections:

```
rounded-lg border border-gold/40 bg-card px-6 py-5 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.7)]
```

The heading "Service Pillars" stays above the box. The paragraph text goes inside the box, matching the visual style of the intro box and the Success Fee highlight box on the same page.

### Technical detail
- Add a conditional wrapper `<div>` around `section.paragraphs` rendering when `detail?.tone === "executive"`, applying the same border/shadow/bg-card classes used by the highlight box.
- No data changes needed — the text is already correct from the previous edit.

