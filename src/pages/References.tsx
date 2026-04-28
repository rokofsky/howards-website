import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import PdfThumbnail from "@/components/PdfThumbnail";
import { useT } from "@/hooks/useT";
import { useIsCzech } from "@/hooks/useLanguageRouting";

const testimonials = [
  { name: "Sarah K., VP People, TechCorp", text: "Howard completely transformed how our leadership team communicates. The storytelling framework he taught us is now embedded in our culture." },
  { name: "Marcus T., CEO, BrightPath", text: "I was skeptical about 'soft skills training' until Howard made our entire C-suite laugh, cry, and rethink everything in four hours." },
  { name: "Dr. Lena W., University of Munich", text: "Howard's approach to conflict resolution is unlike anything I've seen in 20 years of organizational psychology. Practical, humane, and surprisingly funny." },
  { name: "Anja R., Head of HR, Siemens Energy", text: "We've brought Howard back three times now. Each session builds on the last, and the team keeps asking for more." },
  { name: "Thomas B., Managing Director, Kiefel GmbH", text: "Howard's negotiation workshop saved us more in one quarter than we spent on the entire training program. No exaggeration." },
  { name: "Lisa M., L&D Manager, Allianz", text: "The brainstorming session Howard facilitated produced more actionable ideas in three hours than our team had generated in six months." },
];

const BUCKET = "reference-scans";

interface ScanRow {
  slot_number: number;
  pdf_path: string;
  title: string | null;
  thumbnail_path: string | null;
}

const References = () => {
  const t = useT();
  const lp = useLocalizedPath();
  const isCz = useIsCzech();
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const visibleTestimonials = showAllTestimonials ? testimonials : testimonials.slice(0, 3);
  const [previewScans, setPreviewScans] = useState<Record<number, ScanRow>>({});


  useEffect(() => {
    supabase
      .from("reference_scans")
      .select("slot_number,pdf_path,title,thumbnail_path")
      .lte("slot_number", 6)
      .order("slot_number", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const map: Record<number, ScanRow> = {};
        for (const r of data as ScanRow[]) map[r.slot_number] = r;
        setPreviewScans(map);
      });
  }, []);

  const publicUrl = (path: string) =>
    supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("References", "Reference")}
            </h1>
            <p className="text-muted-foreground font-light mb-12 max-w-2xl">
              {t(
                "Don't take Howard's word for it. Here's what people say when he's not looking.",
                "Nemusíte věřit jen Howardovi. Zde je, co o něm říkají lidé, když se nedívá."
              )}
            </p>
          </motion.div>

          {/* Testimonials */}
          <div className="space-y-6 mb-8">
            {visibleTestimonials.map((t, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-lg p-8"
              >
                <p className="text-foreground/80 font-light leading-relaxed italic mb-4">"{t.text}"</p>
                <cite className="text-sm text-muted-foreground font-medium not-italic">— {t.name}</cite>
              </motion.blockquote>
            ))}
          </div>

          {!showAllTestimonials && (
            <div className="text-center mb-12">
              <Button variant="glass" size="lg" onClick={() => setShowAllTestimonials(true)}>
                {t(
                  "More testimonials from clients and participants",
                  "Více ohlasů od klientů a účastníků"
                )}
              </Button>
            </div>
          )}

          {/* Evaluation Forms Link - always visible */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {t("Evaluation forms from participants", "Hodnotící formuláře od účastníků")}
              </h2>
            </div>
            <p className="text-muted-foreground font-light mb-8">
              {t(
                "Scanned evaluation sheets from past workshops. Click to view full size.",
                "Naskenované hodnotící formuláře z minulých workshopů. Kliknutím zobrazíte v plné velikosti."
              )}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => {
                const scan = previewScans[i];
                const url = scan ? publicUrl(scan.pdf_path) : undefined;
                if (url) {
                  return (
                    <Link
                      key={i}
                      to={lp(`/references/scans/${i}`)}
                      className="block rounded-lg transition-all duration-300 hover:scale-105 hover:brightness-90 hover:shadow-xl"
                    >
                      <PdfThumbnail url={url} title={scan?.title ?? `Scan #${i}`} thumbnailUrl={scan?.thumbnail_path ? publicUrl(scan.thumbnail_path) : undefined} />
                    </Link>
                  );
                }
                return (
                  <div key={i} className="aspect-[3/4] glass rounded-lg flex flex-col items-center justify-center p-3">
                    <span className="text-sm text-muted-foreground font-light">Scan #{i}</span>
                    <span className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider">Placeholder</span>
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <Button variant="glass" size="lg" asChild>
                <a href={lp("/references/scans")}>
                  {t(
                    "More Evaluation-forms from participants",
                    "Více hodnotících formulářů od účastníků"
                  )}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default References;
