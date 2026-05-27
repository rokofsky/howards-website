import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getServiceShortTitle } from "@/lib/serviceTitles";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import i18n from "./i18n";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Bio from "./pages/Bio";
import CV from "./pages/CV";
import References from "./pages/References";
import ReferenceScans from "./pages/ReferenceScans";
import ReferenceScanViewer from "./pages/ReferenceScanViewer";
import StorytellingWorkshops from "./pages/StorytellingWorkshops";
import ServiceDetail from "./pages/ServiceDetail";
import KeynoteTopics from "./pages/KeynoteTopics";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import WebinarDetail from "./pages/WebinarDetail";
import AdminSessions from "./pages/AdminSessions";
import AdminWebinars from "./pages/AdminWebinars";
import RokofAdmin from "./pages/RokofAdmin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GDPR from "./pages/GDPR";
import TermsOfService from "./pages/TermsOfService";
import { useLanguageSync } from "./hooks/useLanguageRouting";
import { initGlobalTracking, initScrollDepth } from "./lib/analytics";

const queryClient = new QueryClient();

function AnalyticsBootstrap() {
  useEffect(() => {
    initGlobalTracking();
    const teardown = initScrollDepth();
    return teardown;
  }, []);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevRef = useRef<string | null>(null);
  useEffect(() => {
    const normalize = (p: string) => p.replace(/^\/cz(\/|$)/, "/").replace(/\/$/, "") || "/";
    const current = normalize(pathname);
    if (prevRef.current !== null && prevRef.current === current) {
      // Language toggle on the same page — preserve scroll position.
      prevRef.current = current;
      return;
    }
    prevRef.current = current;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function LanguageSyncWrapper({ children }: { children: React.ReactNode }) {
  useLanguageSync();
  return <>{children}</>;
}

function GlobalSeoSync() {
  const location = useLocation();
  const activeSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const BRAND = "Rokofsky Communication";
    const DEFAULT_TITLE = `${BRAND} | Training & Coaching`;
    const DEFAULT_TITLE_CZ = `${BRAND} | Trénink a koučink`;

    let rafId: number | null = null;
    let pendingTitle: string | null = null;
    const setTitle = (title: string) => {
      pendingTitle = title;
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        if (pendingTitle && window.document.title !== pendingTitle) {
          window.document.title = pendingTitle;
        }
        pendingTitle = null;
      });
    };

    const isCzNow = () => {
      const path = window.location.pathname;
      return path === "/cz" || path.startsWith("/cz/");
    };

    const isHomeRoute = () => {
      const path = window.location.pathname.replace(/\/$/, "");
      return path === "" || path === "/cz";
    };

    const isServiceRoute = () => window.location.pathname.includes("/services/");

    const getServiceSlugFromPath = (): string | null => {
      const m = window.location.pathname.match(/\/services\/([^/?#]+)/);
      return m ? m[1] : null;
    };

    const computeRouteTitle = () => {
      const path = window.location.pathname.toLowerCase();
      const isCz = isCzNow();
      const suffix = ` | ${BRAND}`;

      if (path.includes("/cv")) {
        return `CV${suffix}`;
      } else if (path.includes("/bio")) {
        return `Bio${suffix}`;
      } else if (path.includes("/blog")) {
        return `Blog${suffix}`;
      } else if (path.includes("/references") || path.includes("/reference")) {
        return `${isCz ? "Reference" : "References"}${suffix}`;
      }
      return isCz ? DEFAULT_TITLE_CZ : DEFAULT_TITLE;
    };

    const isBlogPostRoute = () =>
      /\/blog\/[^/?#]+/.test(window.location.pathname);

    const applyTitle = () => {
      const isCz = isCzNow();

      // Helmet manages title for blog posts and service details.
      if (isBlogPostRoute() || isServiceRoute()) return;

      // On home, use clicked-service slug (if any).
      if (isHomeRoute() && activeSlugRef.current) {
        const short = getServiceShortTitle(activeSlugRef.current, isCz);
        if (short) {
          setTitle(`${short} | ${BRAND}`);
          return;
        }
      }

      setTitle(isHomeRoute() ? (isCz ? DEFAULT_TITLE_CZ : DEFAULT_TITLE) : computeRouteTitle());
    };

    const onServiceActivated = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const slug = typeof detail === "string" ? null : detail?.slug;
      if (slug && slug !== activeSlugRef.current) {
        activeSlugRef.current = slug;
        applyTitle();
      }
    };

    // Reset active slug when navigating away from home AND not on a service route.
    if (!isHomeRoute() && !isServiceRoute()) {
      activeSlugRef.current = null;
    }

    applyTitle();

    const onPopState = () => applyTitle();
    const onHashChange = () => applyTitle();
    const onLocationChange = () => applyTitle();
    const onLanguageChanged = () => applyTitle();
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("rokofsky:locationchange", onLocationChange);
    window.addEventListener("rokofsky:service-active", onServiceActivated);
    i18n.on("languageChanged", onLanguageChanged);

    // Patch history methods once so replaceState/pushState trigger title updates.
    const w = window as unknown as { __rokofskyHistoryPatched?: boolean };
    if (!w.__rokofskyHistoryPatched) {
      w.__rokofskyHistoryPatched = true;
      const origPush = window.history.pushState.bind(window.history);
      const origReplace = window.history.replaceState.bind(window.history);
      window.history.pushState = (...args: Parameters<typeof origPush>) => {
        const r = origPush(...args);
        window.dispatchEvent(new Event("rokofsky:locationchange"));
        return r;
      };
      window.history.replaceState = (...args: Parameters<typeof origReplace>) => {
        const r = origReplace(...args);
        window.dispatchEvent(new Event("rokofsky:locationchange"));
        return r;
      };
    }

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("rokofsky:locationchange", onLocationChange);
      window.removeEventListener("rokofsky:service-active", onServiceActivated);
      i18n.off("languageChanged", onLanguageChanged);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [location.pathname, location.hash]);

  return null;
}

/** Shared page routes — rendered at root and under /cz */
function PageRoutes() {
  return (
    <>
      <Route index element={<Index />} />
      <Route path="bio" element={<Bio />} />
      <Route path="cv" element={<CV />} />
      <Route path="references" element={<References />} />
      <Route path="reference" element={<References />} />
      <Route path="references/scans" element={<ReferenceScans />} />
      <Route path="reference/scans" element={<ReferenceScans />} />
      <Route path="references/scans/:slot" element={<ReferenceScanViewer />} />
      <Route path="reference/scans/:slot" element={<ReferenceScanViewer />} />
      <Route path="storytelling-workshops" element={<StorytellingWorkshops />} />
      <Route path="services/:slug" element={<ServiceDetail />} />
      <Route path="keynote-topics" element={<KeynoteTopics />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:slug" element={<BlogPost />} />
      <Route path="webinars/:slug" element={<WebinarDetail />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="ochrana-soukromi" element={<PrivacyPolicy />} />
      <Route path="gdpr" element={<GDPR />} />
      <Route path="terms-of-service" element={<TermsOfService />} />
      <Route path="obchodni-podminky" element={<TermsOfService />} />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageSyncWrapper>
          <ScrollToTop />
          <GlobalSeoSync />
          <AnalyticsBootstrap />
          <Routes>
            {/* English routes (root) */}
            <Route path="/">{PageRoutes()}</Route>

            {/* Czech routes (/cz prefix) */}
            <Route path="/cz">{PageRoutes()}</Route>

            {/* Admin routes — no language prefix needed */}
            <Route path="/admin/sessions" element={<AdminSessions />} />
            <Route path="/admin/webinars" element={<AdminWebinars />} />
            <Route path="/rokofsky-admin" element={<RokofAdmin />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageSyncWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
