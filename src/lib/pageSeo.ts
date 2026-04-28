/**
 * DEPRECATED — SEO is now managed centrally by GlobalSeoSync in src/App.tsx.
 * This function is intentionally a no-op so any lingering imports cannot
 * race with the central command center.
 */
export function setPageSeo(_title: string, _description: string) {
  // no-op: do not set document.title or meta tags from page components.
}
