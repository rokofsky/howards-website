import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { services } from "@/data/services";
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
  const hasSubtitle = subtitle && subtitle.trim() !== "" && subtitle !== "\\n";
  const hasHook = hook && hook.trim() !== "" && hook !== "\\n";
  const secondaryText = hasSubtitle ? subtitle : hasHook ? hook : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/services/${slug}`}
        className="group block relative h-28 md:h-64 rounded-lg overflow-hidden transition-transform duration-300 md:hover:scale-[1.03] active:brightness-90 active:duration-150"
      >
        <img
          src={serviceBg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={800}
          height={800}
        />
        <div className="absolute inset-0 bg-foreground/10 md:group-hover:bg-foreground/15 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center p-2 md:p-6">
          <div className="relative z-10 flex max-w-full flex-col items-center justify-center text-center">
            <h3 className="mb-0.5 text-xs font-bold leading-tight text-primary-foreground transition-colors duration-300 ease-out md:mb-1 md:text-2xl md:group-hover:text-foreground">
              <span id={`service-title-${slug}`} className="block">
                {title}
              </span>
            </h3>
            {showSecondaryText ? (
              <p className="min-h-[1.25rem] text-sm font-semibold leading-tight text-primary-foreground/85 transition-colors duration-300 ease-out md:group-hover:text-foreground">
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
  return (
    <section id="services" className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">What can I do for you?</h2>
        <p className="max-w-md mx-auto whitespace-pre-line text-primary font-semibold">
          Nine practical tools to immediately improve how{"\n"}you and your team functions
        </p>
      </motion.div>

      <div className="hidden md:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((s, i) => (
          <ServiceCard key={s.id} {...s} index={i} showSecondaryText />
        ))}
      </div>

      <div className="md:hidden grid grid-cols-3 gap-2">
        {services.map((s, i) => (
          <ServiceCard key={s.id} {...s} index={i} showSecondaryText={false} />
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;
