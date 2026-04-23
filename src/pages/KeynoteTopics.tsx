import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";
import { ArrowLeft } from "lucide-react";

const topics = [
  "How to give proper directions & instructions",
  "Brain Gym: get the hemispheres working together",
  "Emotional Intelligence: how it can make your life easier",
  "Increase your memory!",
  "EQ & Leadership: how they go hand-in-hand",
  "Work-life Balance -- is it for me?",
  "8 Intelligences and how to increase yours",
  "Self-motivation and concentration",
  "Time Management in 5 minutes a day",
];

const KeynoteTopics = () => {
  return (
    <Layout>
      <section className="section-padding pt-24 font-normal">
        <div className="max-w-3xl mx-auto">
          <Link to="/services/keynote-speaking" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Speaking Appearances
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Some topics you can choose from</h1>
            <p className="text-muted-foreground font-light mb-10">In addition to Howard's story of the month</p>
            <ul className="grid gap-1.5 text-foreground/80 font-light leading-relaxed pl-0">
              {topics.map((topic, i) => (
                <li key={i} className="flex gap-3 min-h-[2rem]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <span>{topic || "\u00A0"}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default KeynoteTopics;
