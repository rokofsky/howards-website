import { motion } from "framer-motion";

const PricingSection = () => {
  const tiers = [
    {
      name: "Online Workshops",
      price: "From CZK 4,000 (€165)",
      description: "From 2 hours to a full day of interactive team learning.",
      features: ["2–6 hour sessions", "Up to 100 participants", "Flexible timing options", "Follow-up resources", "Post-workshop debrief"],
      highlighted: true,
    },
    {
      name: "Inhouse Workshops",
      price: "From CZK 24,500 (€1000)",
      description: "Training for teams.",
      features: ["Modules can be combined", "Custom exercises & materials", "Team assessments", "Follow-up resources", "Post-workshop debrief"],
    },
    {
      name: "Keynote Speaking",
      price: "From CZK 30,000 (€1,200)",
      description: "A one-time speaking engage-ment that your audience will talk about for days.",
      features: ["60–90 minute session", "Custom topic & storytelling", "Q&A session included", "Recording rights available"],
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-[sidebar-primary-foreground] bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Investment</h2>
        <p className="text-primary font-semibold">No hidden fees. No surprise "strategy sessions." Just clear pricing.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-lg p-8 ${tier.highlighted ? "glass glow-gold border-gold/20" : "glass"}`}
          >
            <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
            <p className="text-2xl font-bold text-gold mb-3">{tier.price}</p>
            <p className="text-sm text-muted-foreground mb-6 font-normal">{tier.description}</p>
            <ul className="space-y-2">
              {tier.features.map((f, j) => (
                <li key={j} className="text-sm text-foreground/80 flex items-start gap-2 font-normal">
                  <span className="text-gold mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
