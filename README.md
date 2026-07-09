# Rokofsky Communication Training — Project Reference

This README is the **single source of truth** for three tightly-coupled systems
that power the site:

1. **Multi-language routing** (English at `/`, Czech at `/cz`)
2. **Hash-anchor navigation** (`/#services`, `/#faq`, `/#pricing`, `/#contact-area`)
3. **Custom browser tab title logic** (the "Brute Force" `document.title` system)

If you change any one of these, **read this whole file first**. They interact in
non-obvious ways, and a small change in one can break the others.

---

## 1. Multi-Language Routing

### URL shape

| Language | URL prefix | Example |
|----------|-----------|---------|
| English  | _(none)_  | `/`, `/blog`, `/references`, `/services/storytelling` |
| Czech    | `/cz`     | `/cz`, `/cz/blog`, `/cz/reference`, `/cz/services/storytelling` |

Czech is **not** a query param or a cookie — it's a real URL prefix. This is
intentional: it makes language state shareable, bookmarkable, and SEO-friendly.

### Where it's wired up

- **`src/App.tsx`** — Two parallel `<Route>` trees mount the same `PageRoutes()`
  fragment under `/` and `/cz`. **If you add a new page, you must add it once
  inside `PageRoutes()` and it will automatically work in both languages.**
- **`src/hooks/useLanguageRouting.ts`** — All language helpers live here:
  - `useIsCzech()` — returns `true` when path starts with `/cz`
  - `useLocalizedPath()` — returns a function `lp("/blog")` that prefixes `/cz`
    when in Czech mode. Also handles the special case `/#services` → `/cz#services`.
  - `toLanguagePath(path, "en" | "cz")` — converts a path between languages,
    including slug overrides (see below).
  - `useLanguageSync()` — syncs `i18n.language` with the URL prefix, and sets
    `<html lang>`. Called once in `LanguageSyncWrapper` in `App.tsx`.
- **`src/i18n/index.ts`** — i18next config. Custom `pathDetector` reads `/cz`
  from the URL. **`fallbackLng: "en"` and `supportedLngs: ["en", "cz"]` are
  hardcoded** to prevent the AI interface from glitching into other languages
  (e.g. Russian) based on browser locale.

### Czech slug overrides

Some routes have a different slug in Czech. They're declared in **one place**:
`czSlugs` in `src/hooks/useLanguageRouting.ts`.

```ts
const czSlugs = {
  references: "reference",
  "privacy-policy": "ochrana-soukromi",
  "terms-of-service": "obchodni-podminky",
  // bio, blog, gdpr, storytelling-workshops, keynote-topics — same in both
};
```

When you add a new page that needs a different Czech slug:

1. Add the mapping to `czSlugs`.
2. Add **both** route paths inside `PageRoutes()` in `App.tsx` (e.g. both
   `references` and `reference` route to the same `<References />` component).

### Language toggle (`src/components/LanguageToggle.tsx`)

The EN/CZ toggle in the header:

1. Calls `toLanguagePath()` to get the equivalent path in the other language.
2. Calls `i18n.changeLanguage()`.
3. Navigates to the new path **and re-appends the current `window.location.hash`**.

This is what makes `/cz#services` → `/#services` work when toggling. **Do not
remove the hash re-append** — it's the only reason hash-anchor pages preserve
scroll position across language switches.

---

## 2. Hash-Anchor Navigation

The home page is a long single-page layout with sections: `#services`, `#faq`,
`#pricing`, `#contact-area`. The header's "Services / FAQ / Pricing / Contact"
links all use these hashes.

### How clicks are handled (`src/components/Header.tsx`)

- Each hash link is rendered as `<Link to="/#services">` (or `/cz#services`).
- `handleHashClick(e, id)` runs on click:
  - If we're **already on the language root** (`/` or `/cz`): `preventDefault`,
    update the URL hash via `history.replaceState`, then smooth-scroll to the
    element (with retries — `scrollToElement` polls up to 10× because lazy
    sections may not exist yet).
  - If we're on a different page (e.g. `/blog`): let React Router navigate to
    `/#services` normally. Then a `useEffect` watching `location.hash` fires
    `scrollToElement` after a 400ms delay so the section has time to mount.

### The 80px header offset

`scrollToElement` subtracts `80` from the element's `getBoundingClientRect().top`
to account for the fixed header. If you change the header height, update this
constant.

### Hash links + Czech

`useLocalizedPath()` has a special branch:

```ts
if (path.startsWith("/#")) return `/cz${path.slice(1)}`; // /cz#services
```

This is why `lp("/#services")` correctly produces `/cz#services` (not
`/cz/#services`). Don't "fix" this — it's load-bearing.

---

## 3. Browser Tab Title — The "Brute Force" System

