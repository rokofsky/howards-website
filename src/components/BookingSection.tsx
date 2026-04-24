import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { openCalendly } from "@/lib/calendly";
import { useT } from "@/hooks/useT";

const BookingSection = () => {
  const t = useT();
  return (
    <section id="contact-area" className="section-padding bg-primary text-primary-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("Book a Zoom Call", "Domluvte si Zoom hovor")}
        </h2>
        <p className="text-primary-foreground/70 font-light mb-10 max-w-md mx-auto whitespace-pre-line">
          {t(
            "Skip the email tennis. Pick a time, get a link,\nand let's talk like actual humans.",
            "Žádný e-mailový ping-pong. Vyberte si čas, dostanete odkaz\na promluvíme si jako skuteční lidé."
          )}
        </p>

        <Button variant="glassPetrol" size="xl" onClick={openCalendly}>
          {t("Book a free call with Howard", "Zamluvit bezplatný hovor s Howardem")}
        </Button>
      </motion.div>
    </section>
  );
};

export default BookingSection;
