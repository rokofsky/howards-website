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
import { WebinarInquiryModal } from "@/components/WebinarInquiryModal";
import { WebinarDetailsModal } from "@/components/WebinarDetailsModal";
import { WebinarOrderForm } from "@/components/WebinarOrderForm";
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
  details?: string | null;
  title_cs?: string | null;
  description_cs?: string | null;
  details_cs?: string | null;
}

const pickCs = (cs: string | null | undefined, en: string | null | undefined, useCs: boolean) =>
  useCs && cs && cs.trim().length > 0 ? cs : en || "";

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
  const [detailsWebinar, setDetailsWebinar] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInitialSlug, setOrderInitialSlug] = useState<string | undefined>(undefined);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (slug === "live-webinars") {
      supabase
        .from("webinars")
        .select("*")
        .order("sort_order", { ascending: true })
        .then(({ data }) => {
          if (data) setWebinars(data as unknown as DbWebinar[]);
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
  const inquiryTitle =
    slug === "conflict-resolution"
      ? t("Conflict mediation/resolution", "Mediace / řešení konfliktů")
      : slug === "six-hats"
        ? t("The Six Hats Method for Meetings", "Metoda Šesti klobouků pro porady")
        : slug === "live-webinars"
          ? t("Live Webinars", "Online webináře")
          : serviceTitle;

  const subtitle = pickL(service.subtitle, lang);
  const seoDescRaw =
    (detail?.lead ? pickL(detail.lead, lang) : "") ||
    subtitle ||
    serviceHook ||
    `${serviceTitle} — Rokofsky Communication`;
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
            provider: {
              "@type": "Organization",
              name: "Rokofsky Communication",
              url: "https://howards-website.lovable.app/",
            },
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
                <p key={idx} className="text-xl text-muted-foreground font-light italic mb-2">
                  {pickL(line, lang)}
                </p>
              ))
            ) : (
              <>
                {serviceHook && <p className="text-xl text-muted-foreground italic mb-3 font-normal">{serviceHook}</p>}
                {detail?.lead && (
                  <p className="text-lg text-foreground/80 leading-relaxed mb-8 font-normal">
                    {pickL(detail.lead, lang)}
                  </p>
                )}
              </>
            )}

            <div
              className={`rounded-lg p-8 mb-12 mt-6 ${detail?.tone === "executive" ? "border border-gold/40 bg-card shadow-[0_20px_60px_-30px_hsl(var(--foreground)/0.55)]" : "glass"}`}
            >
              <h2
                className={
                  slug === "live-webinars"
                    ? "text-base font-semibold mb-6 w-full sm:text-2xl"
                    : "text-3xl md:text-4xl font-semibold mb-6 w-full"
                }
              >
                {slug === "live-webinars" && detail?.pageTitle
                  ? (() => {
                      const titleText = pickL(detail.pageTitle, lang);
                      const anchor = isCz ? "otázku" : "question";
                      const idx = titleText.toLowerCase().indexOf(anchor.toLowerCase());
                      const inquiryBtn = (
                        <span className="inline-flex items-center gap-3 whitespace-nowrap ml-2">
                          {idx >= 0 ? titleText.substr(idx, anchor.length) : ""}
                          <Button
                            variant="outline"
                            size="default"
                            className="text-sm md:text-base px-3 py-1 rounded-full min-h-0 h-auto bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
                            onClick={() => {
                              const el = document.getElementById("inquiry-form");
                              if (el) {
                                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                                window.scrollTo({ top, behavior: "smooth" });
                              }
                            }}
                          >
                            {t("General inquiry", "Obecný dotaz")}
                          </Button>
                        </span>
                      );
                      if (idx < 0) {
                        return (
                          <>
                            {titleText}
                            <div className="mt-2">{inquiryBtn}</div>
                          </>
                        );
                      }
                      const before = titleText.slice(0, idx);
                      return (
                        <>
                          {before}
                          {anchor}
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              size="default"
                              className="text-sm md:text-base px-3 py-1 rounded-full min-h-0 h-auto bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => {
                                const el = document.getElementById("inquiry-form");
                                if (el) {
                                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                                  window.scrollTo({ top, behavior: "smooth" });
                                }
                              }}
                            >
                              {t("General inquiry", "Obecný dotaz")}
                            </Button>
                          </div>
                        </>
                      );
                    })()
                  : detail?.pageTitle
                    ? pickL(detail.pageTitle, lang)
                    : t("About This Service", "O této službě")}
              </h2>

              {slug === "live-webinars" ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {webinars.map((webinar) => {
                      const wTitle = pickCs(webinar.title_cs, webinar.title, isCz);
                      const wDesc = pickCs(webinar.description_cs, webinar.description, isCz);
                      return (
                        <div
                          key={webinar.id}
                          className="flex flex-col justify-between rounded-lg border border-border bg-card p-2 md:p-5 hover:border-gold/50 transition-colors"
                        >
                          <div>
                            <h3 className="text-xs md:text-base font-semibold text-foreground mb-2">{wTitle}</h3>
                            {wDesc && (
                              <p className="hidden md:block text-foreground/60 text-sm font-normal leading-relaxed">
                                {wDesc}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 flex flex-row gap-3 w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs sm:text-sm whitespace-nowrap px-2"
                              onClick={() => setDetailsWebinar(webinar.id)}
                            >
                              {t("Details", "Detaily")}
                            </Button>
                            <button
                              style={{
                                backgroundColor: "#b8845a",
                                color: "#000000",
                                border: "none",
                                borderRadius: "12px",
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "500",
                                flex: 1,
                                whiteSpace: "nowrap",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a07040")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#b8845a")}
                              onClick={() => setExpandedWebinar(webinar.id)}
                            >
                              {t("Inquire", "Poptat")}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <WebinarDetailsModal
                    open={!!detailsWebinar}
                    onOpenChange={(open) => {
                      if (!open) setDetailsWebinar(null);
                    }}
                    title={(() => {
                      const w = webinars.find((x) => x.id === detailsWebinar);
                      return w ? pickCs(w.title_cs, w.title, isCz) : "";
                    })()}
                    details={(() => {
                      const w = webinars.find((x) => x.id === detailsWebinar);
                      return w ? pickCs(w.details_cs, w.details, isCz) : "";
                    })()}
                    onInquire={() => {
                      const id = detailsWebinar;
                      setDetailsWebinar(null);
                      if (id) setExpandedWebinar(id);
                    }}
                  />
                  <WebinarInquiryModal
                    open={!!expandedWebinar}
                    onOpenChange={(open) => {
                      if (!open) setExpandedWebinar(null);
                    }}
                    webinarTitle={(() => {
                      const w = webinars.find((x) => x.id === expandedWebinar);
                      return w ? pickCs(w.title_cs, w.title, isCz) : "";
                    })()}
                    onOrderNow={() => {
                      const w = webinars.find((x) => x.id === expandedWebinar);
                      setOrderInitialSlug(w?.slug);
                      setExpandedWebinar(null);
                      setShowOrderForm(true);
                    }}
                  />
                  <WebinarOrderForm
                    open={showOrderForm}
                    onOpenChange={setShowOrderForm}
                    initialWebinarSlug={orderInitialSlug}
                  />
                </>
              ) : (
                <MobileTruncatedText
                  paragraphs={
                    detail?.intro && detail.intro.length > 0
                      ? detail.intro.map((p) => pickL(p, lang)).filter((s) => s.trim().length > 0)
                      : [
                          t(
                            "Howard brings his signature blend of storytelling, practical frameworks, and just enough humor to keep everyone awake. This service is tailored to your team's specific needs, challenges, and goals.",
                            "Howard přináší svou typickou kombinaci vyprávění, praktických rámců a tak akorát humoru, aby všechny udržel vzhůru. Tato služba je šitá na míru konkrétním potřebám, výzvám a cílům vašeho týmu.",
                          ),
                          t(
                            "Every engagement starts with a brief discovery call to understand your context. From there, Howard designs a custom experience that delivers measurable improvements in how your team communicates, collaborates, and leads.",
                            "Každá spolupráce začíná krátkým úvodním hovorem, abychom porozuměli vašemu kontextu. Na jeho základě Howard navrhne na míru řešení, které přinese měřitelná zlepšení v tom, jak váš tým komunikuje, spolupracuje a vede.",
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
                <div
                  key={sectionIndex}
                  className={`${slug === "six-hats" && sectionIndex === detail.sections.length - 1 ? "mb-4" : "mb-10"}`}
                >
                  {detail?.tone !== "executive" && sectionTitle.trim().length > 0 && (
                    <h3 className="text-2xl font-semibold mb-2 whitespace-pre-line">{sectionTitle}</h3>
                  )}

                  {section.paragraphs &&
                    (detail?.tone === "executive" ? (
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
                    ))}

                  {section.numbered && (
                    <ol className="space-y-1.5 list-decimal pl-5 text-foreground/80 font-light leading-relaxed">
                      {section.numbered.map((item, i) => (
                        <li key={i} className="font-normal">
                          {pickL(item, lang)}
                        </li>
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
                              <h4
                                className="text-sm mb-1 font-extrabold"
                                style={{ color: hat.color === "#FFFFFF" ? "hsl(var(--foreground))" : hat.color }}
                              >
                                {hatLabel}
                              </h4>
                              <p className="text-foreground/70 font-light text-sm leading-relaxed">
                                {pickL(hat.description, lang)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {section.bullets && (
                    <ul
                      className={`grid ${slug === "storytelling" ? "gap-0.5" : "gap-0.5"} text-foreground/80 font-light leading-relaxed pl-0 whitespace-pre-line ${slug === "six-hats" && (section.title.en || "").includes("People who are comfortable") ? "mt-1" : ""}`}
                    >
                      {section.bullets.map((item, i) => {
                        const text = pickL(item, lang);
                        if (!text.trim()) return null;
                        const isKeynoteLaughLine =
                          slug === "keynote-speaking" && (item.en || "").includes("Still, you'll probably laugh");
                        return (
                          <li key={i} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span className="font-normal">
                              {text}
                              {isKeynoteLaughLine && (
                                <>
                                  {" "}
                                  <Link
                                    to={lp("/keynote-topics")}
                                    className="text-gold hover:text-gold/80 underline underline-offset-2 transition-colors"
                                  >
                                    {t(
                                      "Click to see some of the topics you can choose from",
                                      "Klikněte a podívejte se na témata, ze kterých si můžete vybrat",
                                    )}
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
                    <div className="px-5 py-4 border-t md:border-t-0 md:border-l border-border">
                      {t("What We Do", "Co děláme")}
                    </div>
                    <div className="px-5 py-4 border-t md:border-t-0 md:border-l border-border">
                      {t("The Outcome", "Výsledek")}
                    </div>
                  </div>
                  {detail.tableRows.map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1.5fr] text-sm text-foreground/80 font-light"
                    >
                      <div className="px-5 py-4 border-b border-border font-medium text-foreground">
                        {pickL(row.phase, lang)}
                      </div>
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
                "Fill in some stuff below (mostly optional) and I'll get back to you by tomorrow.",
                "Vyplňte níže pár údajů (většinou nepovinných) a ozvu se Vám do zítřka.",
              )}
            </p>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute top-2 left-0 right-0 z-10 flex justify-center">
                <Button
                  variant="glassPetrol"
                  size="sm"
                  className="rounded-full text-sm px-4 py-1.5 h-auto whitespace-nowrap"
                  onClick={openCalendly}
                >
                  {t("Skip the email, book a call now", "Zapomeňte na e-mail, rovnou si domluvte hovor")}
                </Button>
              </div>
              <ContactForm serviceName={serviceTitle} showServiceFields />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