### Why it's brute force

React Router does **not** trigger re-renders when only the hash changes. That
means hash-only navigations (like `/#services` → `/#contact-area`) don't fire
any standard hook. We tried Helmet and `useEffect([pathname])` — both fail to
update the title for hash anchors and on certain edge cases the Blog title
"sticks" after navigating away.

The fix: a single `setInterval(applyTitle, 300)` running app-wide that just
**reads `window.location.href` and writes `window.document.title` directly**.
No React state, no Helmet, no `<head>` mutations from page components. Bulletproof.

### Where it lives

`GlobalSeoSync` component in **`src/App.tsx`**. Mounted once, near the router.

```tsx
function GlobalSeoSync() {
  useEffect(() => {
    const applyTitle = () => {
      const href = window.location.href.toLowerCase();
      const isCz = href.includes("/cz") || i18n.language?.toLowerCase().startsWith("cz");
      // ...checks href for #contact-area, #services, #faq, #pricing,
      //    /blog, /references — sets document.title accordingly.
    };
    applyTitle();
    const id = window.setInterval(applyTitle, 300);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
```

### Title map (current)

| URL contains          | English title                       | Czech title                    |
|-----------------------|-------------------------------------|--------------------------------|
| `#contact-area` / `#contact` | `Contact \| Rokofsky`        | `Kontakt \| Rokofsky`          |
| `#services`           | `Services \| Rokofsky`              | `Služby \| Rokofsky`           |
| `#faq`                | `FAQ \| Rokofsky`                   | `Časté dotazy \| Rokofsky`     |
| `#pricing`            | `Pricing \| Rokofsky`               | `Ceník \| Rokofsky`            |
| `/blog`               | `Blog \| Rokofsky`                  | `Blog \| Rokofsky`             |
| `/references` / `/reference` | `References \| Rokofsky`     | `Reference \| Rokofsky`        |
| _everything else_     | `Rokofsky Communication Training`   | `Rokofsky Communication Training` |

To add a new title, edit the `if/else if` chain inside `applyTitle` in
`GlobalSeoSync`. **Order matters** — more specific checks (like `#contact-area`)
must come before more general ones.

### What NOT to do

- ❌ Don't add `react-helmet` / `react-helmet-async`. It races with the interval.
- ❌ Don't set `document.title` from page components.
- ❌ Don't import `setPageSeo` from `src/lib/pageSeo.ts` — it's an intentional
  no-op kept only so legacy imports don't crash.
- ❌ Don't put a long title in `index.html`. It's set to just `Rokofsky` so the
  static HTML doesn't fight the JS for ~300ms on first paint.

---

## 4. How the three systems interact (cheat sheet)

User clicks **"Services"** in the header while on `/cz/blog`:

1. `<Link to="/cz#services">` triggers React Router → path becomes `/cz` + hash `#services`.
2. `useLanguageSync` sees `/cz` → keeps `i18n.language = "cz"`.
3. Header's `useEffect([location.hash])` fires `scrollToElement("services")` after 400ms.
4. `GlobalSeoSync` interval (within ≤300ms) sees `#services` + `/cz` in href → sets
   `document.title = "Služby | Rokofsky"`.

User clicks **EN** toggle while on `/cz#contact-area`:

1. `LanguageToggle.switchTo("en")` calls `toLanguagePath("/cz", "en")` → `/`.
2. Re-appends `window.location.hash` → navigates to `/#contact-area`.
3. `useLanguageSync` sees `/` → switches `i18n.language` to `"en"`.
4. Header's hash effect scrolls to `#contact-area`.
5. `GlobalSeoSync` updates title to `Contact | Rokofsky`.

---

## 5. Files you will most often touch

| Task                              | File                                          |
|-----------------------------------|-----------------------------------------------|
| Add a new page                    | `src/App.tsx` (inside `PageRoutes()`)         |
| Add a Czech slug override         | `src/hooks/useLanguageRouting.ts` (`czSlugs`) |
| Add a new tab title rule          | `src/App.tsx` (`GlobalSeoSync.applyTitle`)    |
| Add a new header link             | `src/components/Header.tsx` (`navOrder`)      |
| Add a new translation string      | `src/i18n/en.ts` and `src/i18n/cz.ts`         |
| Change header height / scroll offset | `Header.tsx` (`headerOffset = 80`)         |

## 6. Files you should NEVER edit manually

- `src/integrations/supabase/client.ts` — auto-generated
- `src/integrations/supabase/types.ts` — auto-generated
- `.env` — auto-managed by Lovable Cloud
- `supabase/config.toml` — only function-specific blocks, never project settings

---

_Last updated: April 2026. If you change routing, language, or title behavior,
update this file in the same commit._
