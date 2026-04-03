import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const topics = [
  "How to give the right instructions",
  "Brain Gym: get those hemispheres working together",
  "Emotional Intelligence: how it really can make your life easier",
  "Increase your powers of perception",
  "EQ & Leadership: how they go hand-in-hand",
  "Work-life Balance",
  "8 Intelligences and how to increase yours",
  "Self-motivation and concentration",
  "Time Management in 5 minutes a day",
];

const KeynoteTopics = () => {
  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-3xl mx-auto">
          <Link to="/services/keynote-speaking" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Speaking Appearances
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Some of the topics you can choose from</h1>
            <p className="text-muted-foreground font-light mb-10">In addition to Howard's story of the month.</p>
            <ul className="grid gap-1.5 text-foreground/80 font-light leading-relaxed pl-0">
              {topics.map((topic) => (
                <li key={topic} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <span>{topic}</span>
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
