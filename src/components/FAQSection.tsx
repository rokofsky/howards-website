import { motion } from "framer-motion";

const FAQSection = () => {
  const faqs = [
    { q: "What makes Howard different from other consultants?", a: "Howard doesn't do jargon, frameworks that need a PhD, or workshops where you 'share your feelings with the group.' He delivers practical, memorable skills wrapped in storytelling — so your team actually remembers Monday's training by Thursday." },
    { q: "How long are the workshops?", a: "Most workshops run 3–6 hours, though Howard has been known to do intensive full-day sessions for teams that really want to go deep. Half-day sessions are the sweet spot for most." },
    { q: "Do you work with remote teams?", a: "Absolutely. Howard has run over 200 virtual workshops. Turns out storytelling works just as well through a screen — as long as nobody's on mute." },
    { q: "What's the investment?", a: "It depends on the scope, group size, and whether Howard needs to fly somewhere nice. Get in touch for a custom quote — he promises not to use the word 'synergy.'" },
  ];

  return (
    <section id="faq" className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
        <p className="text-muted-foreground font-light">Questions I hope you would ask.</p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <motion.details
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-lg group"
          >
            <summary className="cursor-pointer p-6 text-base font-medium list-none flex justify-between items-center">
              {faq.q}
              <span className="text-muted-foreground transition-transform duration-200 group-open:rotate-45 text-xl ml-4">+</span>
            </summary>
            <div className="px-6 pb-6 text-sm text-muted-foreground font-light leading-relaxed">
              {faq.a}
            </div>
          </motion.details>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
