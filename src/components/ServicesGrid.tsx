import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import serviceBg from "@/assets/service-bg.jpg";

const ServiceCard = ({ title, subtitle, hook, slug, index }: { title: string; subtitle: string; hook: string; slug: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
  >
    <Link
      to={`/services/${slug}`}
      className="group block relative h-28 md:h-64 rounded-lg overflow-hidden"
    >
      <img
        src={serviceBg}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        width={800}
        height={800}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/10 group-hover:from-foreground/90 transition-all duration-300" />
      <div className="absolute inset-0 flex flex-col justify-end p-2 md:p-6">
        <h3 className="text-xs md:text-lg font-semibold text-primary-foreground mb-0.5">{title}</h3>
        {subtitle && <p className="hidden md:block text-sm font-light text-primary-foreground/70 mb-1">{subtitle}</p>}
        {hook && <p className="hidden md:block text-sm font-light text-primary-foreground/70 whitespace-pre-line">{hook}</p>}
      </div>
    </Link>
  </motion.div>
);

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
          Nine tools to make your life easier{"\n"}and/or more pleasant
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
