import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getServiceShortTitle } from "@/lib/serviceTitles";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import i18n from "./i18n";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Bio from "./pages/Bio";
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

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }); }, [pathname]);
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
    const DEFAULT_TITLE = "Rokofsky Communication Training";

    const setTitle = (title: string) => {
      if (window.document.title !== title) {
        window.document.title = title;
      }
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
      const href = window.location.href.toLowerCase();
      const isCz = isCzNow();

      if (href.includes("#contact-area") || href.includes("#contact")) {
        return `${isCz ? "Kontakt" : "Contact"} | Rokofsky`;
      } else if (href.includes("#services")) {
        return `${isCz ? "Služby" : "Services"} | Rokofsky`;
      } else if (href.includes("#faq")) {
        return `${isCz ? "Časté dotazy" : "FAQ"} | Rokofsky`;
      } else if (href.includes("#pricing")) {
        return `${isCz ? "Ceník" : "Pricing"} | Rokofsky`;
      } else if (href.includes("/bio")) {
        return `Bio | Rokofsky`;
      } else if (href.includes("/blog")) {
        return `Blog | Rokofsky`;
      } else if (href.includes("/references") || href.includes("/reference")) {
        return `${isCz ? "Reference" : "References"} | Rokofsky`;
      }
      return DEFAULT_TITLE;
    };

    const applyTitle = () => {
      const isCz = isCzNow();

      // On a service detail route, derive slug from URL.
      if (isServiceRoute()) {
        const slug = getServiceSlugFromPath();
        const short = slug ? getServiceShortTitle(slug, isCz) : null;
        if (short) {
          setTitle(`${short} | Rokofsky`);
          return;
        }
      }

      // On home, use clicked-service slug (if any).
      if (isHomeRoute() && activeSlugRef.current) {
        const short = getServiceShortTitle(activeSlugRef.current, isCz);
        if (short) {
          setTitle(`${short} | Rokofsky`);
          return;
        }
      }

      setTitle(isHomeRoute() ? DEFAULT_TITLE : computeRouteTitle());
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
    const onLanguageChanged = () => applyTitle();
    window.addEventListener("popstate", onPopState);
    window.addEventListener("rokofsky:service-active", onServiceActivated);
    i18n.on("languageChanged", onLanguageChanged);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("rokofsky:service-active", onServiceActivated);
      i18n.off("languageChanged", onLanguageChanged);
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
