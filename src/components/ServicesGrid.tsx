import { Link } from "react-router-dom";
import { useLocalizedPath, useIsCzech } from "@/hooks/useLanguageRouting";
import { motion } from "framer-motion";
import { useT } from "@/hooks/useT";
import { services } from "@/data/services";
import { pickL } from "@/data/serviceDetails";
import serviceBg from "@/assets/service-bg.jpg";

const ServiceCard = ({
  title,
  subtitle,
  hook,
  slug,
  index,
  showSecondaryText,
}: {
  title: string;
  subtitle: string;
  hook: string;
  slug: string;
  index: number;
  showSecondaryText: boolean;
}) => {
  const lp = useLocalizedPath();
  const hasSubtitle = subtitle && subtitle.trim() !== "" && subtitle !== "\\n";
  const hasHook = hook && hook.trim() !== "" && hook !== "\\n";
  const secondaryText = hasSubtitle ? subtitle : hasHook ? hook : "";
  const handleServiceClick = () => {
    window.dispatchEvent(new CustomEvent("rokofsky:service-active", { detail: { slug } }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      data-service-card
      data-service-title={title}
    >
      <Link
        to={lp(`/services/${slug}`)}
        onClick={handleServiceClick}
        className="group block relative h-32 sm:h-44 md:h-48 rounded-lg overflow-hidden transition-transform duration-300 md:hover:scale-[1.03] active:brightness-90 active:duration-150 [@media(hover:none)]:hover:scale-100"
      >
        <img
          src={serviceBg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width={800}
          height={800}
        />
        <div className="absolute inset-0 bg-foreground/10 md:group-hover:bg-foreground/15 [@media(hover:none)]:group-hover:bg-foreground/10 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
          <div className="relative z-10 flex max-w-full flex-col items-center justify-center text-center gap-1">
            <h3 className="text-sm sm:text-base font-bold leading-tight text-primary-foreground transition-colors duration-300 ease-out md:text-2xl md:group-hover:text-foreground [@media(hover:none)]:group-hover:text-primary-foreground">
              <span id={`service-title-${slug}`} className="block">
                {title}
              </span>
            </h3>
            {showSecondaryText ? (
              <p className="text-xs sm:text-sm font-semibold leading-tight text-primary-foreground/85 transition-colors duration-300 ease-out md:group-hover:text-foreground [@media(hover:none)]:group-hover:text-primary-foreground/85">
                <span id={`service-subtitle-${slug}`} className="block">
                  {secondaryText || "\u00A0"}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ServicesGrid = () => {
  const t = useT();
  return (
    <section id="services" className="section-padding pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {t("What can I do for you?", "Co pro Vás mohu udělat?")}
        </h2>
        <p className="max-w-md mx-auto whitespace-pre-line text-primary font-semibold">
          {t(
            "Nine practical tools to immediately improve how\nyou and your team functions",
            "Devět praktických nástrojů, které okamžitě zlepší,\njak fungujete Vy i Váš tým",
          )}
        </p>
      </motion.div>

      <ServiceGridInner />
    </section>
  );
};

const ServiceGridInner = () => {
  const isCz = useIsCzech();
  const lang: "en" | "cs" = isCz ? "cs" : "en";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
      {services.map((s, i) => (
        <ServiceCard
          key={s.id}
          slug={s.slug}
          title={pickL(s.title, lang)}
          subtitle={pickL(s.subtitle, lang)}
          hook={pickL(s.hook, lang)}
          index={i}
          showSecondaryText
        />
      ))}
    </div>
  );
};

export default ServicesGrid;
