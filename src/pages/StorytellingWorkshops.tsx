import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";

const StorytellingWorkshops = () => {
  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Storytelling Workshops</h1>
            <p className="text-muted-foreground font-light mb-8 max-w-2xl leading-relaxed">
              In a world drowning in data, decks, and dashboards — the leaders who win are the ones who can tell a story. Howard's Storytelling Workshops teach your team to turn dry facts into compelling narratives that move people to action.
            </p>

            <div className="glass rounded-lg p-8 mb-12">
              <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
              <ul className="space-y-3 text-foreground/80 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✦</span>
                  The 3-Act Structure for Business: how to frame any message as a story
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✦</span>
                  Emotional hooks: why your audience forgets 90% of what you say (and how to be the 10%)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✦</span>
                  The "Anti-PowerPoint" method: presenting without a single bullet point
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✦</span>
                  Live practice sessions with real-time coaching
                </li>
              </ul>
            </div>
          </motion.div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
            <p className="text-muted-foreground font-light text-center mb-8">
              Ready to become the person everyone quotes at dinner?
            </p>
            <ContactForm serviceName="Storytelling Workshop" showServiceFields />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StorytellingWorkshops;
