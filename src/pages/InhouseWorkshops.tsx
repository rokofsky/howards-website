import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import InhouseInquiryModal from "@/components/InhouseInquiryModal";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/hooks/useT";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";

interface InhouseWorkshop {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  active: boolean;
  sort_order: number;
}

export default function InhouseWorkshops() {
  const t = useT();
  const lp = useLocalizedPath();
  const [workshops, setWorkshops] = useState<InhouseWorkshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | undefined>();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchInhouseWorkshops = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await (
          supabase.from("inhouse_workshops" as never) as never as {
            select: (cols: string) => {
              eq: (col: string, val: boolean) => {
                order: (col: string, opts: { ascending: boolean }) => Promise<{
                  data: InhouseWorkshop[] | null;
                  error: unknown;
                }>;
              };
            };
          }
        )
          .select("id, title, description, duration, active, sort_order")
          .eq("active", true)
          .order("sort_order", { ascending: true });

        if (supabaseError) throw supabaseError;

        setWorkshops(data || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load workshops.";
        console.error("Error fetching inhouse workshops:", err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchInhouseWorkshops();
  }, []);

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <h1 className="text-4xl md:text-5xl font-bold">{t("Inhouse Workshops", "Firemní workshopy")}</h1>
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
                <p className="text-destructive">{t("Error loading workshops.", "Chyba při načítání workshopů.")}</p>
              </div>
            ) : workshops.length === 0 ? (
              <div className="glass rounded-lg p-8">
                <p className="text-muted-foreground font-light">
                  {t(
                    "No active workshops are available at the moment. Please check back soon!",
                    "Momentálně nejsou k dispozici žádné aktivní workshopy. Zkuste to prosím později!",
                  )}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workshops.map((workshop, index) => (
                  <motion.div
                    key={workshop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-lg border border-border/50 p-6 hover:border-gold/40 transition-all"
                  >
                    <h2 className="text-xl font-semibold mb-3">{workshop.title}</h2>
                    {workshop.description ? (
                      <p className="text-sm text-muted-foreground font-normal leading-relaxed">{workshop.description}</p>
                    ) : null}
                    {workshop.duration ? (
                      <p className="text-sm font-medium mt-3">
                        {t("Duration:", "Délka:")} {workshop.duration}
                      </p>
                    ) : null}
                    <div className="mt-4">
                      <Button
                        variant="cta"
                        size="sm"
                        onClick={() => {
                          setSelectedWorkshop(workshop.title);
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

      <InhouseInquiryModal
        open={inquiryOpen}
        onOpenChange={(o) => {
          setInquiryOpen(o);
          if (!o) setSelectedWorkshop(undefined);
        }}
        preselectedWorkshop={selectedWorkshop}
      />
    </Layout>
  );
}
