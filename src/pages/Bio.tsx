import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";

const Bio = () => {
  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          >
            <div>
              <img
                src={hero1}
                alt="Howard"
                className="rounded-lg w-full object-cover aspect-[3/4]"
                width={600}
                height={800}
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Who is Howard</h1>
              <div className="space-y-4 text-foreground/80 font-light leading-relaxed">
                <p>
                  Howard is a soft-skills consultant, keynote speaker, and storytelling evangelist who has spent over 15 years helping leaders, teams, and organizations communicate with clarity, warmth, and — dare he say — a little flair.
                </p>
                <p>
                  Before becoming a consultant, Howard worked in corporate communications across three continents, learning firsthand that the gap between "good leadership" and "great leadership" is almost always a communication gap.
                </p>
                <p>
                  His workshops have been described as "the first training I've attended where nobody checked their phone" and "like a TED Talk, but you actually learn something you'll use tomorrow." Howard considers both of these the highest possible compliments.
                </p>
                <p>
                  When he's not on stage or in a boardroom, Howard writes about the intersection of storytelling, emotional intelligence, and modern leadership. He lives by one rule: if your audience is bored, it's your fault, not theirs.
                </p>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Credentials & Experience</h3>
                <ul className="space-y-2 text-sm text-foreground/70 font-light">
                  <li>• 15+ years in corporate consulting & training</li>
                  <li>• 500+ workshops delivered globally</li>
                  <li>• Certified Executive Coach (ICF)</li>
                  <li>• Published author on leadership communication</li>
                  <li>• Former Head of Internal Comms, Fortune 500</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Bio;
