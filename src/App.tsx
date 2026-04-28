import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import SeoHead from "./components/SeoHead";
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

function GlobalTitleSync() {
  const { pathname, hash } = useLocation();
  const { i18n } = useTranslation();
  const isCz =
    pathname.startsWith("/cz/") ||
    pathname === "/cz" ||
    i18n.language?.startsWith("cs");

  useEffect(() => {
    const path = pathname.replace(/^\/cz/, "") || "/";
    const h = (hash || "").toLowerCase();

    const resolveTitle = (): string => {
      // Hash-based sections on the home page take precedence
      if (path === "/" || path === "") {
        if (h.includes("faq")) return isCz ? "Časté dotazy | Rokofsky" : "FAQ | Rokofsky";
        if (h.includes("pricing") || h.includes("cenik") || h.includes("ceník"))
          return isCz ? "Ceník | Rokofsky" : "Pricing | Rokofsky";
        if (h.includes("contact") || h.includes("kontakt"))
          return isCz ? "Kontakt | Howard Rokofsky" : "Contact | Howard Rokofsky";
        if (h.includes("services") || h.includes("sluzby") || h.includes("služby"))
          return isCz ? "Služby | Rokofsky" : "Services | Rokofsky";
        return "Rokofsky Communication Training";
      }
      if (path.includes("/bio")) return isCz ? "O mně | Rokofsky" : "About Howard | Rokofsky";
      if (path.includes("/references") || path.includes("/reference"))
        return isCz ? "Klienti a projekty | Rokofsky" : "Clients & Projects | Rokofsky";
      if (path.includes("/blog")) return isCz ? "Postřehy a tipy | Rokofsky" : "Insights & Tips | Rokofsky";
      if (path.includes("/services/") || path.includes("/storytelling-workshops") || path.includes("/keynote-topics"))
        return isCz ? "Služby | Rokofsky" : "Services | Rokofsky";
      return "Rokofsky Communication Training";
    };

    const apply = () => {
      document.title = resolveTitle();
    };
    apply();
    // Win the race against page-level useEffects that also set document.title
    const t1 = window.setTimeout(apply, 0);
    const t2 = window.setTimeout(apply, 100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname, hash, isCz, i18n.language]);
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
          <SeoHead />
          <GlobalTitleSync />
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
