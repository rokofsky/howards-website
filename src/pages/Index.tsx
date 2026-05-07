import { useEffect } from "react";
import i18n from "@/i18n";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import SubHeroNav from "@/components/SubHeroNav";
import ServicesGrid from "@/components/ServicesGrid";
import VideoShowcase from "@/components/VideoShowcase";
import ContactForm from "@/components/ContactForm";
import BookingSection from "@/components/BookingSection";
import FAQSection from "@/components/FAQSection";
import PricingSection from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { openCalendly } from "@/lib/calendly";
import { useT } from "@/hooks/useT";
import { useIsCzech } from "@/hooks/useLanguageRouting";

const BRAND = "Rokofsky Communication";

const Index = () => {
  const t = useT();
  const isCz = useIsCzech();

  useEffect(() => {
    const homeTitle = isCz
      ? `${BRAND} | Trénink a koučink`
      : `${BRAND} | Training & Coaching`;

    const compute = () => {
      const hash = window.location.hash.toLowerCase();
      const suffix = ` | ${BRAND}`;
      let next = homeTitle;
      if (hash.includes("contact")) next = `${isCz ? "Kontakt" : "Contact"}${suffix}`;
      else if (hash.includes("services")) next = `${isCz ? "Služby" : "Services"}${suffix}`;
      else if (hash.includes("faq")) next = `FAQ${suffix}`;
      else if (hash.includes("pricing")) next = `${isCz ? "Ceník" : "Pricing"}${suffix}`;
      return next;
    };

    let rafId: number | null = null;
    let pendingTitle: string | null = null;
    const apply = () => {
      pendingTitle = compute();
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        if (pendingTitle && document.title !== pendingTitle) {
          document.title = pendingTitle;
        }
        pendingTitle = null;
      });
    };

    apply();
    window.addEventListener("hashchange", apply);
    window.addEventListener("popstate", apply);
    i18n.on("languageChanged", apply);

    // Header uses history.replaceState for in-page hash navigation, which does
    // NOT fire hashchange. Wrap it so we can react to those updates too.
    const origReplace = window.history.replaceState;
    const origPush = window.history.pushState;
    window.history.replaceState = function (...args) {
      const r = origReplace.apply(this, args as Parameters<typeof origReplace>);
      apply();
      return r;
    };
    window.history.pushState = function (...args) {
      const r = origPush.apply(this, args as Parameters<typeof origPush>);
      apply();
      return r;
    };

    // Also catch smooth-scroll driven hash updates as a safety net.
    const interval = window.setInterval(apply, 500);

    return () => {
      window.removeEventListener("hashchange", apply);
      window.removeEventListener("popstate", apply);
      i18n.off("languageChanged", apply);
      window.history.replaceState = origReplace;
      window.history.pushState = origPush;
      window.clearInterval(interval);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [isCz]);

  return (
    <Layout>
      <HeroSection />
      <SubHeroNav />
      <ServicesGrid />
      <FAQSection />
      <PricingSection />
      
      <VideoShowcase />
      <BookingSection />

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t("Email Howard", "Napište Howardovi")}
          </h2>
          <p className="max-w-md mx-auto font-medium text-primary">
            {t(
              "Whether you have a quick question or grand plan, I read and reply to every personal message by next day.",
              "Ať už máte rychlý dotaz nebo velkolepý plán, každou osobní zprávu si přečtu a odpovím na ni nejpozději druhý den."
            )}
          </p>
        </div>
        <ContactForm />
        <div className="text-center mt-8">
          <Button variant="glassPetrol" size="lg" onClick={() => openCalendly(isCz ? "cs" : "en")}>
            {t("Book a Call", "Zamluvit bezplatný hovor")}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
