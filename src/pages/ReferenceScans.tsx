import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

// Placeholder slots for scanned evaluation form PDFs.
// To fill a slot: drop the PDF in `public/scans/` (e.g. `public/scans/scan-7.pdf`)
// and set `pdfUrl: "/scans/scan-7.pdf"` on the matching entry below.
interface ScanPlaceholder {
  id: number;
  pdfUrl?: string;
  title?: string;
}

const TOTAL_SCANS = 80;
const scans: ScanPlaceholder[] = Array.from({ length: TOTAL_SCANS }, (_, i) => ({
  id: i + 1,
}));

const ReferenceScans = () => {
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
            {scans.map((scan, i) => {
              const inner = (
                <div className="aspect-[3/4] glass rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow p-3 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground font-light">
                    {scan.title ?? `Scan #${scan.id}`}
                  </span>
                  {!scan.pdfUrl && (
                    <span className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider">
                      Placeholder
                    </span>
                  )}
                </div>
              );

              return (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.01, 0.5) }}
                >
                  {scan.pdfUrl ? (
                    <a href={scan.pdfUrl} target="_blank" rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
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
