I’m sorry — the current fix is still too clever and that is likely why it keeps failing on real mobile taps.

Plan:
1. Replace the mobile menu’s Home item with a plain React Router `<Link>` that mirrors Blog/References exactly:
   - English: `to="/"`
   - Czech: `to="/cz"`
   - `onClick={() => setMobileOpen(false)}` only
2. Do the same simplification for the logo:
   - `to={homeHref}`
   - close the menu if open
   - do not call `preventDefault()` for normal cross-page Home navigation
3. Keep the special scroll/hash logic only for section links like Services, FAQ, Pricing, Contact.
4. Add a small mobile-menu-specific helper so Home cannot be accidentally handled as a hash/scroll link again.
5. After implementation, verify the rendered code paths for:
   - `/blog` → Home routes to `/`
   - `/references` → Home routes to `/`
   - `/cz/blog` → Domů routes to `/cz`
   - `/cz/reference` → Domů routes to `/cz`
   - hamburger closes immediately on click

Technical fix target:
- File: `src/components/Header.tsx`
- Root cause: the Home link currently calls `e.preventDefault()` and uses programmatic `navigate(...)`, while Blog/References use normal `<Link to="...">` behavior. I will remove that difference for Home in the mobile drawer and logo.