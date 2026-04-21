import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import PdfThumbnail from "@/components/PdfThumbnail";
import { Button } from "@/components/ui/button";

const TOTAL_SCANS = 80;
const PAGE_SIZE = 10;
const BUCKET = "reference-scans";

interface ScanRow {
  slot_number: number;
  pdf_path: string;
  title: string | null;
}

const ReferenceScans = () => {
  const [scans, setScans] = useState<Record<number, ScanRow>>({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("reference_scans")
      .select("slot_number,pdf_path,title")
      .order("slot_number", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const map: Record<number, ScanRow> = {};
        for (const r of data as ScanRow[]) map[r.slot_number] = r;
        setScans(map);
      });
  }, []);

  const publicUrl = (path: string) =>
    supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const allRevealed = visibleCount >= TOTAL_SCANS;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              to="/references"
              className="text-sm text-accent hover:text-foreground transition-colors mb-6 inline-block font-medium"
            >
              ← Back to References
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Evaluation Forms Archive</h1>
            <p className="text-muted-foreground font-light mb-12 max-w-2xl">
              Scanned evaluation sheets from participants from past workshops. Click any scan to open the full form.
            </p>
          </motion.div>

          <div ref={gridTopRef} />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 px-0 lg:px-8">
            <AnimatePresence>
              {Array.from({ length: Math.min(visibleCount, TOTAL_SCANS) }, (_, i) => i + 1).map((slot) => {
                const scan = scans[slot];
                const url = scan ? publicUrl(scan.pdf_path) : undefined;

                if (!url) {
                  return (
                    <motion.div
                      key={slot}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted/30 animate-pulse">
                        <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-3">
                          <div className="w-3/4 h-2 bg-muted-foreground/10 rounded" />
                          <div className="w-1/2 h-2 bg-muted-foreground/10 rounded" />
                          <div className="w-2/3 h-2 bg-muted-foreground/10 rounded" />
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={slot}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link
                      to={`/references/scans/${slot}`}
                      className="block rounded-lg transition-all duration-300 hover:scale-105 hover:brightness-90 hover:shadow-xl"
                    >
                      <PdfThumbnail url={url} title={scan?.title ?? `Scan #${slot}`} />
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="text-center mt-10 space-y-4">
            {!allRevealed ? (
              <>
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, TOTAL_SCANS))}
                >
                  More evaluation forms from participants
                </Button>
                <div>
                  <button
                    onClick={scrollToTop}
                    className="text-sm text-accent hover:text-foreground transition-colors font-medium"
                  >
                    ↑ Scroll to Top
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground font-light">
                  All evaluation forms have been displayed.
                </p>
                <button
                  onClick={scrollToTop}
                  className="text-sm text-accent hover:text-foreground transition-colors font-medium"
                >
                  ↑ Scroll to Top
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ReferenceScans;
