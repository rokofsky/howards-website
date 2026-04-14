import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Bio from "./pages/Bio";
import References from "./pages/References";
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

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }); }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/references" element={<References />} />
          <Route path="/storytelling-workshops" element={<StorytellingWorkshops />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/keynote-topics" element={<KeynoteTopics />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/webinars/:slug" element={<WebinarDetail />} />
          <Route path="/admin/sessions" element={<AdminSessions />} />
          <Route path="/admin/webinars" element={<AdminWebinars />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
