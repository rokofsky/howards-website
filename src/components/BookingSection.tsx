import { motion } from "framer-motion";
import { CALENDLY_URL } from "@/lib/calendly";

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

        {/* Calendly inline embed */}
        <div className="rounded-lg overflow-hidden" style={{ minHeight: 660 }}>
          <iframe
            src={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=1a1a2e&text_color=ffffff&primary_color=00b4d8`}
            width="100%"
            height="660"
            frameBorder="0"
            title="Book a call with Howard"
            className="w-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default BookingSection;
