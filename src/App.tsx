import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  useEffect(() => {
    let activeServiceTitle: string | null = null;

    const computeBaseTitle = () => {
      const href = window.location.href.toLowerCase();
      const language = i18n.language?.toLowerCase() || "en";
      const isCz = href.includes("/cz") || language.startsWith("cz") || language.startsWith("cs");

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
      return "Rokofsky Communication Training";
    };

    const isHomeRoute = () => {
      const path = window.location.pathname.replace(/\/$/, "");
      return path === "" || path === "/cz";
    };

    const applyTitle = () => {
      // On home route, an active service card overrides the base title.
      if (isHomeRoute() && activeServiceTitle) {
        const next = `${activeServiceTitle} | Rokofsky`;
        if (window.document.title !== next) window.document.title = next;
        return;
      }
      const next = computeBaseTitle();
      if (window.document.title !== next) window.document.title = next;
    };

    applyTitle();
    const titleInterval = window.setInterval(applyTitle, 300);

    // IntersectionObserver: track which service card is most visible.
    let observer: IntersectionObserver | null = null;
    const visibility = new Map<Element, number>();

    const setupObserver = () => {
      if (!isHomeRoute()) {
        observer?.disconnect();
        observer = null;
        visibility.clear();
        if (activeServiceTitle !== null) {
          activeServiceTitle = null;
          applyTitle();
        }
        return;
      }
      const cards = document.querySelectorAll<HTMLElement>("[data-service-card]");
      if (!cards.length) return;

      observer?.disconnect();
      visibility.clear();
      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            visibility.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
          }
          let bestEl: Element | null = null;
          let bestRatio = 0;
          visibility.forEach((ratio, el) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestEl = el;
            }
          });
          // Require a meaningful portion to be visible before overriding the title.
          const MIN_RATIO = 0.5;
          if (bestEl && bestRatio >= MIN_RATIO) {
            const title = (bestEl as HTMLElement).getAttribute("data-service-title");
            if (title && title !== activeServiceTitle) {
              activeServiceTitle = title;
              applyTitle();
            }
          } else if (activeServiceTitle !== null) {
            activeServiceTitle = null;
            applyTitle();
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      cards.forEach((c) => observer!.observe(c));
    };

    // Initial setup + retries while the page hydrates.
    setupObserver();
    const setupTimers = [200, 600, 1500, 3000].map((ms) =>
      window.setTimeout(setupObserver, ms)
    );

    // Re-evaluate on navigation changes.
    const onPopState = () => setupObserver();
    window.addEventListener("popstate", onPopState);

    return () => {
      window.clearInterval(titleInterval);
      setupTimers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("popstate", onPopState);
      observer?.disconnect();
    };
  }, []);

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
