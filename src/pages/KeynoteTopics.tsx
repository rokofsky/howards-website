import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface KeynoteTopic {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

const KeynoteTopics = () => {
  const lp = useLocalizedPath();
  const [topics, setTopics] = useState<KeynoteTopic[]>([]);

  useEffect(() => {
    supabase
      .from("keynote_topics")
      .select("id, title, description, sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setTopics(data);
      });
  }, []);

  return (
    <Layout>
      <section className="section-padding pt-24 font-normal">
        <div className="max-w-3xl mx-auto">
          <Link to={lp("/services/keynote-speaking")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Speaking Appearances
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Some topics you can choose from</h1>
            <p className="text-muted-foreground font-light mb-10">In addition to Howard's story of the month</p>
            <ul className="grid gap-4 text-foreground/80 font-light leading-relaxed pl-0">
              {topics.map((topic) => (
                <li key={topic.id} className="flex gap-3 min-h-[2rem]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <div>
                    <span>{topic.title}</span>
                    {topic.description && (
                      <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                    )}
                  </div>
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
