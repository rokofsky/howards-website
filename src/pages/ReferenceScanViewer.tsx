import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "reference-scans";

interface ScanRow {
  slot_number: number;
  pdf_path: string;
  title: string | null;
}

const ReferenceScanViewer = () => {
  const { slot } = useParams<{ slot: string }>();
  const [scan, setScan] = useState<ScanRow | null>(null);
  const [loading, setLoading] = useState(true);

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

  const pdfUrl = scan
    ? supabase.storage.from(BUCKET).getPublicUrl(scan.pdf_path).data.publicUrl
    : null;

  const title = scan?.title ?? `Scan #${slot}`;

  return (
    <Layout>
      <section className="section-padding pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" size="default" asChild className="mb-6">
            <Link to="/references/scans">
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
              <div className="w-full rounded-lg overflow-hidden border border-border/30 bg-background">
                <iframe
                  src={`${pdfUrl}#view=FitH`}
                  title={title}
                  className="w-full"
                  style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ReferenceScanViewer;
