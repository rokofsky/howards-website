import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import KeynoteInquiryModal from "@/components/KeynoteInquiryModal";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/hooks/useT";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";

interface KeynoteTopic {
  id: string;
  title: string;
  description: string | null;
  active: boolean;
  sort_order: number;
}

export default function KeynoteTopics() {
  const t = useT();
  const lp = useLocalizedPath();
  const [topics, setTopics] = useState<KeynoteTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchKeynoteTopics = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("keynote_topics")
          .select("id, title, description, active, sort_order")
          .eq("active", true)
          .order("sort_order", { ascending: true });

        if (supabaseError) throw supabaseError;

        setTopics(data || []);
      } catch (err: any) {
        console.error("Error fetching keynote topics:", err);
        setError(err.message || "Failed to load topics.");
      } finally {
        setLoading(false);
      }
    };

    fetchKeynoteTopics();
  }, []);

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <h1 className="text-4xl md:text-5xl font-bold">{t("Suggested keynote speaking topics", "Doporučená témata keynote projevů")}</h1>
              <div className="flex items-center gap-6">
                <Button variant="outline" asChild>
                  <Link to={lp("/#pricing")} className="inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("Back to pricing", "Zpět na ceník")}
                  </Link>
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass rounded-lg border border-border/50 p-6 animate-pulse space-y-4"
                  >
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="glass rounded-lg border border-destructive/30 bg-destructive/10 p-8">
                <p className="text-destructive">{t("Error loading topics.", "Chyba při načítání témat.")}</p>
              </div>
            ) : topics.length === 0 ? (
              <div className="glass rounded-lg p-8">
                <p className="text-muted-foreground font-light">
                  {t(
                    "No active topics are available at the moment. Please check back soon!",
                    "Momentálně nejsou k dispozici žádná aktivní témata. Zkuste to prosím později!",
                  )}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-lg border border-border/50 p-6 hover:border-gold/40 transition-all"
                  >
                    <h2 className="text-xl font-semibold mb-3">{topic.title}</h2>
                    {topic.description ? (
                      <p className="text-sm text-muted-foreground font-normal leading-relaxed">{topic.description}</p>
                    ) : null}
                    <div className="mt-4">
                      <Button
                        variant="cta"
                        size="sm"
                        onClick={() => {
                          setSelectedTopic(topic.title);
                          setInquiryOpen(true);
                        }}
                      >
                        {t("Inquire", "Poptat")}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-12">
              <Button variant="outline" asChild>
                <Link to={lp("/#pricing")} className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t("Back to pricing", "Zpět na ceník")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <KeynoteInquiryModal
        open={inquiryOpen}
        onOpenChange={(o) => {
          setInquiryOpen(o);
          if (!o) setSelectedTopic(undefined);
        }}
        preselectedTopic={selectedTopic}
      />
    </Layout>
  );
}
