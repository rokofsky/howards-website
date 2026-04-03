import { motion } from "framer-motion";

const FAQSection = () => {
  const faqs = [
    { q: "What makes Howard different from other consultants?", a: "I do things differently — this will be apparent from the outset, from uncommon professional ethics through transparent communication to generous outputs. You'll immediately notice a lack of (tolerance for) fluff, and a focus on clarity, open-mindedness, and new options. Because I believe in skin in the game, I offer success-fee structures on certain activities, especially Brainstorming sessions and Meetings with Six Hats. It keeps me sharp and keeps you certain." },
    { q: "Do you work with remote teams?", a: "Absolutely. Howard has run over 200 virtual workshops and events since covid. Telling a story works just as well through a screen — as long as you're not on mute." },
    { q: "How long are the workshops?", a: "Thanks to video conferencing, all workshops can be tailored to any amount of time (2 - 2½ hours recommended) and spread over any number of sessions. In-person training is usually 3-6 hours, for one or two days. Half-day sessions are the sweet spot for most, though Presentation Skills is usually two intensive days for a room full of people." },
    { q: "What's the investment?", a: "Depending on the scope, group size, travel, we're talking a daily rate between 1000 and 2000 Euros, prorated. To all the overpriced consultants out there, there's no reason to be greedy. There are various success fee options for certain services, get in touch for a custom quote — I promise not to use the word 'synergy'." },
    { q: "Is there some guarantee I'm not wasting money?", a: "Howard has always included a satisfaction guarantee in T&C since his first website in 2004. It reads like this: \"I am not satisfied until you are satisfied. If a client is disappointed with a service, we will agree to continue working on it at no extra charge, until client is satisfied. Or, you can fire me on the spot and I'll cancel the invoice.\" Simple as that." },
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
        <p className="text-muted-foreground font-light">Questions I hope you're asking</p>
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
