import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import PdfThumbnail from "@/components/PdfThumbnail";

const TOTAL_SCANS = 80;
const BUCKET = "reference-scans";

interface ScanRow {
  slot_number: number;
  pdf_path: string;
  title: string | null;
}

const ReferenceScans = () => {
  const [scans, setScans] = useState<Record<number, ScanRow>>({});

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
              Scanned evaluation sheets from past workshops. Click any scan to open the full PDF.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: TOTAL_SCANS }, (_, i) => i + 1).map((slot, i) => {
              const scan = scans[slot];
              const url = scan ? publicUrl(scan.pdf_path) : undefined;

              if (!url) {
                return (
                  <motion.div
                    key={slot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.01, 0.5) }}
                  >
                    <div className="aspect-[3/4] glass rounded-lg flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-xs text-muted-foreground font-light">
                        Scan #{slot}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider">
                        Placeholder
                      </span>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={slot}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.01, 0.5) }}
                >
                  <Link to={`/references/scans/${slot}`} className="block hover:shadow-lg transition-shadow rounded-lg">
                    <PdfThumbnail url={url} title={scan?.title ?? `Scan #${slot}`} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ReferenceScans;
