

## Plan: Hero Photos from Upload + Blog Scroll Fix

### 1. Extract and Replace Hero Images

The uploaded `fotos.zip` contains numbered JPG files (1.JPG, 2.JPG, etc.). These will replace the existing `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` in `src/assets/`.

**Steps:**
- Copy `fotos.zip` to `/tmp`, extract it
- Copy extracted images to `src/assets/` as `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` (matching the order: 1.JPG → hero-1, 2.JPG → hero-2, etc.)
- If more than 3 images exist, add them and update the `HeroSection.tsx` imports to include all slides

**File:** `src/components/HeroSection.tsx` — update the `slides` array if additional images are found.

### 2. Fix Blog Links Scrolling to Top

When clicking a blog post link from the homepage, the page should scroll to the top. The `BlogPost.tsx` already calls `window.scrollTo(0, 0)`, but this may not fire reliably with React Router.

**Fix:** Add a `ScrollToTop` component in `App.tsx` that listens to route changes and scrolls to top on every navigation. This is the standard React Router pattern.

**Files changed:**
- `src/App.tsx` — add a `ScrollToTop` component inside `BrowserRouter` that uses `useLocation` + `useEffect` to scroll to top on pathname change

### Technical Details

**ScrollToTop component** (inline in App.tsx):
```tsx
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
```

Place it inside `<BrowserRouter>` before `<Routes>`.

