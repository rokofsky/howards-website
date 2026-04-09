import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { openCalendly } from "@/lib/calendly";

const BookingSection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Book a Zoom Call</h2>
        <p className="text-primary-foreground/70 font-light mb-10 max-w-md mx-auto">
          Skip the email tennis. Pick a time, get a link,<br />
          and let's talk like actual humans.
        </p>

        {/* Calendly placeholder */}
        <div className="glass rounded-lg p-12 bg-primary-foreground/5 border-primary-foreground/10 mb-8">
          <p className="text-primary-foreground/50 font-light text-sm">
            📅 Calendar widget placeholder — Calendly or SavvyCal embed goes here
          </p>
        </div>

        <Button variant="cta" size="xl" onClick={openCalendly}>
          Skip the email, book a call now
        </Button>
      </motion.div>
    </section>
  );
};

export default BookingSection;
