import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { openCalendly } from "@/lib/calendly";
import { useTranslation } from "react-i18next";

const BookingSection = () => {
  const { t } = useTranslation();
  return (
    <section id="contact-area" className="section-padding bg-primary text-primary-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("booking.heading")}</h2>
        <p className="text-primary-foreground/70 font-light mb-10 max-w-md mx-auto whitespace-pre-line">
          {t("booking.subheading")}
        </p>

        <Button variant="glassPetrol" size="xl" onClick={openCalendly}>
          {t("buttons.bookFreeCall")}
        </Button>
      </motion.div>
    </section>
  );
};

export default BookingSection;
