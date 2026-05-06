import { useEffect } from "react";
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

    const apply = () => {
      const hash = window.location.hash.toLowerCase();
      const suffix = ` | ${BRAND}`;
      let next = homeTitle;
      if (hash.includes("contact")) next = `${isCz ? "Kontakt" : "Contact"}${suffix}`;
      else if (hash.includes("services")) next = `${isCz ? "Služby" : "Services"}${suffix}`;
      else if (hash.includes("faq")) next = `FAQ${suffix}`;
      else if (hash.includes("pricing")) next = `${isCz ? "Ceník" : "Pricing"}${suffix}`;
      if (document.title !== next) document.title = next;
    };

    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
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
          <Button variant="glassPetrol" size="lg" onClick={openCalendly}>
            {t("Skip the email, book a call now", "Zapomeňte na e-mail – rovnou si domluvte hovor")}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
