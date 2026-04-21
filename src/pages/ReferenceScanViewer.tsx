import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BUCKET = "reference-scans";

interface ScanRow {
  slot_number: number;
  pdf_path: string;
  title: string | null;
}

const ReferenceScanViewer = () => {
  const { slot } = useParams<{ slot: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<ScanRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(700);

  useEffect(() => {
    if (!slot) return;
    supabase
      .from("reference_scans")
      .select("slot_number,pdf_path,title")
      .eq("slot_number", parseInt(slot, 10))
      .maybeSingle()
      .then(({ data }) => {
        setScan(data as ScanRow | null);
        setLoading(false);
      });
  }, [slot]);

  // Responsive width
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPageWidth(w - 32);
      else if (w < 1024) setPageWidth(Math.min(w - 64, 680));
      else setPageWidth(700);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pdfUrl = scan
    ? supabase.storage.from(BUCKET).getPublicUrl(scan.pdf_path).data.publicUrl
    : null;

  const title = scan?.title ?? `Scan #${slot}`;

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        navigate("/references");
      }
    },
    [navigate]
  );

  return (
    <Layout>
      {/* Full-height click-to-exit backdrop */}
      <section
        className="section-padding pt-24 pb-12 min-h-[calc(100vh-4rem)] cursor-pointer"
        onClick={handleBackdropClick}
        role="presentation"
      >
        <div
          className="max-w-4xl mx-auto cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="outline" size="default" asChild className="mb-6">
            <Link to="/references">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to References
            </Link>
          </Button>

          {loading && (
            <p className="text-muted-foreground font-light">Loading…</p>
          )}

          {!loading && !pdfUrl && (
            <p className="text-muted-foreground font-light">
              No scan found for slot #{slot}.
            </p>
          )}

          {pdfUrl && (
            <>
              <h1 className="text-2xl font-bold mb-6">{title}</h1>
              <div className="flex justify-center">
                <div className="rounded-lg overflow-hidden border border-border/30 bg-white inline-block">
                  <Document
                    file={pdfUrl}
                    loading={
                      <div className="flex items-center justify-center p-12">
                        <span className="text-muted-foreground text-sm">Loading PDF…</span>
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center p-12">
                        <span className="text-destructive text-sm">Failed to load PDF.</span>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={1}
                      width={pageWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ReferenceScanViewer;
