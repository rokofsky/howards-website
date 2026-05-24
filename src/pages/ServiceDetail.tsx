import { useParams, Link, useNavigate } from "react-router-dom";
import { useLocalizedPath, useIsCzech } from "@/hooks/useLanguageRouting";
import { openCalendly } from "@/lib/calendly";
import { useEffect, useState } from "react";
import MobileTruncatedText from "@/components/MobileTruncatedText";
import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { services } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { serviceDetails, pickL } from "@/data/serviceDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { Helmet } from "react-helmet-async";

import whiteHat from "@/assets/hats/white-hat.jpg";
import blackHat from "@/assets/hats/black-hat.jpg";
import redHat from "@/assets/hats/red-hat.jpg";
import greenHat from "@/assets/hats/green-hat.jpg";
import yellowHat from "@/assets/hats/yellow-hat.jpg";
import blueHat from "@/assets/hats/blue-hat.jpg";

const hatImages: Record<string, string> = {
  "white-hat": whiteHat,
  "black-hat": blackHat,
  "red-hat": redHat,
  "green-hat": greenHat,
  "yellow-hat": yellowHat,
  "blue-hat": blueHat,
};

interface DbWebinar {
  id: string;
  slug: string;
  title: string;
  description: string;
}

const ServiceDetail = () => {
  const lp = useLocalizedPath();
  const isCz = useIsCzech();
  const lang: "en" | "cs" = isCz ? "cs" : "en";
  const t = useT();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [webinars, setWebinars] = useState<DbWebinar[]>([]);
  const [expandedWebinar, setExpandedWebinar] = useState<string | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (slug === "online-webinars") {
      supabase.from("webinars").select("*").order("sort_order", { ascending: true }).then(({ data }) => {
        if (data) setWebinars(data as DbWebinar[]);
      });
    }
  }, [slug]);

  const handleAddWebinarClick = () => {
    setShowPasswordPrompt(true);
  };

  const handleAddWebinarAuth = async () => {
    try {
      const res = await supabase.functions.invoke("admin-webinars", {
        method: "POST",
        body: { password: adminPassword, action: "verify" },
      });
      if (res.data?.ok) {
        navigate("/admin/webinars");
      } else {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= 2) {
          navigate("/");
        } else {
          toast({ title: "Wrong password", variant: "destructive" });
        }
      }
    } catch {
      toast({ title: "Error verifying password", variant: "destructive" });
    }
  };

  const service = services.find((s) => s.slug === slug);
  const detail = slug ? serviceDetails[slug] : undefined;

  if (!service) {
    return (
      <Layout>
        <div className="section-padding pt-24 text-center">
          <h1 className="text-3xl font-bold">{t("Service not found", "Služba nenalezena")}</h1>
        </div>
      </Layout>
    );
  }

  const serviceTitle = pickL(service.title, lang);
  const serviceHook = pickL(service.hook, lang);
  const inquiryTitle = slug === "conflict-resolution"
    ? t("Conflict mediation/resolution", "Mediace / řešení konfliktů")
    : slug === "meetings-moderation"
    ? t("The Six Hats Method for Meetings", "Metoda Šesti klobouků pro porady")
    : slug === "online-webinars"
    ? t("Online webinars", "Online webináře")
    : serviceTitle;

  const subtitle = pickL(service.subtitle, lang);
  const seoDescRaw = (detail?.lead ? pickL(detail.lead, lang) : "") || subtitle || serviceHook || `${serviceTitle} — Rokofsky Communication`;
  const seoDesc = (seoDescRaw.replace(/\s+/g, " ").trim().slice(0, 157) + (seoDescRaw.length > 157 ? "…" : "")).trim();
  const canonical = `https://howards-website.lovable.app${isCz ? "/cz" : ""}/services/${slug}`;
  const fullTitle = `${serviceTitle} | Rokofsky`;

  return (
    <Layout>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: serviceTitle,
            description: seoDesc,
            provider: { "@type": "Organization", name: "Rokofsky Communication", url: "https://howards-website.lovable.app/" },
            areaServed: "Prague, Czech Republic",
            url: canonical,
          })}
        </script>
      </Helmet>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-5xl font-medium mb-3">{serviceTitle}</h1>

            {detail?.taglines ? (
              detail.taglines.map((line, idx) => (
                <p key={idx} className="text-xl text-muted-foreground font-light italic mb-2">{pickL(line, lang)}</p>
              ))
            ) : (
              <>
                {serviceHook && <p className="text-xl text-muted-foreground italic mb-3 font-normal">{serviceHook}</p>}
                {detail?.lead && <p className="text-lg text-foreground/80 leading-relaxed mb-8 font-normal">{pickL(detail.lead, lang)}</p>}
              </>
            )}

            <div className={`rounded-lg p-8 mb-12 mt-6 ${detail?.tone === "executive" ? "border border-gold/40 bg-card shadow-[0_20px_60px_-30px_hsl(var(--foreground)/0.55)]" : "glass"}`}>
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                {detail?.pageTitle ? pickL(detail.pageTitle, lang) : t("About This Service", "O této službě")}
              </h2>

              {slug === "online-webinars" ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {webinars.map((webinar) => (
                      <div key={webinar.id} className="flex flex-col justify-between rounded-lg border border-border bg-card p-2 md:p-5 hover:border-gold/50 transition-colors">
                        <div>
                          <h3 className="text-xs md:text-base font-semibold text-foreground mb-2">{webinar.title}</h3>
                          {webinar.description && (
                            <p className="hidden md:block text-foreground/60 text-sm font-normal leading-relaxed">{webinar.description}</p>
                          )}
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="glass"
                            size="sm"
                            className="text-xs md:text-sm"
                            onClick={() => setExpandedWebinar(webinar.id)}
                          >
                            {t("Inquire", "Poptat")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Dialog open={!!expandedWebinar} onOpenChange={(open) => { if (!open) setExpandedWebinar(null); }}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{webinars.find((w) => w.id === expandedWebinar)?.title ?? t("Inquire", "Poptat")}</DialogTitle>
                      </DialogHeader>
                      <ContactForm
                        serviceName={webinars.find((w) => w.id === expandedWebinar)?.title ?? ""}
                        showServiceFields
                        formKind="webinar"
                      />
                    </DialogContent>
                  </Dialog>
                  <div className="mt-6">
                    {showPasswordPrompt ? (
                      <div className="flex gap-2 items-center max-w-sm">
                        <Input
                          type="password"
                          placeholder={t("Admin password", "Admin heslo")}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddWebinarAuth()}
                        />
                        <Button onClick={handleAddWebinarAuth}>Go</Button>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={handleAddWebinarClick}>
                        {t("Add Webinar", "Přidat webinář")}
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <MobileTruncatedText
                  paragraphs={
                    detail?.intro && detail.intro.length > 0
                      ? detail.intro.map((p) => pickL(p, lang)).filter((s) => s.trim().length > 0)
                      : [
                          t(
                            "Howard brings his signature blend of storytelling, practical frameworks, and just enough humor to keep everyone awake. This service is tailored to your team's specific needs, challenges, and goals.",
                            "Howard přináší svou typickou kombinaci vyprávění, praktických rámců a tak akorát humoru, aby všechny udržel vzhůru. Tato služba je šitá na míru konkrétním potřebám, výzvám a cílům vašeho týmu."
                          ),
                          t(
                            "Every engagement starts with a brief discovery call to understand your context. From there, Howard designs a custom experience that delivers measurable improvements in how your team communicates, collaborates, and leads.",
                            "Každá spolupráce začíná krátkým úvodním hovorem, abychom porozuměli vašemu kontextu. Na jeho základě Howard navrhne na míru řešení, které přinese měřitelná zlepšení v tom, jak váš tým komunikuje, spolupracuje a vede."
                          ),
                        ]
                  }
                  className="text-foreground/80 leading-relaxed font-normal"
                />
              )}
            </div>

            {detail?.highlight && detail.highlightPosition !== "bottom" && (
              <div className="mb-12 rounded-lg border border-gold/50 bg-card px-6 py-5 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.7)]">
                <h3 className="text-lg font-semibold mb-2">{pickL(detail.highlight.title, lang)}</h3>
                <p className="text-foreground/80 font-light leading-relaxed">{pickL(detail.highlight.text, lang)}</p>
              </div>
            )}

            {detail?.sections.map((section, sectionIndex) => {
              const sectionTitle = pickL(section.title, lang);
              return (
                <div key={sectionIndex} className={`${slug === "meetings-moderation" && sectionIndex === detail.sections.length - 1 ? "mb-4" : "mb-10"}`}>
                  {detail?.tone !== "executive" && sectionTitle.trim().length > 0 && (
                    <h3 className="text-2xl font-semibold mb-2 whitespace-pre-line">{sectionTitle}</h3>
                  )}

                  {section.paragraphs && (
                    detail?.tone === "executive" ? (
                      <div className="rounded-lg border border-gold/40 bg-card px-6 py-5 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.7)]">
                        <h3 className="text-lg font-semibold mb-2">{sectionTitle}</h3>
                        <MobileTruncatedText
                          paragraphs={section.paragraphs.map((p) => pickL(p, lang))}
                          className="text-foreground/80 leading-relaxed mb-4 last:mb-0 whitespace-pre-line font-normal"
                        />
                      </div>
                    ) : (
                      <MobileTruncatedText
                        paragraphs={section.paragraphs.map((p) => pickL(p, lang))}
                        className="text-foreground/80 leading-relaxed mb-4 last:mb-0 whitespace-pre-line font-normal"
                      />
                    )
                  )}

                  {section.numbered && (
                    <ol className="space-y-1.5 list-decimal pl-5 text-foreground/80 font-light leading-relaxed">
                      {section.numbered.map((item, i) => (
                        <li key={i} className="font-normal">{pickL(item, lang)}</li>
                      ))}
                    </ol>
                  )}

                  {section.hatBullets && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {section.hatBullets.map((hat, i) => {
                        const hatLabel = pickL(hat.hat, lang);
                        return (
                          <div key={i} className="flex gap-4 items-start rounded-lg border border-border bg-card p-4">
                            <img
                              src={hatImages[hat.image]}
                              alt={hatLabel}
                              className="w-14 h-14 object-contain shrink-0"
                            />
                            <div>
                              <h4 className="text-sm mb-1 font-extrabold" style={{ color: hat.color === "#FFFFFF" ? "hsl(var(--foreground))" : hat.color }}>{hatLabel}</h4>
                              <p className="text-foreground/70 font-light text-sm leading-relaxed">{pickL(hat.description, lang)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {section.bullets && (
                    <ul className={`grid ${slug === "storytelling" ? "gap-0.5" : "gap-0.5"} text-foreground/80 font-light leading-relaxed pl-0 whitespace-pre-line ${slug === "meetings-moderation" && (section.title.en || "").includes("People who are comfortable") ? "mt-1" : ""}`}>
                      {section.bullets.map((item, i) => {
                        const text = pickL(item, lang);
                        if (!text.trim()) return null;
                        const isKeynoteLaughLine = slug === "keynote-speaking" && (item.en || "").includes("Still, you'll probably laugh");
                        return (
                          <li key={i} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span className="font-normal">
                              {text}
                              {isKeynoteLaughLine && (
                                <>
                                  {" "}
                                  <Link to={lp("/keynote-topics")} className="text-gold hover:text-gold/80 underline underline-offset-2 transition-colors">
                                    {t("Click to see some of the topics you can choose from", "Klikněte a podívejte se na témata, ze kterých si můžete vybrat")}
                                  </Link>
                                </>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}

            {detail?.highlight && detail.highlightPosition === "bottom" && (
              <div className="mb-12 rounded-lg border border-gold/50 bg-card px-6 py-5 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.7)]">
                <h3 className="text-lg font-semibold mb-2">{pickL(detail.highlight.title, lang)}</h3>
                <p className="text-foreground/80 leading-relaxed font-normal">{pickL(detail.highlight.text, lang)}</p>
              </div>
            )}

            {detail?.tableRows && detail.tableTitle && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-4">{pickL(detail.tableTitle, lang)}</h3>
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1.5fr] border-b border-border bg-muted/30 text-sm font-medium text-foreground/80">
                    <div className="px-5 py-4">{t("Phase", "Fáze")}</div>
                    <div className="px-5 py-4 border-t md:border-t-0 md:border-l border-border">{t("What We Do", "Co děláme")}</div>
                    <div className="px-5 py-4 border-t md:border-t-0 md:border-l border-border">{t("The Outcome", "Výsledek")}</div>
                  </div>
                  {detail.tableRows.map((row, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1.5fr] text-sm text-foreground/80 font-light">
                      <div className="px-5 py-4 border-b border-border font-medium text-foreground">{pickL(row.phase, lang)}</div>
                      <div className="px-5 py-4 border-b border-border md:border-l">{pickL(row.action, lang)}</div>
                      <div className="px-5 py-4 border-b border-border md:border-l">{pickL(row.outcome, lang)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div id="inquiry-form">
            <h2 className="text-2xl font-bold text-center mb-2">
              {t("Inquire about", "Poptávka:")} {inquiryTitle}
            </h2>
            <p className="text-muted-foreground text-center mb-8 font-normal">
              {t(
                "Fill in some stuff below (mostly optional) and I'll get back to you next day.",
                "Vyplňte níže pár údajů (většinou nepovinných) a ozvu se Vám následující den."
              )}
            </p>
            <ContactForm serviceName={serviceTitle} showServiceFields />
            <div className="text-center mt-8">
              <Button variant="glassPetrol" size="lg" onClick={openCalendly}>
                {t("Skip the email, book a call now", "Zapomeňte na e-mail, rovnou si domluvte hovor")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
