import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import serviceBg from "@/assets/service-bg.jpg";

const ServiceCard = ({ title, subtitle, hook, slug, index }: { title: string; subtitle: string; hook: string; slug: string; index: number }) => {
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 md:p-6">
          <h3 className="text-xs md:text-2xl font-bold text-primary-foreground md:group-hover:text-foreground transition-colors duration-300 mb-0.5 md:mb-1">
            {title}
          </h3>
          <p className="hidden md:block text-sm font-semibold text-primary-foreground/70 md:group-hover:text-foreground/70 transition-colors duration-300">
            {secondaryText || "\u00A0"}
          </p>
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

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((s, i) => (
          <ServiceCard key={s.id} {...s} index={i} />
        ))}
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-3 gap-2">
        {services.map((s, i) => (
          <ServiceCard key={s.id} {...s} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;
