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

/**
 * GlobalSeoSync — single command center for document.title and meta description.
 * Driven by useLocation (path + hash) and i18n.language so it reacts to both
 * navigation and language toggles. NO page is allowed to set document.title;
 * all titles live in the TITLE_MAP / DESC_MAP below.
 */
type Lang = "en" | "cs";
const BRAND = "Rokofsky";

// Path key → { en, cs } title (without brand suffix)
const TITLE_MAP: Record<string, Record<Lang, string>> = {
  "/":            { en: "Rokofsky Communication Training", cs: "Rokofsky Communication Training" },
  "/bio":         { en: "About Howard", cs: "O mně" },
  "/services":    { en: "Services", cs: "Služby" },
  "/faq":         { en: "FAQ", cs: "Časté dotazy" },
  "/pricing":     { en: "Pricing", cs: "Ceník" },
  "/references":  { en: "References", cs: "Reference" },
  "/blog":        { en: "Blog", cs: "Blog" },
  "/contact":     { en: "Contact", cs: "Kontakt" },
};

const DESC_MAP: Record<string, Record<Lang, string>> = {
  "/":            {
    en: "Communication training in Prague: presentations, storytelling, negotiation, coaching and conflict mediation for teams and leaders.",
    cs: "Komunikační trénink v Praze: prezentace, storytelling, vyjednávání, koučink a mediace konfliktů pro týmy a lídry.",
  },
  "/bio":         {
    en: "Meet Howard Rokofsky — soft skills and storytelling trainer helping teams communicate with clarity and impact.",
    cs: "Seznamte se s Howardem Rokofským – trenérem soft skills a storytellingu, který pomáhá týmům komunikovat jasně a s dopadem.",
  },
  "/services":    {
    en: "Communication services: presentations, storytelling, negotiation, coaching and conflict mediation.",
    cs: "Komunikační služby: prezentace, storytelling, vyjednávání, koučink a mediace konfliktů.",
  },
  "/faq":         {
    en: "Answers to frequently asked questions about Howard Rokofsky's communication trainings, workshops and coaching.",
    cs: "Odpovědi na nejčastější dotazy o komunikačních trénincích, workshopech a koučinku Howarda Rokofského.",
  },
  "/pricing":     {
    en: "Transparent pricing for Howard Rokofsky's communication trainings, workshops and coaching.",
    cs: "Transparentní ceník komunikačních tréninků, workshopů a koučinku Howarda Rokofského.",
  },
  "/references":  {
    en: "Testimonials and client projects from Howard Rokofsky's communication training engagements.",
    cs: "Reference a klientské projekty z komunikačních tréninků Howarda Rokofského.",
  },
  "/blog":        {
    en: "Articles and tips on communication, storytelling and leadership from Howard Rokofsky.",
    cs: "Články a tipy o komunikaci, storytellingu a leadershipu od Howarda Rokofského.",
  },
  "/contact":     {
    en: "Get in touch with Howard Rokofsky — I personally reply by the next day.",
    cs: "Spojte se s Howardem Rokofským – odpovídám osobně nejpozději druhý den.",
  },
};

/** Resolve the canonical key from raw URL pathname + hash. */
function resolveKey(pathname: string, hash: string): string {
  // Strip /cz prefix
  const path = pathname.replace(/^\/cz(\/|$)/, "/") || "/";
  const h = (hash || "").toLowerCase().replace(/^#/, "");

  // Hash sections on home
  if (path === "/") {
    if (h.includes("faq")) return "/faq";
    if (h.includes("pricing") || h.includes("cenik") || h.includes("ceník")) return "/pricing";
    if (h.includes("contact") || h.includes("kontakt")) return "/contact";
    if (h.includes("services") || h.includes("sluzby") || h.includes("služby")) return "/services";
    return "/";
  }
  if (path.startsWith("/bio")) return "/bio";
  if (path.startsWith("/references") || path.startsWith("/reference")) return "/references";
  if (path.startsWith("/blog")) return "/blog";
  if (
    path.startsWith("/services/") ||
    path.startsWith("/storytelling-workshops") ||
    path.startsWith("/keynote-topics")
  ) return "/services";
  return "/";
}

function upsertMetaName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function upsertMetaProp(prop: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function GlobalSeoSync() {
  const { pathname, hash } = useLocation();
  const { i18n } = useTranslation();
  const lang: Lang =
    pathname.startsWith("/cz/") || pathname === "/cz" || i18n.language?.startsWith("cs")
      ? "cs"
      : "en";

  useEffect(() => {
    const apply = (currentHash: string) => {
      const key = resolveKey(pathname, currentHash);
      const baseTitle = TITLE_MAP[key]?.[lang] ?? "Rokofsky Communication Training";
      const description = DESC_MAP[key]?.[lang] ?? "";

      // Home gets no brand suffix (already contains it).
      const fullTitle =
        key === "/" ? baseTitle : `${baseTitle} | ${BRAND}`;

      document.title = fullTitle;
      upsertMetaName("description", description);
      upsertMetaName("twitter:title", fullTitle);
      upsertMetaName("twitter:description", description);
      upsertMetaProp("og:title", fullTitle);
      upsertMetaProp("og:description", description);
    };

    apply(hash);

    // Hash-only changes don't trigger react-router re-renders. Listen directly.
    const onHashChange = () => apply(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname, hash, lang]);

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
