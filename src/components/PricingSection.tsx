import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useT";
import { useIsCzech } from "@/hooks/useLanguageRouting";
import KeynoteInquiryModal from "@/components/KeynoteInquiryModal";
import InhouseInquiryModal from "@/components/InhouseInquiryModal";

const PricingSection = () => {
  const t = useT();
  const isCz = useIsCzech();
  const [keynoteOpen, setKeynoteOpen] = useState(false);
  const [inhouseOpen, setInhouseOpen] = useState(false);

  const tiers = [
    {
      name: t("Live Webinars", "Živé webináře"),
      price: t("From CZK 2,500 (€100)", "Od 2 500 Kč (100 €)"),
      description: t(
        "From 2 hours to a full day of interactive team learning.",
        "Od 2 hodin po celý den interaktivního týmového vzdělávání."
      ),
      features: [
        t("2–6 hour sessions", "Setkání v délce 2–6 hodin"),
        t("Up to 100 participants", "Až 100 účastníků"),
        t("Flexible timing options", "Flexibilní časové možnosti"),
      ],
      highlighted: true,
      cta: {
        label: t("Choose a live webinar", "Vyberte si webinář"),
        to: isCz ? "/cz/services/online-webinars" : "/services/online-webinars",
      },
    },
    {
      name: t("Inhouse Workshops", "Firemní workshopy"),
      price: t("From CZK 25,000 (€1000)", "Od 25 000 Kč (1 000 €)"),
      description: t("Training for teams.", "Školení pro týmy."),
      features: [
        t("1-3 days", "1-3 dny"),
        t("Custom exercises & materials", "Cvičení a materiály na míru"),
        t("Modules can be combined", "Moduly lze kombinovat"),
        t("Follow-up resources", "Navazující materiály"),
        t("Follow-up personal contact", "Následný osobní kontakt"),
      ],
      inquireInhouse: true,
    },
    {
      name: t("Keynote Speaking", "Hlavní přednáška"),
      price: t("From CZK 30,000 (€1,200)", "Od 30 000 Kč (1 200 €)"),
      description: t(
        "A speaking engagement your audience will talk about.",
        "Jednorázové vystoupení, o kterém bude Vaše publikum mluvit."
      ),
      features: [
        t("60–90 minute session", "Vystoupení v délce 60–90 minut"),
        t("Custom topic & storytelling", "Téma a vyprávění na míru"),
        t("Q&A session", "Diskuse s publikem"),
        t("Recording rights available", "Možnost práv k záznamu"),
      ],
      inquire: true,
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {t("Investment", "Investice")}
        </h2>
        <p className="text-primary font-semibold">
          {t(
            "No hidden fees. No surprise \"strategy sessions\".",
            "Žádné skryté poplatky. Žádné překvapivé „strategické konzultace“."
          )}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-lg p-8 flex flex-col ${tier.highlighted ? "glass glow-gold border-gold/20" : "glass"}`}
          >
            <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
            <p className="text-2xl font-bold text-gold mb-3">{tier.price}</p>
            <p className="text-sm text-muted-foreground mb-6 font-normal">{tier.description}</p>
            <ul className="space-y-2 mb-6">
              {tier.features.map((f, j) => (
                <li key={j} className="text-sm text-foreground/80 flex items-start gap-2 font-normal">
                  <span className="text-gold mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {tier.cta && (
              <div className="mt-auto pt-2">
                <Button asChild variant="cta" className="w-full">
                  <Link to={tier.cta.to}>{tier.cta.label}</Link>
                </Button>
              </div>
            )}
            {tier.inquire && (
              <div className="mt-auto pt-2">
                <Button
                  type="button"
                  variant="cta"
                  className="w-full"
                  onClick={() => setKeynoteOpen(true)}
                >
                  {t("Inquire", "Poptat")}
                </Button>
              </div>
            )}
            {tier.inquireInhouse && (
              <div className="mt-auto pt-2">
                <Button
                  type="button"
                  variant="cta"
                  className="w-full"
                  onClick={() => setInhouseOpen(true)}
                >
                  {t("Inquire", "Poptat")}
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <KeynoteInquiryModal open={keynoteOpen} onOpenChange={setKeynoteOpen} />
      <InhouseInquiryModal open={inhouseOpen} onOpenChange={setInhouseOpen} />
    </section>
  );
};

export default PricingSection;
