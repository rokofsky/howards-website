import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { services } from "@/data/services";
import { motion } from "framer-motion";
import { serviceDetails } from "@/data/serviceDetails";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);
  const detail = slug ? serviceDetails[slug] : undefined;

  if (!service) {
    return (
      <Layout>
        <div className="section-padding pt-24 text-center">
          <h1 className="text-3xl font-bold">Service not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{service.title}</h1>

            {detail?.taglines ? (
              detail.taglines.map((line) => (
                <p key={line} className="text-xl text-muted-foreground font-light italic mb-2">{line}</p>
              ))
            ) : (
              <>
                {service.hook && <p className="text-xl text-muted-foreground font-light italic mb-3">{service.hook}</p>}
                {detail?.lead && <p className="text-lg text-foreground/80 font-light leading-relaxed mb-8">{detail.lead}</p>}
              </>
            )}

            <div className={`rounded-lg p-8 mb-12 mt-6 ${detail?.tone === "executive" ? "border border-gold/40 bg-card shadow-[0_20px_60px_-30px_hsl(var(--foreground)/0.55)]" : "glass"}`}>
              <h2 className="text-xl md:text-2xl font-semibold mb-6">{detail?.pageTitle ?? "About This Service"}</h2>

              <div className="space-y-4">
                {(detail?.intro ?? [
                  "Howard brings his signature blend of storytelling, practical frameworks, and just enough humor to keep everyone awake. This service is tailored to your team's specific needs, challenges, and goals.",
                  "Every engagement starts with a brief discovery call to understand your context. From there, Howard designs a custom experience that delivers measurable improvements in how your team communicates, collaborates, and leads.",
                ]).map((paragraph) => (
                  <p key={paragraph} className="text-foreground/80 font-light leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {detail?.highlight && (
              <div className="mb-12 rounded-lg border border-gold/50 bg-card px-6 py-5 shadow-[0_24px_60px_-36px_hsl(var(--foreground)/0.7)]">
                <h3 className="text-lg font-semibold mb-2">{detail.highlight.title}</h3>
                <p className="text-foreground/80 font-light leading-relaxed">{detail.highlight.text}</p>
              </div>
            )}

            {detail?.sections.map((section) => (
              <div key={section.title} className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>

                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-foreground/80 font-light leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}

                {section.numbered && (
                  <ol className="space-y-1.5 list-decimal pl-5 text-foreground/80 font-light leading-relaxed">
                    {section.numbered.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                )}

                {section.bullets && (
                  <ul className="grid gap-1.5 text-foreground/80 font-light leading-relaxed pl-0">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {detail?.tableRows && detail.tableTitle && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-4">{detail.tableTitle}</h3>
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1.5fr] border-b border-border bg-muted/30 text-sm font-medium text-foreground/80">
                    <div className="px-5 py-4">Phase</div>
                    <div className="px-5 py-4 border-t md:border-t-0 md:border-l border-border">What We Do</div>
                    <div className="px-5 py-4 border-t md:border-t-0 md:border-l border-border">The Outcome</div>
                  </div>
                  {detail.tableRows.map((row) => (
                    <div key={row.phase} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1.5fr] text-sm text-foreground/80 font-light">
                      <div className="px-5 py-4 border-b border-border font-medium text-foreground">{row.phase}</div>
                      <div className="px-5 py-4 border-b border-border md:border-l">{row.action}</div>
                      <div className="px-5 py-4 border-b border-border md:border-l">{row.outcome}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-center mb-2">Inquire About {service.title}</h2>
            <p className="text-muted-foreground font-light text-center mb-8">
              Fill in some stuff below and I'll get back to you next day.
            </p>
            <ContactForm serviceName={service.title} showServiceFields />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
