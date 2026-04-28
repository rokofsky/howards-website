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
    const resolve = (currentHash: string): { title: string; description: string } => {
      const path = pathname.replace(/^\/cz/, "") || "/";
      const h = (currentHash || "").toLowerCase();

      // Hash-based sections on the home page take precedence
      if (path === "/" || path === "") {
        if (h.includes("faq"))
          return {
            title: isCz ? "Časté dotazy | Rokofsky" : "FAQ | Rokofsky",
            description: isCz
              ? "Odpovědi na nejčastější dotazy o komunikačních trénincích, workshopech a koučinku Howarda Rokofského."
              : "Answers to frequently asked questions about Howard Rokofsky's communication trainings, workshops and coaching.",
          };
        if (h.includes("pricing") || h.includes("cenik") || h.includes("ceník"))
          return {
            title: isCz ? "Ceník | Rokofsky" : "Pricing | Rokofsky",
            description: isCz
              ? "Transparentní ceník komunikačních tréninků, workshopů a koučinku Howarda Rokofského."
              : "Transparent pricing for Howard Rokofsky's communication trainings, workshops and coaching.",
          };
        if (h.includes("contact") || h.includes("kontakt"))
          return {
            title: isCz ? "Kontakt | Howard Rokofsky" : "Contact | Howard Rokofsky",
            description: isCz
              ? "Spojte se s Howardem Rokofským – odpovídám osobně nejpozději druhý den."
              : "Get in touch with Howard Rokofsky — I personally reply by the next day.",
          };
        if (h.includes("services") || h.includes("sluzby") || h.includes("služby"))
          return {
            title: isCz ? "Služby | Rokofsky" : "Services | Rokofsky",
            description: isCz
              ? "Komunikační služby: prezentace, storytelling, vyjednávání, koučink a mediace konfliktů."
              : "Communication services: presentations, storytelling, negotiation, coaching and conflict mediation.",
          };
        return {
          title: "Rokofsky Communication Training",
          description: isCz
            ? "Komunikační trénink v Praze: prezentace, storytelling, vyjednávání, koučink a mediace konfliktů."
            : "Communication training in Prague: presentations, storytelling, negotiation, coaching and conflict mediation.",
        };
      }
      if (path.includes("/bio"))
        return {
          title: isCz ? "O mně | Rokofsky" : "About Howard | Rokofsky",
          description: isCz
            ? "Seznamte se s Howardem Rokofským – trenérem soft skills a storytellingu."
            : "Meet Howard Rokofsky — soft skills and storytelling trainer.",
        };
      if (path.includes("/references") || path.includes("/reference"))
        return {
          title: isCz ? "Klienti a projekty | Rokofsky" : "Clients & Projects | Rokofsky",
          description: isCz
            ? "Reference a hodnocení od klientů Howarda Rokofského."
            : "Testimonials and evaluations from Howard Rokofsky's clients.",
        };
      if (path.includes("/blog"))
        return {
          title: isCz ? "Postřehy a tipy | Rokofsky" : "Insights & Tips | Rokofsky",
          description: isCz
            ? "Články a tipy o komunikaci, storytellingu a leadershipu."
            : "Articles and tips on communication, storytelling and leadership.",
        };
      if (path.includes("/services/") || path.includes("/storytelling-workshops") || path.includes("/keynote-topics"))
        return {
          title: isCz ? "Služby | Rokofsky" : "Services | Rokofsky",
          description: isCz
            ? "Komunikační služby na míru lídrům, týmům a organizacím."
            : "Communication services tailored to leaders, teams and organizations.",
        };
      return {
        title: "Rokofsky Communication Training",
        description: isCz
          ? "Komunikační trénink v Praze."
          : "Communication training in Prague.",
      };
    };

    const upsertDesc = (content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "description");
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const apply = (currentHash?: string) => {
      const { title, description } = resolve(currentHash ?? window.location.hash);
      document.title = title;
      upsertDesc(description);
    };

    apply(hash);
    // Win the race against any page-level useEffects that also set document.title
    const t1 = window.setTimeout(() => apply(hash), 0);
    const t2 = window.setTimeout(() => apply(hash), 100);
    const t3 = window.setTimeout(() => apply(hash), 400);

    // React-router doesn't always re-render on raw hashchange (e.g. anchor clicks
    // that only update the fragment). Listen directly to keep titles in sync.
    const onHashChange = () => apply(window.location.hash);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("hashchange", onHashChange);
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
