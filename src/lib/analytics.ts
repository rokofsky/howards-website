// Lightweight GA4 wrapper + global click/scroll tracking.
// The base gtag script lives in index.html.

type Params = Record<string, unknown>;

export const track = (action: string, params: Params = {}) => {
  if (typeof window === "undefined") return;
  const g = (window as any).gtag;
  if (typeof g === "function") g("event", action, params);
};

export const trackClick = (label: string, params: Params = {}) =>
  track("click", { event_category: "engagement", event_label: label, ...params });

export const trackCTA = (label: string, params: Params = {}) =>
  track("cta_click", { event_category: "conversion", event_label: label, ...params });

const CTA_KEYWORDS = [
  "contact", "book", "calendly", "storytelling", "register", "reserve",
  "kontakt", "zamluvit", "rezervovat", "registrovat", "domluvit", "bezplatn",
  "free", "send", "submit", "odeslat",
];

const isCTAText = (txt: string) => {
  const t = txt.toLowerCase();
  return CTA_KEYWORDS.some((k) => t.includes(k));
};

export function initGlobalTracking() {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.__rokofsky_tracking_init) return;
  w.__rokofsky_tracking_init = true;

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const el = target.closest<HTMLElement>(
      "a, button, [role=button], nav, [data-track]"
    );
    const text = (el?.innerText || (target.innerText ?? "") || "").trim().slice(0, 80);
    const dataTrack = el?.getAttribute("data-track") || undefined;

    // Nav bar clicks
    if (el && el.closest("header nav, header a")) {
      trackClick("nav_link", { label: text, href: (el as HTMLAnchorElement).href });
      return;
    }

    if (el?.tagName === "A" || el?.tagName === "BUTTON" || el?.getAttribute("role") === "button") {
      const label = dataTrack || text || el.getAttribute("aria-label") || "unlabeled";
      const href = (el as HTMLAnchorElement).href || undefined;
      if (isCTAText(label) || isCTAText(href || "")) {
        trackCTA(label, { href, path: window.location.pathname });
      } else {
        trackClick(label, { href, path: window.location.pathname });
      }
      return;
    }

    // Generic / background / static text clicks
    trackClick("generic_click", {
      tag: target.tagName.toLowerCase(),
      text: text || undefined,
      path: window.location.pathname,
    });
  };

  document.addEventListener("click", onClick, { capture: true });
}

export function initScrollDepth(pathMatcher: (path: string) => boolean = (p) => p === "/" || p === "/cz" || p === "/cz/") {
  if (typeof window === "undefined") return () => {};
  const milestones = [25, 50, 75, 100];
  const fired = new Set<number>();

  const onScroll = () => {
    if (!pathMatcher(window.location.pathname)) return;
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const max = (doc.scrollHeight - window.innerHeight) || 1;
    const pct = Math.min(100, Math.round((scrollTop / max) * 100));
    for (const m of milestones) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track("scroll_depth", { event_category: "engagement", event_label: `${m}%`, percent: m, path: window.location.pathname });
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
